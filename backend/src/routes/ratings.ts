import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Rating from '../models/Rating';
import Order from '../models/Order';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import PointsTransaction from '../models/Points';
import Notification from '../models/Notification';

const router = express.Router();

// Submit rating
router.post(
  '/',
  authenticate,
  requireRole(['buyer']),
  [
    body('orderId').notEmpty(),
    body('stars').isInt({ min: 1, max: 5 }),
    body('experience').isIn(['shy-seedling', 'friendly-sprout', 'jolly-pumpkin']),
    body('foodQuality').isInt({ min: 0, max: 100 }),
    body('pickupEase').isInt({ min: 0, max: 100 }),
    body('feedback').optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { orderId, stars, experience, foodQuality, pickupEase, feedback } = req.body;

      const order = await Order.findById(orderId).populate('seller');
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.buyer.toString() !== req.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Check if already rated
      const existing = await Rating.findOne({ order: orderId });
      if (existing) {
        return res.status(400).json({ error: 'Order already rated' });
      }

      const rating = new Rating({
        order: orderId,
        rater: req.userId,
        rated: order.seller,
        stars,
        experience,
        foodQuality,
        pickupEase,
        feedback,
      });

      await rating.save();

      // Award points for rating
      const pointsEarned = 50; // 50 points for rating
      await PointsTransaction.create({
        user: req.userId,
        amount: pointsEarned,
        type: 'earn',
        source: 'rating',
        description: 'Points earned for rating seller',
      });

      // Create notification
      await Notification.create({
        user: req.userId,
        type: 'points',
        title: 'Points Earned',
        message: `You earned ${pointsEarned} points for rating!`,
        link: '/rewards',
      });

      res.status(201).json(rating);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get seller reviews
router.get('/sellers/:id/reviews', async (req: Request, res: Response) => {
  try {
    const reviews = await Rating.find({ rated: req.params.id })
      .populate('rater', 'name avatar')
      .populate('order', 'orderId')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get buyer reviews
router.get('/buyers/:id/reviews', async (req: Request, res: Response) => {
  try {
    const reviews = await Rating.find({ rated: req.params.id })
      .populate('rater', 'name avatar')
      .populate('order', 'orderId')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

