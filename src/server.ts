import express from "express";
import cors from "cors";
import { connectDb } from "./lib/db_connect";
import { User } from "./model/User";
import registerRoute from "./routes/register";

const app = express();
app.use(express.json()); 
const port = 3001;
app.use(cors({
  origin: "*"
}));

connectDb();

app.get("/", (_req, res) => {
  console.log("Hello, Algo Arena Backend!");
  res.send("Hello, Algo Arena Backend!");
});

app.use(registerRoute);

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});