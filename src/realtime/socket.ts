import { Server, Socket } from 'socket.io';
import cookie from 'cookie';
import { verifyAccess, type AccessClaims } from '../lib/jwt';
import {
  attachIo,
  getRoomEntry,
  addUserToRoom,
  removeUserFromRoom,
  type RoomCode,
  type AllowRule,
} from './roomsStore';

const memberScores: Record<string, { username: string; score: number }> = {};

function displayName(user: AccessClaims) {
  return user.username ?? user.email ?? `user:${user.sub.slice(-6)}`;
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

    socket.on(
      'joinRoom',
      (
        roomCode: string,
        callback: (p: {
          success?: true;
          roomCode?: string;
          error?: string;
          members?: string[];
          timeLeft?: number;
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

        if (!memberScores[socket.id]) {
          memberScores[socket.id] = { username: displayName(user), score: 0 };
        }

        const members: string[] = [];
        for (const sid of room.users) {
          const s = io.sockets.sockets.get(sid);
          const u = s?.data?.user as AccessClaims | undefined;
          if (u) members.push(displayName(u));
        }

        const membersWithScores = Object.values(memberScores).map(member => ({
          username: member.username,
          score: member.score,
        }));

        socket.to(code).emit('userJoined', { username: displayName(user) });

        callback({ success: true, roomCode: code, members, timeLeft: room.timeLeft });
        socket.emit('membersUpdated', membersWithScores);
      },
    );

    socket.on('leaveRoom', (roomCode: string) => {
      const code = String(roomCode) as RoomCode;
      const room = getRoomEntry(code);
      if (!room) return;
      removeUserFromRoom(code, socket.id);
      socket.leave(code);
      socket.to(code).emit('userLeft', { username: displayName(user) });
    });

    socket.on('updateScore', (roomCode: string, score: number) => {
      const code = String(roomCode) as RoomCode;
      const room = getRoomEntry(code);
      if (!room) return;

      memberScores[socket.id] = { username: displayName(user), score };

      const membersWithScores = Object.values(memberScores).map(member => ({
        username: member.username,
        score: member.score,
      }));

      io.to(code).emit('membersUpdated', membersWithScores);
    });

    socket.on('disconnect', () => {
      for (const [code] of (io as any).adapter.rooms || []) {
        const entry = getRoomEntry(code as RoomCode);
        if (entry && entry.users.has(socket.id)) {
          removeUserFromRoom(code as RoomCode, socket.id);
          socket.to(code).emit('userLeft', { username: displayName(user) });
        }
      }
    });
  });
}
