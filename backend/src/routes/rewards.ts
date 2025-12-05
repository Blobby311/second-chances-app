import express, { Request, Response } from 'express';
import Reward from '../models/Reward';
import PointsTransaction from '../models/Points';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get available rewards
router.get('/available', async (req: Request, res: Response) => {
  try {
    const rewards = await Reward.find({ isActive: true }).sort({ pointsCost: 1 });
    res.json(rewards);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Redeem reward
router.post('/:id/redeem', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const reward = await Reward.findById(req.params.id);

    if (!reward || !reward.isActive) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    // Check points balance
    const transactions = await PointsTransaction.find({ user: req.userId });
    const balance = transactions.reduce((sum, t) => sum + t.amount, 0);

    if (balance < reward.pointsCost) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    // Deduct points
    await PointsTransaction.create({
      user: req.userId,
      amount: -reward.pointsCost,
      type: 'deduct',
      source: 'reward',
      description: `Redeemed reward: ${reward.name}`,
    });

    res.json({ message: 'Reward redeemed successfully', reward });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

