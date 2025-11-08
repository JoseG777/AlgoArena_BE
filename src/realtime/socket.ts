import { Server, Socket } from 'socket.io';
import cookie from 'cookie';
import { verifyAccess, type AccessClaims } from '../lib/jwt';
import {
  attachIo,
  getRoomEntry,
  addUserToRoom,
  removeUserFromRoom,
  addOnlineUser,
  removeOnlineUser,
  type RoomCode,
  type AllowRule,
} from './roomsStore';

const memberScores: Record<RoomCode, Record<string, { username: string; score: number }>> = {};

function displayName(user: AccessClaims) {
  return user.username ?? user.email ?? `user:${user.sub.slice(-6)}`;
}

function getUserId(user: AccessClaims) {
  return user.username || `user:${user.sub.slice(-6)}`;
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
    const userId = getUserId(user);
    const username = (user.username || '').toLowerCase();

    if (username) {
      addOnlineUser(username, socket.id);
    }

    socket.on(
      'joinRoom',
      (roomCode: string, callback: (p: {
        success?: true;
        roomCode?: string;
        error?: string;
        members?: string[];
        timeLeft?: number;
      }) => void) => {
        const code = String(roomCode) as RoomCode;
        const room = getRoomEntry(code);
        if (!room) return callback({ error: 'Room not found' });

        if (!isAllowed(user, room.allow)) {
          return callback({ error: 'You are not allowed to join this room.' });
        }

        addUserToRoom(code, socket.id);

        if (!memberScores[code]) memberScores[code] = {};
        if (!memberScores[code][userId]) {
          memberScores[code][userId] = { username: displayName(user), score: 0 };
        }

        socket.join(code);

        const members = Array.from(room.users)
          .map((sid) => {
            const s = io.sockets.sockets.get(sid);
            const u = s?.data?.user as AccessClaims | undefined;
            if (u) return displayName(u);
            return null;
          })
          .filter(Boolean) as string[];

        const membersWithScores = Object.values(memberScores[code]);

        socket.to(code).emit('userJoined', { username: displayName(user) });
        socket.emit('membersUpdated', membersWithScores);
        callback({ success: true, roomCode: code, members, timeLeft: room.timeLeft });
      }
    );

    socket.on('leaveRoom', (roomCode: string) => {
      const code = String(roomCode) as RoomCode;
      const room = getRoomEntry(code);
      if (!room) return;

      removeUserFromRoom(code, socket.id);
      socket.leave(code);

      delete memberScores[code]?.[userId];

      socket.to(code).emit('userLeft', { username: displayName(user) });
      socket.to(code).emit('membersUpdated', Object.values(memberScores[code] || {}));
    });

    socket.on('updateScore', (roomCode: string, score: number) => {
      const code = String(roomCode) as RoomCode;
      const room = getRoomEntry(code);
      if (!room) return;

      if (!memberScores[code]) memberScores[code] = {};
      memberScores[code][userId] = { username: displayName(user), score };

      io.to(code).emit('membersUpdated', Object.values(memberScores[code]));
    });

    socket.on('disconnect', () => {
      for (const [code] of (io as any).adapter.rooms || []) {
        const roomEntry = getRoomEntry(code as RoomCode);
        if (roomEntry && roomEntry.users.has(socket.id)) {
          removeUserFromRoom(code as RoomCode, socket.id);
          delete memberScores[code as RoomCode]?.[userId];
          socket.to(code).emit('userLeft', { username: displayName(user) });
          socket.to(code).emit('membersUpdated', Object.values(memberScores[code as RoomCode] || {}));
        }
      }
      removeOnlineUser(socket.id);
    });
  });
}
