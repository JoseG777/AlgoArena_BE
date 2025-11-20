import express from 'express';
import TriviaProblem from '../model/triviaProblem.js';

const triviaRoute = express.Router();

triviaRoute.get('/trivia', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const questions = await TriviaProblem.aggregate([
      { $match: filter },
      { $sample: { size: 10 } },
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No trivia questions found.' });
    }

    res.json({ success: true, data: questions });
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

triviaRoute.post("/trivia-room", async (req, res) => {
  try {
    const { difficulty, durationSec } = req.body;

    
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    console.log(
      `🎯 Trivia room created: ${roomCode} | Difficulty=${difficulty} | Duration=${durationSec}s`
    );

    
    res.status(200).json({ code: roomCode });
  } catch (error) {
    console.error("Error creating trivia room:", error);
    res.status(500).json({ error: "Failed to create trivia room" });
  }
});

export default triviaRoute;
