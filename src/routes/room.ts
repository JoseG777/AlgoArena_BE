import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';
import { Problem } from '../model/Problem';
import {
  createRoomEntry,
  getRoomEntry,
  computeTimeLeft,
  getOnlineSockets,
  type RoomCode,
} from '../realtime/roomsStore';
import { getIo } from '../realtime/roomsStore';

const roomsRoute = Router();

roomsRoute.post('/rooms', requireAuth, async (req, res) => {
  try {
    const {
      difficulty,
      allowUsername = null,
      durationSec,
    } = req.body as {
      difficulty?: 'easy' | 'medium' | 'hard';
      allowUsername?: string | null;
      durationSec?: number;
    };

    const { user } = req as AuthenticatedRequest;
    const ownerUsername = (user as any)?.username || null;
    const inviterUsername = ownerUsername; 

    const pipeline: any[] = [];
    if (difficulty) pipeline.push({ $match: { difficulty } });
    pipeline.push({ $sample: { size: 1 } });
    pipeline.push({ $project: { _id: 0, problemId: 1, title: 1, difficulty: 1 } });

    const picked = await Problem.aggregate(pipeline);
    if (!picked?.length) {
      return res.status(404).json({ error: 'No problems available for the given criteria' });
    }

    const problem = picked[0] as { problemId: string; title: string; difficulty: string };

    const { code, room } = createRoomEntry({
      problemId: problem.problemId,
      allowUsername: allowUsername || null,
      durationSec,
      ownerUsername,
    });

    if (allowUsername) {
        const invitedUname = allowUsername.toLowerCase();
        const invitedSockets = getOnlineSockets(invitedUname);
        
        if (invitedSockets && invitedSockets.size > 0) {
            const io = getIo();
            if (io) {
                io.to(Array.from(invitedSockets)).emit('friendInvited', {
                    roomCode: code,
                    inviterUsername: inviterUsername,
                });
            }
        }
    }

    return res.status(201).json({
      code,
      problem,
      timeLeft: room.timeLeft,
      expiresAt: room.expiresAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create room' });
  }
});

roomsRoute.get('/rooms/:code', requireAuth, async (req, res) => {
  try {
    const code = String(req.params.code) as RoomCode;
    const room = getRoomEntry(code);
    if (!room) {
      return res.status(404).json({ error: 'Room not found or expired' });
    }

    const problemDoc = await Problem.findOne(
      { problemId: room.problemId },
      { _id: 0, problemId: 1, title: 1, difficulty: 1, startingCode: 1 },
    ).lean();

    if (!problemDoc) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const timeLeft = computeTimeLeft(room.expiresAt);

    return res.status(200).json({
      code,
      problem: problemDoc,
      timeLeft,
      expiresAt: room.expiresAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch room' });
  }
});

export default roomsRoute;
