import { Router, Request } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { AccessClaims } from '../lib/jwt';

const meRoute = Router();

meRoute.get('/me', requireAuth, (req, res) => {
  const { user } = req as Request & { user?: AccessClaims };
  res.json({ user });
});

export default meRoute;
