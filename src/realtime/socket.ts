import { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";


type RoomCode = string;


interface Room {
 users: Set<string>;
 timer?: NodeJS.Timeout;
 timeLeft: number;
}


const rooms: Record<RoomCode, Room> = {};
const ROOM_TIMER_DURATION = 30; // in seconds
const TIMER_INTERVAL = 1000; // 1 second


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
   if (room.timer) clearInterval(room.timer);
   delete rooms[code];
 }
}

function startRoomTimer(io: Server, roomCode: RoomCode) {
  const room = rooms[roomCode];
  if (!room) return;

  room.timeLeft = ROOM_TIMER_DURATION;

  room.timer = setInterval(() => {
    if (!rooms[roomCode]) return;

    room.timeLeft--;

    // Emit to everyone in the room
    io.to(roomCode).emit("timerUpdate", { timeLeft: room.timeLeft });

    if (room.timeLeft <= 0) {
      clearInterval(room.timer);
      io.to(roomCode).emit("roomClosed");

      // Disconnect all users from the room
      for (const userId of room.users) {
        const socket = io.sockets.sockets.get(userId);
        if (socket) {
          socket.leave(roomCode);
        }
      }

      delete rooms[roomCode];
    }
  }, TIMER_INTERVAL);
}


export function registerSocketHandlers(io: Server) {
 io.on("connection", (socket: Socket) => {
   console.log("User connected:", socket.id);


   socket.on("createRoom", (callback: (payload: { roomCode: string }) => void) => {
     const roomCode = createPrivateRoomCode();
     rooms[roomCode] = { users: new Set([socket.id]), timeLeft: ROOM_TIMER_DURATION };
     socket.join(roomCode);
     console.log("Room created:", roomCode);
     callback({ roomCode });

     startRoomTimer(io, roomCode); // Start timer after creation
   });


   socket.on(
     "joinRoom",
     (roomCode: string, callback: (payload: { success?: true; roomCode?: string; error?: string }) => void) => {
       const room = rooms[roomCode];
       if (!room) {
         return callback({ error: "Room not found" });
       }


       room.users.add(socket.id);
       socket.join(roomCode);
       console.log(socket.id, "joined room", roomCode);


       socket.to(roomCode).emit("userJoined", { socketId: socket.id });


       callback({ success: true, roomCode });
     }
   );


   socket.on("leaveRoom", (roomCode: string) => {
     const room = rooms[roomCode];
     if (!room) return;
     if (room.users.delete(socket.id)) {
       socket.leave(roomCode);
       socket.to(roomCode).emit("userLeft", { socketId: socket.id });
       deleteRoomIfEmpty(roomCode);
     }
   });


   socket.on("disconnect", () => {
     console.log("User disconnected:", socket.id);
     for (const [code, room] of Object.entries(rooms)) {
       if (room.users.delete(socket.id)) {
         socket.to(code).emit("userLeft", { socketId: socket.id });
         deleteRoomIfEmpty(code);
       }
     }
   });
 });
}