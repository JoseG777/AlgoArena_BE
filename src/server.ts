import express from "express";
import cors from "cors";
import { connectDb } from "./lib/db_connect";
import { User } from "./model/User";

const app = express();
const port = 3001;
app.use(cors({
  origin: "*"
}));

app.get("/", (_req, res) => {
  console.log("Hello, Algo Arena Backend!");
  res.send("Hello, Algo Arena Backend!");
});

(async () => {
  await connectDb();
  await User.init();

  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
})();