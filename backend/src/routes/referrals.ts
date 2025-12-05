import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const router = express.Router();

// Apply referral code (during registration)
router.post(
  '/apply',
  [body('referralCode').trim().notEmpty(), body('userId').notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { referralCode, userId } = req.body;

      const referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return res.status(404).json({ error: 'Invalid referral code' });
      }

      const user = await User.findByIdAndUpdate(userId, { referredBy: referrer._id }, { new: true });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Referral code applied successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

