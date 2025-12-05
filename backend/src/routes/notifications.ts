import express, { Response } from 'express';
import Notification from '../models/Notification';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get notifications
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification || notification.user.toString() !== req.userId) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all notifications
router.delete('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await Notification.deleteMany({ user: req.userId });
    res.json({ message: 'All notifications cleared' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

