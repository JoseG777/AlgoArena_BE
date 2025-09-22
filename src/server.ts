import express from "express";
import cors from "cors";

const app = express();
const port = 3001;
app.use(cors({
  origin: "*"
}));

app.get("/", (_req, res) => {
  console.log("Hello, Algo Arena Backend!");
  res.send("Hello, Algo Arena Backend!");
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});