import { Router } from 'express';
import NodeCache from 'node-cache';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';
import { Problem } from '../model/Problem';

const judge0Route = Router();
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

function b64dec(s?: string | null) {
  if (!s) return '';
  return Buffer.from(s, 'base64').toString('utf8');
}

function b64enc(s: string) {
  return Buffer.from(s, 'utf8').toString('base64');
}

function wrapJava(userSrc: string, harness: string) {
  return (
    'import java.util.*;\n' +
    '\n' +
    userSrc.trim() +
    '\n\n' +
    'public class Main {\n' +
    '  public static void main(String[] args) {\n' +
    harness.trim() +
    '\n' +
    '  }\n' +
    '}\n'
  );
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function safeParseFloat(s?: string | null) {
  const v = parseFloat(String(s ?? '0'));
  return Number.isFinite(v) ? v : 0;
}

const GRADING_LIMITS = { MIN: -100, MAX: 100 };
const WEIGHTS = {
  PER_PASS: +10,
  PER_FAIL: -15,
  CE: -40,
  RUNTIME: -25,
  STDERR: -5,
};
const PERF = { T_BUDGET_SEC: 0.15, M_BUDGET_KB: 25600 };

function timePenaltySec(timeStr?: string | null) {
  const t = Math.max(0, safeParseFloat(timeStr));
  const over = Math.max(0, t - PERF.T_BUDGET_SEC) / PERF.T_BUDGET_SEC;
  return Math.round(5 * Math.log2(1 + over));
}

function memoryPenaltyKb(kb?: number | null) {
  const m = Math.max(0, kb ?? 0);
  const over = Math.max(0, m - PERF.M_BUDGET_KB) / PERF.M_BUDGET_KB;
  return Math.round(5 * Math.log2(1 + over));
}

function parsePassFail(stdout: string) {
  const lines = stdout.split(/\r?\n/).filter(Boolean);
  let pass = 0;
  let fail = 0;
  let total = 0;

  let hiddenPass = 0;
  let hiddenFail = 0;
  let hiddenTotal = 0;

  for (const line of lines) {
    const m = line.match(/Case\s+\d+:\s+(PASS|FAIL)/i);
    if (!m) continue;

    const isHidden = line.startsWith('HIDDEN ');
    const w = isHidden ? 2 : 1;

    total += w;
    const isPass = m[1].toUpperCase() === 'PASS';
    if (isPass) {
      pass += w;
      if (isHidden) hiddenPass += 1;
    } else {
      fail += w;
      if (isHidden) hiddenFail += 1;
    }

    if (isHidden) hiddenTotal += 1;
  }

  return { pass, fail, total, hiddenPass, hiddenFail, hiddenTotal };
}

function hideHiddenLines(stdout: string) {
  return stdout
    .split(/\r?\n/)
    .filter(line => line && !line.startsWith('HIDDEN '))
    .join('\n');
}

function gradeFromJudge0(judge0: any) {
  const statusDesc = judge0?.status?.description || 'Unknown';
  const timeStr = judge0?.time ?? null;
  const memoryKB = judge0?.memory ?? null;

  const rawStdout = b64dec(judge0?.stdout);
  const stderr = b64dec(judge0?.stderr);
  const compile_output = b64dec(judge0?.compile_output);

  let score = 0;
  const breakdown: Record<string, number | string> = { status: statusDesc };

  const isCompilationError = /Compilation Error/i.test(statusDesc);
  const isTimeout = /Time Limit Exceeded/i.test(statusDesc);

  if (!isCompilationError && !isTimeout && !/Accepted/i.test(statusDesc)) {
    score += WEIGHTS.RUNTIME;
    breakdown['runtimePenalty'] = WEIGHTS.RUNTIME;
  }

  const { pass, fail, total, hiddenPass, hiddenFail, hiddenTotal } = parsePassFail(rawStdout);
  const hasHiddenCase = hiddenTotal > 0;
  const hiddenCasePassed = hasHiddenCase && hiddenFail === 0;

  if (total > 0) {
    const sPass = pass * WEIGHTS.PER_PASS;
    const sFail = fail * WEIGHTS.PER_FAIL;
    score += sPass + sFail;
    breakdown['passes'] = pass;
    breakdown['fails'] = fail;
    breakdown['passPoints'] = sPass;
    breakdown['failPoints'] = sFail;
    breakdown['hasHidden'] = hasHiddenCase ? 1 : 0;
    breakdown['hiddenPassed'] = hiddenCasePassed ? 1 : 0;
  }

  if (stderr.trim()) {
    score += WEIGHTS.STDERR;
    breakdown['stderrPenalty'] = WEIGHTS.STDERR;
  }

  const tPen = -timePenaltySec(timeStr);
  const mPen = -memoryPenaltyKb(memoryKB);
  score += tPen + mPen;
  breakdown['timePenalty'] = tPen;
  breakdown['memoryPenalty'] = mPen;

  const finalScore = clamp(score, GRADING_LIMITS.MIN, GRADING_LIMITS.MAX);
  breakdown['rawScore'] = score;
  breakdown['finalScore'] = finalScore;

  const publicStdout = hideHiddenLines(rawStdout);

  return {
    status: statusDesc,
    time: timeStr,
    memory: memoryKB,
    stdout: publicStdout,
    stderr,
    compile_output,
    score: finalScore,
    breakdown,
    isCompilationError,
    isTimeout,
    passCount: pass,
    totalCount: total,
    hasHiddenCase,
    hiddenCasePassed,
  };
}

type UserProblemState = {
  submissions: number;
  baseBest: number;
  cePenalty: number;
  lastWasCeOrTimeout: boolean;
};

judge0Route.post('/judge0/run', requireAuth, async (req, res) => {
  const { language_id, source_code, stdin, problemId, lang } = req.body as {
    language_id: number;
    source_code: string;
    stdin?: string;
    problemId: string;
    lang: 'typescript' | 'python' | 'java';
  };

  if (!problemId || (lang !== 'typescript' && lang !== 'python' && lang !== 'java')) {
    return res.status(400).json({ error: 'Invalid problemId or lang' });
  }

  const { user } = req as AuthenticatedRequest;
  const userId = String(user.sub);

  try {
    const problem = await Problem.findOne(
      { problemId },
      { _id: 0, [`testHarness.${lang}`]: 1 },
    ).lean();

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const harness = (problem as any)?.testHarness?.[lang] || '';

    const userSrc = b64dec(source_code);
    let fullSource = `${userSrc}\n\n${harness}`;
    if (lang === 'java') {
      fullSource = wrapJava(userSrc, harness);
    }
    const fullSourceB64 = b64enc(fullSource);

    const apiRes = await fetch(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          language_id,
          source_code: fullSourceB64,
          stdin,
        }),
      },
    );

    if (!apiRes.ok) {
      const bodyText = await apiRes.text().catch(() => '');
      console.error('Judge0 error', apiRes.status, bodyText);
      return res.status(502).json({ error: 'Judge0 service error' });
    }

    const judge0 = await apiRes.json();
    const graded = gradeFromJudge0(judge0);

    const cacheKey = `${userId}:${problemId}`;
    const current = cache.get<UserProblemState>(cacheKey);
    const state: UserProblemState = current ?? {
      submissions: 0,
      baseBest: GRADING_LIMITS.MIN,
      cePenalty: 0,
      lastWasCeOrTimeout: false,
    };

    const isCeLike = graded.isCompilationError || graded.isTimeout;
    const wasCeLike = state.lastWasCeOrTimeout;
    const isFirstSubmission = state.submissions === 0;
    const allTestsPassed = graded.totalCount > 0 && graded.passCount === graded.totalCount;

    let ceDelta = 0;
    let runScore: number;

    if (isFirstSubmission && allTestsPassed) {
      state.submissions = 1;
      state.baseBest = 100;
      state.cePenalty = 0;
      state.lastWasCeOrTimeout = false;
      runScore = 100;
      graded.breakdown['firstTryPerfect'] = 1;
    } else {
      if (isCeLike) {
        ceDelta = wasCeLike ? -5 : -10;
      } else if (wasCeLike) {
        ceDelta = +10;
      }

      state.cePenalty += ceDelta;
      state.lastWasCeOrTimeout = isCeLike;
      state.submissions += 1;

      state.baseBest = Math.max(state.baseBest, graded.score);
      runScore = state.baseBest + state.cePenalty;
    }

    runScore = clamp(runScore, GRADING_LIMITS.MIN, GRADING_LIMITS.MAX);

    graded.breakdown['ceDelta'] = ceDelta;
    graded.breakdown['cePenaltyTotal'] = state.cePenalty;
    graded.breakdown['baseBest'] = state.baseBest;
    graded.breakdown['submissions'] = state.submissions;
    graded.breakdown['isCeOrTimeout'] = isCeLike ? 1 : 0;

    cache.set<UserProblemState>(cacheKey, state);

    return res.status(200).json({
      status: graded.status,
      time: graded.time,
      memory: graded.memory,
      stdout: graded.stdout,
      stderr: graded.stderr,
      compile_output: graded.compile_output,
      score: runScore,
      runScore,
      breakdown: graded.breakdown,
      hasHiddenCase: graded.hasHiddenCase,
      hiddenCasePassed: graded.hiddenCasePassed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Judge0 run failed' });
  }
});

export default judge0Route;
