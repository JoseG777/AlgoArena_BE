import { nanoid } from 'nanoid';
import { getRoomScores, clearRoomScores } from './scoreStore';
import { Match } from '../model/Match'; 
import { User } from '../model/User';
import type { Server } from 'socket.io';

export type RoomCode = string;

export type AllowRule = { type: 'username'; values: string[] } | null;

export interface RoomEntry {
  users: Set<string>;
  allow?: AllowRule;
  problemId: string;
  durationSec: number;
  expiresAt: Date;
  timeLeft: number;
  timer?: NodeJS.Timeout | null;
  createdAt: Date;
}

const ROOM_TICK_MS = 1000;

const rooms: Record<RoomCode, RoomEntry> = Object.create(null);

let ioRef: Server | null = null;

export function attachIo(io: Server) {
  ioRef = io;
}

export function computeTimeLeft(expiresAt: Date, now = Date.now()): number {
  return Math.max(0, Math.ceil((expiresAt.getTime() - now) / 1000));
}

async function finalizeMatch(code: RoomCode) {
  const room = rooms[code];
  if (!room) return;

  const endedAt = new Date();
  const players = getRoomScores(code);
  const isTie = players.length >= 2
    ? players[0].score === players[1].score
    : true;

  let winnerUserId: string | null = null;
  if (!isTie && players.length >= 2) {
    winnerUserId = players[0].score > players[1].score ? players[0].userId : players[1].userId;
  }

  await Match.create({
    code,
    problemId: room.problemId,
    durationSec: room.durationSec,
    startedAt: room.createdAt,
    endedAt,
    players,
    winnerUserId,
    isTie,
  });

  for (const p of players) {
    await User.updateOne(
      { _id: p.userId },
      {
        $inc: {
          'stats.totalPoints': p.score > 0 ? p.score : 0,
          'stats.matches': 1,
          'stats.wins': winnerUserId === p.userId ? 1 : 0,
          'stats.ties': isTie ? 1 : 0,
          'stats.losses': !isTie && winnerUserId !== p.userId ? 1 : 0,
        },
      },
      { upsert: true },
    );
  }

  clearRoomScores(code);
}

export function createRoomEntry(opts: {
  problemId: string;
  allowUsername?: string | null;
  durationSec?: number;
  ownerUsername?: string | null;
}): { code: RoomCode; room: RoomEntry } {
  const duration = clampDuration(opts.durationSec);
  const expiresAt = new Date(Date.now() + duration * 1000);

  let code: string;
  do {
    code = nanoid(12);
  } while (rooms[code]);

  const allowValues = [
    (opts.ownerUsername || '').trim(),
    (opts.allowUsername || '').trim(),
  ]
    .filter(Boolean)
    .map((s) => s.toLowerCase());

  const room: RoomEntry = {
    users: new Set<string>(),
    allow: allowValues.length ? { type: 'username', values: Array.from(new Set(allowValues)) } : null,
    problemId: opts.problemId,
    durationSec: duration,
    expiresAt,
    timeLeft: duration,
    timer: null,
    createdAt: new Date(),
  };

  rooms[code] = room;
  startRoomTimer(code);

  return { code, room };
}

export function startRoomTimer(code: RoomCode) {
  const room = rooms[code];
  if (!room) return;

  if (room.timer) {
    clearInterval(room.timer);
    room.timer = null;
  }

  room.timeLeft = computeTimeLeft(room.expiresAt);

  if (ioRef) {
    ioRef.to(code).emit('timerUpdate', { timeLeft: room.timeLeft });
  }

  room.timer = setInterval(() => {
    const r = rooms[code];
    if (!r) return;

    r.timeLeft = computeTimeLeft(r.expiresAt);

    if (ioRef) {
      ioRef.to(code).emit('timerUpdate', { timeLeft: r.timeLeft });
    }

    if (r.timeLeft <= 0) {
      void finalizeMatch(code).catch((e) => console.error('finalizeMatch error:', e));
      if (ioRef) {
        ioRef.to(code).emit('roomClosed');

        for (const sid of r.users) {
          const s = ioRef.sockets.sockets.get(sid);
          s?.leave(code);
        }
      }

      clearInterval(r.timer!);
      r.timer = null;
      delete rooms[code];
    }
  }, ROOM_TICK_MS);
}

export function getRoomEntry(code: RoomCode): RoomEntry | undefined {
  return rooms[code];
}

export function deleteRoomEntry(code: RoomCode) {
  const room = rooms[code];
  if (!room) return;
  if (room.timer) {
    clearInterval(room.timer);
    room.timer = null;
  }
  if (ioRef) {
    ioRef.to(code).emit('roomClosed');
    for (const sid of room.users) {
      const s = ioRef.sockets.sockets.get(sid);
      s?.leave(code);
    }
  }
  delete rooms[code];
}

export function addUserToRoom(code: RoomCode, socketId: string) {
  const room = rooms[code];
  if (!room) return;
  room.users.add(socketId);
}

export function removeUserFromRoom(code: RoomCode, socketId: string) {
  const room = rooms[code];
  if (!room) return;
  if (room.users.delete(socketId)) {
    if (room.users.size === 0) {
      deleteRoomEntry(code);
    }
  }
}

function clampDuration(n?: number, min = 15, max = 3600, def = 180): number {
  if (typeof n !== 'number' || !Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

export const __roomsDebug = rooms;
