import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import path from 'path';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().notEmpty(),
    body('phone').optional().trim(),
    body('location').optional().isObject(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, phone, location } = req.body;
      const user = await User.findByIdAndUpdate(
        req.userId,
        { name, phone, location },
        { new: true, runValidators: true }
      ).select('-password');

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Upload avatar
router.post(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        req.userId,
        { avatar: fileUrl },
        { new: true }
      ).select('-password');

      res.json({ avatar: user?.avatar });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update settings
router.put(
  '/settings',
  authenticate,
  [
    body('emailNotifications').optional().isBoolean(),
    body('pushNotifications').optional().isBoolean(),
    body('language').optional().isString(),
    body('theme').optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { emailNotifications, pushNotifications, language, theme } = req.body;
      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          'settings.emailNotifications': emailNotifications,
          'settings.pushNotifications': pushNotifications,
          'settings.language': language,
          'settings.theme': theme,
        },
        { new: true }
      ).select('-password');

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get referral code
router.get('/referral-code', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('referralCode');
    res.json({ referralCode: user?.referralCode });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get referral stats
router.get('/referrals/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const count = await User.countDocuments({ referredBy: req.userId });
    res.json({ totalReferred: count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete account
router.delete('/account', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

