import { Router } from 'express';

const logoutRoute = Router();

logoutRoute.post('/logout', (req, res) => {
  res.clearCookie('access', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV !== 'development',
  });

  return res.status(200).json({ message: 'Logged out' });
});

export default logoutRoute;