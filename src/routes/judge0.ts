import { Router } from "express";

const judge0Route = Router();

judge0Route.post("/judge0/run", async (req, res) => {
  const { language_id, source_code, stdin } = req.body;

  try {
    const apiRes = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          language_id,
          source_code,
          stdin,
        }),
      }
    );

    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Judge0 run failed" });
  }
});

export default judge0Route;