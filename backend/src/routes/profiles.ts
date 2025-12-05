import express, { Request, Response } from 'express';
import User from '../models/User';
import Rating from '../models/Rating';
import Order from '../models/Order';
import { Badge } from '../models/Badge';
import UserBadge from '../models/Badge';
import Product from '../models/Product';

const router = express.Router();

// Get seller profile
router.get('/sellers/:id', async (req: Request, res: Response) => {
  try {
    const seller = await User.findById(req.params.id).select('-password');
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const ratings = await Rating.find({ rated: req.params.id });
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
      : 0;

    const boxesShared = await Order.countDocuments({
      seller: req.params.id,
      status: { $in: ['delivered', 'completed'] },
    });

    const badges = await UserBadge.find({ user: req.params.id, isEarned: true })
      .populate('badge');

    const reviews = await Rating.find({ rated: req.params.id })
      .populate('rater', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      ...seller.toObject(),
      rating: parseFloat(avgRating.toFixed(1)),
      boxesShared,
      badges: badges.map((ub: any) => ub.badge),
      reviews,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get buyer profile
router.get('/buyers/:id', async (req: Request, res: Response) => {
  try {
    const buyer = await User.findById(req.params.id).select('-password');
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const ordersPlaced = await Order.countDocuments({ buyer: req.params.id });
    const ratings = await Rating.find({ rated: req.params.id });
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
      : 0;

    const badges = await UserBadge.find({ user: req.params.id, isEarned: true })
      .populate('badge');

    const reviews = await Rating.find({ rated: req.params.id })
      .populate('rater', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      ...buyer.toObject(),
      ordersPlaced,
      rating: parseFloat(avgRating.toFixed(1)),
      badges: badges.map((ub: any) => ub.badge),
      reviews,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

