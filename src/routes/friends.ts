import { Router, Request } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';
import { FriendRequest } from '../model/FriendRequest';
import { Friends } from '../model/Friends';
import { User } from '../model/User';

const friendRoute = Router();

friendRoute.post('/friend-requests', requireAuth, async (req: Request, res) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const requesterIdFromToken = String(user.sub);
    
    const {
      recipientUsername,
      requesterId: requesterIdFromBody, 
    }: { recipientUsername?: string; requesterId?: string } = req.body || {};

    if (!recipientUsername || !recipientUsername.trim()) {
      return res.status(400).json({ error: 'recipientUsername required' });
    }

    if (requesterIdFromBody && requesterIdFromBody !== requesterIdFromToken) {
      return res.status(403).json({ error: 'Requester mismatch' });
    }

    const requesterId = requesterIdFromToken;
    const recipientUser = await User.findOne({ username: recipientUsername.trim() }).lean();

    if (!recipientUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recipientId = String(recipientUser._id);
    if (requesterId === recipientId) {
      return res.status(400).json({ error: 'Cannot send request to yourself' });
    }

    const alreadyFriends = await Friends.findOne({
      $or: [
        { userA: requesterId, userB: recipientId },
        { userA: recipientId, userB: requesterId },
      ],
    }).lean();

    if (alreadyFriends) {
      return res.status(409).json({ error: 'Already friends' });
    }

    const existing = await FriendRequest.findOne({
      requester: requesterId,
      recipient: recipientId,
    }).lean();

    if (existing) {
      return res.status(400).json({ error: 'Request already exists' });
    }

    const doc = await FriendRequest.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending',
    });

    return res.status(201).json({
      recipientUsername: recipientUser.username,
    });

   } catch (err: any) {
    console.error('friend-requests error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
   }
});

friendRoute.get('/friend-requests/incoming', requireAuth, async (req: Request, res) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const myId = String(user.sub);

    const status = String((req.query.status as string) || 'pending').toLowerCase();
    const filter: any = { recipient: myId };
    if (status !== 'all') filter.status = status;

    const rows = await FriendRequest.find(filter, { requester: 1, recipient: 1, status: 1 }).lean();

    const requesterIds = rows.map(r => r.requester);
    const users = await User.find({ _id: { $in: requesterIds } }, { username: 1 }).lean();
    const usernameById = new Map(users.map(u => [String(u._id), u.username]));

    const data = rows.map(r => ({
      id: String(r._id),
      requesterId: r.requester,
      requesterUsername: usernameById.get(String(r.requester)) ?? '(unknown)',
      recipientId: r.recipient,
      status: r.status,
    }));

    return res.json(data);
    
   } catch (e: any) {
      console.error('incoming list error:', e);
      return res.status(500).json({ error: 'Internal Server Error' });
   }
});

friendRoute.delete('/friends/:username', requireAuth, async (req: Request, res) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const myId = String(user.sub);
    const friendUsername = (req.params.username || '').trim();

    if (!friendUsername) {
      return res.status(400).json({ error: 'Friend username required' });
    }

    const friendUser = await User.findOne({ username: friendUsername }).lean();
    if (!friendUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friendId = String(friendUser._id);
    if (friendId === myId) {
      return res.status(400).json({ error: 'Cannot remove yourself' });
    }

    const friendship = await Friends.findOneAndDelete({
      $or: [
        { userA: myId, userB: friendId },
        { userA: friendId, userB: myId },
      ],
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    return res.json({ message: `Removed ${friendUsername} from friends` });
  } catch (err: any) {
    console.error('remove friend error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default friendRoute;