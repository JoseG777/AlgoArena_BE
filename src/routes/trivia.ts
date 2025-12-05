import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';
import TriviaProblem from '../model/triviaProblem';
import {
  createRoomEntry,
  getOnlineSockets,
  getIo,
  finalizeEarlyIfAllFinished,
  type RoomCode,
} from '../realtime/roomsStore';
import {
  upsertScore,
  markFinished,
  getRoomScores,
  allFinished,
} from '../realtime/scoreStore';
import type { AccessClaims } from '../lib/jwt';

const triviaRoute = Router();

type TriviaQuestionPayload = {
  question: string;
  options: string[];
  correctAnswer: string;
  category?: string;
  difficulty?: string;
};

type TriviaResult = {
  userId: string;
  username: string;
  correctCount: number;
  totalQuestions: number;
  baseScore: number;
  finishedAt: Date;
};

type TriviaRoomState = {
  results: TriviaResult[];
  speedBonusAwarded: boolean;
};

const triviaStateByRoom: Record<RoomCode, TriviaRoomState> = Object.create(null);
const triviaQuestionsByRoom: Record<RoomCode, TriviaQuestionPayload[]> = Object.create(null);

function publicMembersPayload(code: RoomCode) {
  return getRoomScores(code).map(m => ({
    username: m.username,
    score: m.score,
    finished: m.finished,
  }));
}

function normalizeTriviaDoc(q: any): TriviaQuestionPayload | null {
  const questionText =
    typeof q.question === 'string' && q.question.trim().length > 0
      ? q.question.trim()
      : null;

  if (!questionText) return null;

  const correctRaw =
    (typeof q.correctAnswer === 'string' && q.correctAnswer.trim().length > 0
      ? q.correctAnswer
      : null) ||
    (typeof q.correct_answer === 'string' && q.correct_answer.trim().length > 0
      ? q.correct_answer
      : null);

  if (!correctRaw) return null;

  const correct = String(correctRaw).trim();

  let options: string[] = Array.isArray(q.options)
    ? q.options.filter((v: any): v is string => typeof v === 'string' && v.trim().length > 0)
    : [];

  if (!options.length) {
    const incorrectRaw = q.incorrectAnswers ?? q.incorrect_answers ?? [];
    const incorrectArr: string[] = Array.isArray(incorrectRaw)
      ? incorrectRaw.filter(
          (v: any): v is string => typeof v === 'string' && v.trim().length > 0,
        )
      : [];
    options = [correct, ...incorrectArr];
  }

  options = options
    .map((v: any) => String(v).trim())
    .filter((v: string) => v.length > 0);

  if (!options.length) return null;

  return {
    question: questionText,
    options,
    correctAnswer: correct,
    category: q.category,
    difficulty: q.difficulty,
  };
}

triviaRoute.get('/trivia', async (req, res) => {
  try {
    const { category, roomCode } = req.query as { category?: string; roomCode?: string };

    if (roomCode) {
      const code = String(roomCode) as RoomCode;
      const existing = triviaQuestionsByRoom[code];
      if (!existing || existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Trivia room not found.' });
      }
      return res.json({ success: true, data: existing });
    }

    const filter = category ? { category } : {};

    const questions = await TriviaProblem.aggregate([
      { $match: filter },
      { $sample: { size: 10 } },
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No trivia questions found.' });
    }

    const payload: TriviaQuestionPayload[] = [];
    for (const q of questions) {
      const norm = normalizeTriviaDoc(q);
      if (norm) payload.push(norm);
    }

    if (payload.length === 0) {
      return res.status(404).json({ success: false, message: 'No trivia questions found.' });
    }

    res.json({ success: true, data: payload });
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

triviaRoute.post('/trivia-room', requireAuth, async (req, res) => {
  try {
    const { allowUsername = null } = req.body as {
      durationSec?: number;
      allowUsername?: string | null;
      difficulty?: string;
    };

    const durationSec = 180;

    const { user } = req as AuthenticatedRequest;
    const ownerUsername =
      ((user as any)?.username || (user as any)?.email || '').trim() || null;
    const inviterUsername = ownerUsername;

    const { code, room } = createRoomEntry({
      problemId: 'TRIVIA',
      allowUsername: allowUsername || null,
      durationSec,
      ownerUsername,
    });

    const questions = await TriviaProblem.aggregate([
      { $match: {} },
      { $sample: { size: 10 } },
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No trivia questions available' });
    }

    const payload: TriviaQuestionPayload[] = [];
    for (const q of questions) {
      const norm = normalizeTriviaDoc(q);
      if (norm) payload.push(norm);
    }

    if (payload.length === 0) {
      return res.status(404).json({ error: 'No trivia questions available' });
    }

    triviaQuestionsByRoom[code] = payload;

    if (allowUsername) {
      const invitedUname = allowUsername.toLowerCase();
      const invitedSockets = getOnlineSockets(invitedUname);

      if (invitedSockets && invitedSockets.size > 0) {
        const io = getIo();
        if (io) {
          io.to(Array.from(invitedSockets)).emit('friendInvitedTrivia', {
            roomCode: code,
            inviterUsername,
          });
        }
      }
    }

    return res.status(201).json({
      code,
      timeLeft: room.timeLeft,
      expiresAt: room.expiresAt.toISOString(),
      started: room.started,
    });
  } catch (error) {
    console.error('Error creating trivia room:', error);
    res.status(500).json({ error: 'Failed to create trivia room' });
  }
});

triviaRoute.post('/trivia/submit', requireAuth, async (req, res) => {
  try {
    const { roomCode, correctCount, totalQuestions } = req.body as {
      roomCode: string;
      correctCount: number;
      totalQuestions: number;
    };

    const code = String(roomCode) as RoomCode;

    if (!code || typeof correctCount !== 'number' || typeof totalQuestions !== 'number') {
      return res
        .status(400)
        .json({ error: 'roomCode, correctCount, and totalQuestions are required' });
    }

    if (correctCount < 0 || totalQuestions <= 0 || correctCount > totalQuestions) {
      return res.status(400).json({ error: 'Invalid trivia counts' });
    }

    const { user } = req as AuthenticatedRequest;
    const userId = String(user.sub);
    const username =
      ((user as any).username || (user as any).email || '').trim() ||
      `user:${userId.slice(-6)}`;

    let baseScore = correctCount * 10;
    const allCorrect = correctCount === totalQuestions;
    if (allCorrect) {
      baseScore += 10;
    }

    let state = triviaStateByRoom[code];
    if (!state) {
      state = triviaStateByRoom[code] = {
        results: [],
        speedBonusAwarded: false,
      };
    }

    let result = state.results.find(r => r.userId === userId);
    if (!result) {
      result = {
        userId,
        username,
        correctCount,
        totalQuestions,
        baseScore,
        finishedAt: new Date(),
      };
      state.results.push(result);
    } else {
      result.correctCount = correctCount;
      result.totalQuestions = totalQuestions;
      result.baseScore = baseScore;
      result.finishedAt = new Date();
    }

    upsertScore(code, userId, username, baseScore);
    markFinished(code, userId, username);

    const io = getIo();
    if (io) {
      io.to(code).emit('membersUpdated', publicMembersPayload(code));
    }

    const everyoneFinished = allFinished(code);

    if (!everyoneFinished) {
      return res.status(200).json({
        allFinished: false,
      });
    }

    let speedBonusAppliedForUser = false;

    if (!state.speedBonusAwarded && state.results.length > 0) {
      const maxBaseScore = Math.max(...state.results.map(r => r.baseScore));

      const topScorers = state.results.filter(r => r.baseScore === maxBaseScore);

      if (topScorers.length === 1) {
        const candidate = topScorers[0];

        const earliest = [...state.results].sort(
          (a, b) => a.finishedAt.getTime() - b.finishedAt.getTime(),
        )[0];

        if (earliest.userId === candidate.userId) {
          state.speedBonusAwarded = true;

          const newWinnerScore = candidate.baseScore + 10;
          candidate.baseScore = newWinnerScore;

          upsertScore(code, candidate.userId, candidate.username, newWinnerScore);

          if (candidate.userId === userId) {
            speedBonusAppliedForUser = true;
            baseScore = newWinnerScore;
          }
        }
      }
    }

    if (io) {
      const sockets = await io.in(code).fetchSockets();
      const leaderboard = state.results.map(r => ({
        userId: r.userId,
        username: r.username,
        score: r.baseScore,
        correctCount: r.correctCount,
        totalQuestions: r.totalQuestions,
      }));

      for (const s of sockets) {
        const sUser = (s.data as { user?: AccessClaims }).user;
        if (!sUser) continue;
        const sid = String(sUser.sub);
        const r = state.results.find(x => x.userId === sid);
        if (!r) continue;

        s.emit('triviaResults', {
          roomCode: code,
          yourScore: r.baseScore,
          yourCorrectCount: r.correctCount,
          yourTotalQuestions: r.totalQuestions,
          leaderboard,
        });
      }
    }

    await finalizeEarlyIfAllFinished(code);

    delete triviaStateByRoom[code];
    delete triviaQuestionsByRoom[code];

    return res.status(200).json({
      allFinished: true,
      speedBonusApplied: speedBonusAppliedForUser,
    });
  } catch (error) {
    console.error('Error grading trivia submission:', error);
    return res.status(500).json({ error: 'Failed to grade trivia submission' });
  }
});

export default triviaRoute;
