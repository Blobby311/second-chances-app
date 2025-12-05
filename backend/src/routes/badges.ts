import express, { Response } from 'express';
import { Badge, UserBadge } from '../models/Badge';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user badges
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userBadges = await UserBadge.find({ user: req.userId })
      .populate('badge')
      .sort({ isEarned: -1, createdAt: -1 });

    res.json(userBadges);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Claim badge
router.post('/:id/claim', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userBadge = await UserBadge.findOne({
      user: req.userId,
      badge: req.params.id,
    });

    if (!userBadge) {
      return res.status(404).json({ error: 'Badge not found' });
    }

    if (!userBadge.isEarned) {
      return res.status(400).json({ error: 'Badge not earned yet' });
    }

    if (userBadge.isClaimed) {
      return res.status(400).json({ error: 'Badge already claimed' });
    }

    userBadge.isClaimed = true;
    await userBadge.save();

    res.json(userBadge);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

