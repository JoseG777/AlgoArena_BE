import { Server, Socket } from 'socket.io';
import cookie from 'cookie';
import { verifyAccess, type AccessClaims } from '../lib/jwt';
import {
  attachIo,
  getRoomEntry,
  addUserToRoom,
  removeUserFromRoom,
  tryStartRoom,
  __roomsDebug,
  type RoomCode,
  type AllowRule,
} from './roomsStore';
import { initMember, upsertScore, markFinished, getRoomScores, allFinished } from './scoreStore';
import { finalizeEarlyIfAllFinished } from './roomsStore';

function displayName(user: AccessClaims) {
  return user.username ?? user.email ?? `user:${user.sub.slice(-6)}`;
}

function getUserId(user: AccessClaims) {
  return String(user.sub);
}

function isAllowed(user: AccessClaims, rule?: AllowRule | null): boolean {
  if (!rule) return true;
  const uname = (user.username || '').toLowerCase();
  if (!uname) return false;
  if (rule.type === 'username') {
    return rule.values.includes(uname);
  }
  return false;
}

function publicMembersPayload(code: RoomCode) {
  return getRoomScores(code).map(m => ({
    username: m.username,
    score: m.score,
    finished: m.finished,
  }));
}

export function registerSocketHandlers(io: Server) {
  attachIo(io);

  io.use((socket, next) => {
    try {
      const raw = socket.handshake.headers.cookie || '';
      const parsed = cookie.parse(raw);
      const token = parsed['access'];
      if (!token) return next(new Error('UNAUTHORIZED'));
      const claims = verifyAccess(token);
      (socket.data as { user: AccessClaims }).user = claims;
      return next();
    } catch {
      return next(new Error('UNAUTHORIZED'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const { user } = socket.data as { user: AccessClaims };
    const userId = getUserId(user);
    const username = (user.username || '').toLowerCase();

    if (username) {
      addOnlineUser(username, socket.id);
    }

    socket.on(
      'joinRoom',
      (
        roomCode: string,
        callback: (p: {
          success?: true;
          roomCode?: string;
          error?: string;
          members?: string[];
          timeLeft?: number | null;
          started?: boolean;
        }) => void,
      ) => {
        const code = String(roomCode) as RoomCode;
        const room = getRoomEntry(code);
        if (!room) return callback({ error: 'Room not found' });

        if (!isAllowed(user, room.allow)) {
          return callback({ error: 'You are not allowed to join this room.' });
        }

        addUserToRoom(code, socket.id);
        socket.join(code);

        initMember(code, userId, displayName(user));

        const membersUsernames = publicMembersPayload(code).map(m => m.username);

        socket.to(code).emit('userJoined', { username: displayName(user) });
        io.to(code).emit('membersUpdated', publicMembersPayload(code));

        tryStartRoom(code);
        const after = getRoomEntry(code)!;

        callback({
          success: true,
          roomCode: code,
          members: membersUsernames,
          timeLeft: after.started ? after.timeLeft : null,
          started: after.started,
        });
      },
    );

    socket.on('updateScore', (roomCode: string, score: number) => {
      const code = String(roomCode) as RoomCode;
      const room = getRoomEntry(code);
      if (!room) return;

      upsertScore(code, userId, displayName(user), score);
      io.to(code).emit('membersUpdated', publicMembersPayload(code));
    });

    socket.on('finish', (roomCode: string) => {
      const code = String(roomCode) as RoomCode;
      const room = getRoomEntry(code);
      if (!room) return;

      markFinished(code, userId, displayName(user));
      io.to(code).emit('membersUpdated', publicMembersPayload(code));

      if (allFinished(code)) {
        void finalizeEarlyIfAllFinished(code);
      }
    });

    socket.on('leaveRoom', (roomCode: string) => {
      const code = String(roomCode) as RoomCode;
      const room = getRoomEntry(code);
      if (!room) return;

      removeUserFromRoom(code, socket.id);
      socket.leave(code);

      socket.to(code).emit('userLeft', { username: displayName(user) });
      io.to(code).emit('membersUpdated', publicMembersPayload(code));
    });

    socket.on('disconnect', () => {
      // Presence-only cleanup; do not delete scoreboard entries on refresh
      for (const [code, entry] of Object.entries(__roomsDebug)) {
        if (entry.users.has(socket.id)) {
          removeUserFromRoom(code as RoomCode, socket.id);
          socket.to(code).emit('userLeft', { username: displayName(user) });
          io.to(code).emit('membersUpdated', publicMembersPayload(code as RoomCode));
        }
      }
      removeOnlineUser(socket.id);
    });
  });
}

import { addOnlineUser, removeOnlineUser } from './roomsStore';
