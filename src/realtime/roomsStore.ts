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
  started: boolean;
}

const onlineUsers: Record<string, Set<string>> = Object.create(null);

const ROOM_TICK_MS = 1000;

const rooms: Record<RoomCode, RoomEntry> = Object.create(null);

let ioRef: Server | null = null;

export function addOnlineUser(username: string, socketId: string) {
  const uname = username.toLowerCase();
  if (!onlineUsers[uname]) {
    onlineUsers[uname] = new Set();
  }
  onlineUsers[uname].add(socketId);
}

export function removeOnlineUser(socketId: string) {
  for (const uname in onlineUsers) {
    if (onlineUsers[uname].delete(socketId)) {
      if (onlineUsers[uname].size === 0) {
        delete onlineUsers[uname];
      }
      return;
    }
  }
}

export function getOnlineSockets(username: string): Set<string> | undefined {
  return onlineUsers[username.toLowerCase()];
}

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

  if (room.problemId !== 'TRIVIA' && players.length > 0) {
    const finishedPlayers = players.filter(p => p.finished && p.finishedAt);
    if (finishedPlayers.length > 0) {
      finishedPlayers.sort((a, b) => a.finishedAt!.getTime() - b.finishedAt!.getTime());
      const firstFinisher = finishedPlayers[0];

      const maxScore = Math.max(...players.map(p => p.score));
      const topPlayers = players.filter(p => p.score === maxScore);

      if (topPlayers.length === 1 && topPlayers[0].userId === firstFinisher.userId) {
        firstFinisher.score += 10;
      }
    }
  }

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const isTie = sorted.length >= 2 ? sorted[0].score === sorted[1].score : true;

  let winnerUserId: string | null = null;
  if (!isTie && sorted.length >= 1) {
    winnerUserId = sorted[0].userId;
  }

  if (ioRef && room.problemId !== 'TRIVIA') {
    const sockets = await ioRef.in(code).fetchSockets();

    const leaderboard = sorted.map(p => ({
      username: p.username,
      score: p.score,
    }));

    for (const s of sockets) {
      const userData = (s.data as { user?: any }).user;
      if (!userData) continue;
      const sid = String(userData.sub);
      const yourEntry = players.find(p => p.userId === sid);
      const yourScore = yourEntry?.score ?? 0;
      const youWon = !isTie && winnerUserId === sid;

      s.emit('codingResults', {
        roomCode: code,
        yourScore,
        leaderboard,
        isTie,
        youWon,
      });
    }
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

  let code: string;
  do {
    code = nanoid(12);
  } while (rooms[code]);

  const allowValues = [(opts.ownerUsername || '').trim(), (opts.allowUsername || '').trim()]
    .filter(Boolean)
    .map(s => s.toLowerCase());

  const room: RoomEntry = {
    users: new Set<string>(),
    allow: allowValues.length
      ? { type: 'username', values: Array.from(new Set(allowValues)) }
      : null,
    problemId: opts.problemId,
    durationSec: duration,
    expiresAt: new Date(Date.now()),
    timeLeft: duration,
    timer: null,
    createdAt: new Date(),
    started: false,
  };

  rooms[code] = room;

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
      if (r.timer) {
        clearInterval(r.timer);
        r.timer = null;
      }

      void finalizeMatch(code).catch(e => console.error('finalizeMatch error:', e));

      if (ioRef && r.problemId === 'TRIVIA') {
        ioRef.to(code).emit('roomClosed');

        for (const sid of r.users) {
          const s = ioRef.sockets.sockets.get(sid);
          s?.leave(code);
        }

        delete rooms[code];
      }
    }
  }, ROOM_TICK_MS);
}

export function tryStartRoom(code: RoomCode) {
  const room = rooms[code];
  if (!room || room.started) return;

  const required = room.allow?.values ?? [];

  let haveAll = false;

  if (required.length >= 2) {
    const present = new Set<string>();
    if (ioRef) {
      for (const sid of room.users) {
        const s = ioRef.sockets.sockets.get(sid);
        const uname = (s?.data?.user?.username || '').toLowerCase();
        if (uname) present.add(uname);
      }
    }
    haveAll = required.every(u => present.has(u));
  } else {
    haveAll = room.users.size >= 2;
  }

  if (!haveAll) return;

  room.started = true;
  room.expiresAt = new Date(Date.now() + room.durationSec * 1000);
  room.timeLeft = computeTimeLeft(room.expiresAt);

  if (ioRef) {
    ioRef.to(code).emit('battleStarted', {
      timeLeft: room.timeLeft,
      expiresAt: room.expiresAt.toISOString(),
    });
  }

  startRoomTimer(code);
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
  room.users.delete(socketId);
}

function clampDuration(n?: number, min = 15, max = 3600, def = 180): number {
  if (typeof n !== 'number' || !Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

export function getIo(): Server | null {
  return ioRef;
}

export const __roomsDebug = rooms;

export async function finalizeEarlyIfAllFinished(code: RoomCode) {
  const room = rooms[code];
  if (!room) return;

  await finalizeMatch(code).catch(e => console.error('finalizeMatch error:', e));

  if (room.timer) {
    clearInterval(room.timer);
    room.timer = null;
  }

  if (ioRef && room.problemId === 'TRIVIA') {
    ioRef.to(code).emit('roomClosed');
    for (const sid of room.users) {
      const s = ioRef.sockets.sockets.get(sid);
      s?.leave(code);
    }
    delete rooms[code];
  }
}
