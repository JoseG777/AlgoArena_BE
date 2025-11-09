import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { connectDb } from './lib/db_connect';
import registerRoute from './routes/register';
import loginRoute from './routes/login';
import meRoute from './routes/me';
import judge0Route from './routes/judge0';
import friendRoute from './routes/friends';
import logoutRoute from './routes/logout';
import { registerSocketHandlers } from './realtime/socket';
import triviaRoutes from "./routes/trivia"; // ✅ your trivia route import

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cookieParser());
const port = 3001;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

connectDb();

app.get('/', (_req, res) => {
  console.log('Hello, Algo Arena Backend!');
  res.send('Hello, Algo Arena Backend!');
});

// ✅ All routes
app.use(registerRoute);
app.use(loginRoute);
app.use(meRoute);
app.use(judge0Route);
app.use(friendRoute);
app.use(logoutRoute);
app.use("/api/trivia", triviaRoutes); // 👈 Fixed here

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

registerSocketHandlers(io);

server.listen(port, () => {
  console.log(`Backend + Socket.IO running at http://localhost:${port}`);
});
