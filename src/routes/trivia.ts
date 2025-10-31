import express from "express";
import axios from "axios";

const router = express.Router();

let cachedQuestions: any[] = [];
let lastFetchTime = 0;

router.get("/api/trivia", async (_req, res) => {
  const now = Date.now();
  const cacheDuration = 1000 * 60 * 2; // 2 minutes

  try {
    // If we fetched recently, reuse cache
    if (cachedQuestions.length > 0 && now - lastFetchTime < cacheDuration) {
      console.log("⚡ Serving trivia questions from cache");
      return res.json({ success: true, data: cachedQuestions });
    }

    console.log("🎯 Fetching fresh questions from Open Trivia DB...");
    const response = await axios.get("https://opentdb.com/api.php", {
      params: {
        amount: 10,
        category: 18,
        type: "multiple",
      },
    });

    if (response.data.response_code !== 0) {
      console.error("⚠️ Trivia API returned non-zero response code:", response.data.response_code);
      return res.status(500).json({ success: false, error: "Invalid response from trivia API" });
    }

    cachedQuestions = response.data.results;
    lastFetchTime = now;

    console.log("✅ Fetched and cached trivia questions!");
    res.json({ success: true, data: cachedQuestions });
  } catch (error: any) {
    console.error("❌ Error fetching trivia questions:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
