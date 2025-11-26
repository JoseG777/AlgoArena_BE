// src/routes/leaderboard.ts
import { Router } from 'express';
import { User } from '../model/User';

const leaderboardRoute = Router();

// GET /leaderboard/global
leaderboardRoute.get('/leaderboard/global', async (_req, res) => {
  try {
    //  Find all users, only username + totalPoints
    const users = await User.find(
      {},
      { username: 1, 'stats.totalPoints': 1 }
    )
      .sort({ 'stats.totalPoints': -1 }) // highest points first
      .limit(50) // cap to top 50
      .lean();

    const leaders = users.map((u, i) => ({
      rank: i + 1,
      username: u.username || '(unknown)',
      points: Number(u.stats?.totalPoints || 0),
    }));

    // Optional debug log
    console.log('Global leaderboard payload:', leaders);

    return res.json({ leaders }); 
  } catch (err) {
    console.error('leaderboard error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default leaderboardRoute;
