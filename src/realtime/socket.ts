import { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";
import cookie from "cookie";
import { verifyAccess, type AccessClaims } from "../lib/jwt";

type RoomCode = string;

type AllowRule = { type: "username"; value: string };

interface Room {
 users: Set<string>;
 allow?: AllowRule | null;
}

const rooms: Record<RoomCode, Room> = {};

function createPrivateRoomCode(): RoomCode {
 let code: string;
 do {
   code = nanoid(6);
 } while (rooms[code]);
 return code;
}


function deleteRoomIfEmpty(code: RoomCode) {
 const room = rooms[code];
 if (room && room.users.size === 0) {
   delete rooms[code];
 }
}

function displayName(user: AccessClaims) {
  return user.username ?? user.email ?? `user:${user.sub.slice(-6)}`;
}

function isAllowed(user: AccessClaims, rule?: AllowRule | null): boolean {
  if (!rule) return true;
  return user.username?.toLowerCase() === rule.value.toLowerCase();
}

export function registerSocketHandlers(io: Server) {
  io.use((socket, next) => {
    try {
      const raw = socket.handshake.headers.cookie || "";
      const parsed = cookie.parse(raw);
      const token = parsed["access"];
      if (!token) return next(new Error("UNAUTHORIZED"));
      const claims = verifyAccess(token);
      (socket.data as { user: AccessClaims }).user = claims;
      return next();
    } catch {
      return next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const { user } = socket.data as { user: AccessClaims };

   socket.on(
      "createRoom",
      (
        opts:
          | { allow?: { username?: string } }
          | ((p: { roomCode: string }) => void),
        maybeCb?: (payload: { roomCode: string }) => void
      ) => {
        const hasOpts = typeof opts === "object" && typeof (opts as any) !== "function";
        const cb = (hasOpts ? maybeCb : opts) as (p: { roomCode: string }) => void;
        const allowInput = (hasOpts ? (opts as any).allow : undefined) as
          | { username?: string }
          | undefined;

        const roomCode = createPrivateRoomCode();
        const room: Room = { users: new Set([socket.id]) };

        if (allowInput?.username) {
          room.allow = { type: "username", value: allowInput.username };
        }

        rooms[roomCode] = room;
        socket.join(roomCode);

        cb({ roomCode });

        socket.emit("userJoined", { username: displayName(user) });
      }
    );


    socket.on(
      "joinRoom",
      async (
        roomCode: string,
        callback: (p: {
          success?: true;
          roomCode?: string;
          error?: string;
          members?: string[];
        }) => void
      ) => {
        const room = rooms[roomCode];
        if (!room) return callback({ error: "Room not found" });

        if (!isAllowed(user, room.allow)) {
          return callback({ error: "You are not allowed to join this room." });
        }

        room.users.add(socket.id);
        socket.join(roomCode);

        const members: string[] = [];
        for (const sid of room.users) {
          const s = io.sockets.sockets.get(sid);
          const u = s?.data?.user as AccessClaims | undefined;
          if (u) members.push(displayName(u));
        }

        socket.to(roomCode).emit("userJoined", { username: displayName(user) });

        callback({ success: true, roomCode, members });
      }
    );


    socket.on("leaveRoom", (roomCode: string) => {
      const room = rooms[roomCode];
      if (!room) return;
      if (room.users.delete(socket.id)) {
        socket.leave(roomCode);
        socket.to(roomCode).emit("userLeft", { username: displayName(user) });
        deleteRoomIfEmpty(roomCode);
      }
    });


    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [code, room] of Object.entries(rooms)) {
        if (room.users.delete(socket.id)) {
          socket.to(code).emit("userLeft", { username: displayName(user) });
          deleteRoomIfEmpty(code);
        }
      }
    });
  });
}