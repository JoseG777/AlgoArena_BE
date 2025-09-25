import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./lib/db_connect";
import { User } from "./model/User";
import registerRoute from "./routes/register";
import loginRoute from "./routes/login";
import meRoute from "./routes/me";

const app = express();
app.use(express.json());
app.use(cookieParser()); 
const port = 3001;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

connectDb();

app.get("/", (_req, res) => {
  console.log("Hello, Algo Arena Backend!");
  res.send("Hello, Algo Arena Backend!");
});

app.use(registerRoute);
app.use(loginRoute);
app.use(meRoute);

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});