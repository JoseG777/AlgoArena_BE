import { Router, Request, Response } from 'express';
import { User } from '../model/User';
import { requireAuth } from '../middleware/requireAuth';

const leaderboardRoute = Router();

// TOP 5 USERS
leaderboardRoute.get('/leaderboard/top', requireAuth, async (req: Request, res: Response) => {
  try {
    const users = await User.find().lean();

    const sorted = users.sort((a, b) => (b.stats.totalPoints || 0) - (a.stats.totalPoints || 0));

    const top5 = sorted.slice(0, 5).map((u, i) => ({
      rank: i + 1,
      username: u.username,
      points: u.stats.totalPoints || 0,
    }));

    return res.json({ top5 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

// MY RANK
leaderboardRoute.get('/leaderboard/rank', requireAuth, async (req: Request, res: Response) => {
  try {
    const users = await User.find().lean();
    const sorted = users.sort((a, b) => (b.stats.totalPoints || 0) - (a.stats.totalPoints || 0));

    const userId = (req as any).user?.sub;
    const idx = sorted.findIndex(u => u._id.toString() === userId);
    const myRank = idx === -1 ? null : idx + 1;

    return res.json({ rank: myRank, totalUsers: sorted.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load rank' });
  }
});

export default leaderboardRoute;