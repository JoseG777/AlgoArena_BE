import { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";


type RoomCode = string;


interface Room {
 users: Set<string>;
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


export function registerSocketHandlers(io: Server) {
 io.on("connection", (socket: Socket) => {
   console.log("User connected:", socket.id);


   socket.on("createRoom", (callback: (payload: { roomCode: string }) => void) => {
     const roomCode = createPrivateRoomCode();
     rooms[roomCode] = { users: new Set([socket.id]) };
     socket.join(roomCode);
     console.log("Room created:", roomCode);
     callback({ roomCode });
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