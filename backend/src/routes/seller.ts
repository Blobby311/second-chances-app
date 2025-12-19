import express, { Response } from 'express';
import { query } from 'express-validator';
import Product from '../models/Product';
import Order from '../models/Order';
import Rating from '../models/Rating';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import Notification from '../models/Notification';

const router = express.Router();

// Get seller stock (products)
// NOTE: Products are tied to the seller who created them via { seller: userId }
// Buyer and seller data are completely separate - switching roles does NOT mix data
router.get(
  '/stock',
  authenticate,
  requireRole(['seller']),
  query('status').optional().isIn(['to-ship', 'delivered', 'cancelled']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.query;
      // Only return products created by this seller - buyer browsing sees different products
      const query: any = { seller: req.userId };
      if (status) {
        query.status = status;
      }

      const products = await Product.find(query).sort({ createdAt: -1 });
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get seller orders
// NOTE: Buyer and seller data are completely separate:
// - Seller orders: filtered by { seller: userId } - only shows orders where user is the seller
// - Buyer orders: filtered by { buyer: userId } - only shows orders where user is the buyer
// - Products: filtered by { seller: userId } - only shows products created by the seller
// Switching roles does NOT mix or merge data - each role has its own separate data
router.get(
  '/orders',
  authenticate,
  requireRole(['seller']),
  query('status').optional().isIn(['to-ship', 'delivered', 'cancelled', 'pending', 'ready-for-pickup', 'on-the-way', 'completed']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.query;
      // Only return orders where this user is the seller - buyer data is separate
      const query: any = { seller: req.userId };
      if (status) {
        query.status = status;
      }

      const orders = await Order.find(query)
        .populate('buyer', 'name avatar')
        .populate('product')
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get seller earnings
router.get('/earnings', authenticate, requireRole(['seller']), async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({
      seller: req.userId,
      status: { $in: ['delivered', 'completed'] },
    });

    const totalEarnings = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;

    // Get earnings by month for graph
    const monthlyEarnings: { [key: string]: number } = {};
    orders.forEach((order) => {
      const month = order.createdAt.toISOString().substring(0, 7); // YYYY-MM
      monthlyEarnings[month] = (monthlyEarnings[month] || 0) + order.total;
    });

    res.json({
      totalEarnings,
      totalOrders,
      monthlyEarnings,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get seller stats
router.get('/stats', authenticate, requireRole(['seller']), async (req: AuthRequest, res: Response) => {
  try {
    const activeListings = await Product.countDocuments({
      seller: req.userId,
      status: 'to-ship',
    });

    const totalOrders = await Order.countDocuments({ seller: req.userId });
    const pendingOrders = await Order.countDocuments({
      seller: req.userId,
      status: { $in: ['pending', 'ready-for-pickup', 'on-the-way'] },
    });
    const completedOrders = await Order.countDocuments({
      seller: req.userId,
      status: { $in: ['delivered', 'completed'] },
    });

    // Calculate trust score (average rating)
    const ratings = await Rating.find({ rated: req.userId });
    const trustScore =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
        : 0;

    const itemsSold = await Order.countDocuments({
      seller: req.userId,
      status: { $in: ['delivered', 'completed'] },
    });

    res.json({
      activeListings,
      trustScore: parseFloat(trustScore.toFixed(1)),
      totalOrders,
      pendingOrders,
      completedOrders,
      itemsSold,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get seller alerts
router.get('/alerts', authenticate, requireRole(['seller']), async (req: AuthRequest, res: Response) => {
  try {
    const lowStock = await Product.countDocuments({
      seller: req.userId,
      status: 'to-ship',
    });

    const pendingShipments = await Order.countDocuments({
      seller: req.userId,
      status: { $in: ['pending', 'ready-for-pickup'] },
    });

    res.json({
      lowStock: lowStock < 5, // Alert if less than 5 items
      lowStockCount: lowStock,
      pendingShipments,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent sales
router.get('/recent-sales', authenticate, requireRole(['seller']), async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ seller: req.userId })
      .populate('product', 'name imageUrl price')
      .populate('buyer', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

