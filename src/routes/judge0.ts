import { Router } from "express";

const judge0Route = Router();

function b64dec(s?: string | null) {
  if (!s) return "";
  return Buffer.from(s, "base64").toString("utf8");
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function safeParseFloat(s?: string | null) {
  const v = parseFloat(String(s ?? "0"));
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
  let pass = 0,
    fail = 0,
    total = 0;
  for (const line of lines) {
    const m = line.match(/Case\s+\d+:\s+(PASS|FAIL)/i);
    if (m) {
      total++;
      if (m[1].toUpperCase() === "PASS") pass++;
      else fail++;
    }
  }
  return { pass, fail, total };
}

function gradeFromJudge0(judge0: any) {
  const statusDesc = judge0?.status?.description || "Unknown";
  const timeStr = judge0?.time ?? null;
  const memoryKB = judge0?.memory ?? null;

  const stdout = b64dec(judge0?.stdout);
  const stderr = b64dec(judge0?.stderr);
  const compile_output = b64dec(judge0?.compile_output);

  let score = 0;
  const breakdown: Record<string, number | string> = { status: statusDesc };

  if (/Compilation Error/i.test(statusDesc)) {
    score += WEIGHTS.CE;
    breakdown["compilePenalty"] = WEIGHTS.CE;
  } else if (!/Accepted/i.test(statusDesc)) {
    score += WEIGHTS.RUNTIME;
    breakdown["runtimePenalty"] = WEIGHTS.RUNTIME;
  }

  const { pass, fail, total } = parsePassFail(stdout);
  if (total > 0) {
    const sPass = pass * WEIGHTS.PER_PASS;
    const sFail = fail * WEIGHTS.PER_FAIL;
    score += sPass + sFail;
    breakdown["passes"] = pass;
    breakdown["fails"] = fail;
    breakdown["passPoints"] = sPass;
    breakdown["failPoints"] = sFail;
  }

  if (stderr.trim()) {
    score += WEIGHTS.STDERR;
    breakdown["stderrPenalty"] = WEIGHTS.STDERR;
  }

  const tPen = -timePenaltySec(timeStr);
  const mPen = -memoryPenaltyKb(memoryKB);
  score += tPen + mPen;
  breakdown["timePenalty"] = tPen;
  breakdown["memoryPenalty"] = mPen;

  const finalScore = clamp(score, GRADING_LIMITS.MIN, GRADING_LIMITS.MAX);
  breakdown["rawScore"] = score;
  breakdown["finalScore"] = finalScore;

  return {
    status: statusDesc,
    time: timeStr,
    memory: memoryKB,
    stdout,
    stderr,
    compile_output,
    score: finalScore,
    breakdown,
  };
}

judge0Route.post("/judge0/run", async (req, res) => {
  const { language_id, source_code, stdin } = req.body;

  try {
    const apiRes = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          language_id,
          source_code,
          stdin,
        }),
      }
    );

    const judge0 = await apiRes.json();
    const graded = gradeFromJudge0(judge0);

    res.status(apiRes.ok ? 200 : 400).json(graded);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Judge0 run failed" });
  }
});

export default judge0Route;