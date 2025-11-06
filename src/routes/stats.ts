import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';
import { Match } from '../model/Match';
import { User } from '../model/User';

const statsRoute = Router();

statsRoute.get('/me/matches', requireAuth, async (req, res) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const myId = String(user.sub);

    const me = await User.findById(myId, { 'stats.totalPoints': 1 }).lean();
    const totalPoints = Number(me?.stats?.totalPoints || 0);

    const rows = await Match.find(
      { 'players.userId': myId },
      { code: 1, startedAt: 1, players: 1, winnerUserId: 1, isTie: 1 }
    )
      .sort({ startedAt: -1 })
      .limit(100)
      .lean();

    const opponentIds: Set<string> = new Set();
    for (const m of rows) {
      const opp = (m.players || []).find(p => String(p.userId) !== myId);
      if (opp?.userId) opponentIds.add(String(opp.userId));
    }

    const opponents = await User.find(
      { _id: { $in: Array.from(opponentIds) } },
      { username: 1 }
    ).lean();
    const unameById = new Map(opponents.map(u => [String(u._id), u.username]));

    const matches = rows.map(m => {
      const mePlayer = m.players.find(p => String(p.userId) === myId);
      const oppPlayer = m.players.find(p => String(p.userId) !== myId);
      const points = Number(mePlayer?.score || 0);

      let result: 'win'|'loss'|'tie' = 'tie';
      if (!m.isTie) {
        result = String(m.winnerUserId) === myId ? 'win' : 'loss';
      }

      return {
        id: String(m._id),
        startedAt: new Date(m.startedAt).toISOString(),
        opponentUsername: oppPlayer ? (unameById.get(String(oppPlayer.userId)) || '(unknown)') : null,
        points,
        result,
      };
    });

    return res.json({ totalPoints, matches });
  } catch (e) {
    console.error('stats route error:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default statsRoute;
