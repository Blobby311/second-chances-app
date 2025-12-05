import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import PointsTransaction from '../models/Points';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user points balance
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await PointsTransaction.find({ user: req.userId }).sort({ createdAt: -1 });
    const balance = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      balance,
      transactions: transactions.slice(0, 20), // Last 20 transactions
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Earn points
router.post(
  '/earn',
  authenticate,
  [
    body('amount').isInt({ min: 1 }),
    body('source').trim().notEmpty(),
    body('description').trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const transaction = new PointsTransaction({
        user: req.userId,
        amount: req.body.amount,
        type: 'earn',
        source: req.body.source,
        description: req.body.description,
      });

      await transaction.save();
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Deduct points
router.put(
  '/deduct',
  authenticate,
  [
    body('amount').isInt({ min: 1 }),
    body('description').trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check balance
      const transactions = await PointsTransaction.find({ user: req.userId });
      const balance = transactions.reduce((sum, t) => sum + t.amount, 0);

      if (balance < req.body.amount) {
        return res.status(400).json({ error: 'Insufficient points' });
      }

      const transaction = new PointsTransaction({
        user: req.userId,
        amount: -req.body.amount,
        type: 'deduct',
        source: 'manual',
        description: req.body.description,
      });

      await transaction.save();
      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

