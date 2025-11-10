import express from 'express';
import TriviaProblem from '../model/triviaProblem.js';

const router = express.Router();

router.get('/trivia', async (req, res) => {
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

export default router;
