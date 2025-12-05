import express, { Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import Order from '../models/Order';
import Product from '../models/Product';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import Notification from '../models/Notification';
import PointsTransaction from '../models/Points';
import Reward from '../models/Reward';

const router = express.Router();

// Create order
router.post(
  '/',
  authenticate,
  requireRole(['buyer']),
  [
    body('productId').notEmpty(),
    body('paymentMethod').notEmpty(),
    body('pointsToUse').optional().isInt({ min: 0 }),
    body('rewardId').optional().isString(),
    body('addressId').optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { productId, paymentMethod, pointsToUse = 0, rewardId, addressId } = req.body;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (product.status !== 'to-ship') {
        return res.status(400).json({ error: 'Product is not available' });
      }

      // Calculate total
      let total = product.price;
      let discount = 0;

      // Apply reward discount
      if (rewardId) {
        const reward = await Reward.findById(rewardId);
        if (reward && reward.isActive) {
          if (reward.type === 'free-delivery') {
            discount = 5; // RM5 delivery fee
          } else if (reward.type === 'discount') {
            discount = (total * reward.discount) / 100;
          }
        }
      }

      // Apply points (1 point = RM0.01)
      const pointsDiscount = (pointsToUse || 0) * 0.01;
      total = Math.max(0, total - discount - pointsDiscount);

      // Deduct points if used
      if (pointsToUse > 0) {
        await PointsTransaction.create({
          user: req.userId,
          amount: -pointsToUse,
          type: 'deduct',
          source: 'checkout',
          description: `Used ${pointsToUse} points for order`,
        });
      }

      // Create order
      const order = new Order({
        buyer: req.userId,
        seller: product.seller,
        product: productId,
        total,
        pointsUsed: pointsToUse || 0,
        rewardUsed: rewardId,
        paymentMethod,
        deliveryMethod: product.deliveryMethod,
        address: addressId,
        status: 'pending',
      });

      await order.save();

      // Update product status
      product.status = 'delivered'; // Mark as sold
      await product.save();

      // Create notifications
      await Notification.create({
        user: req.userId,
        type: 'order',
        title: 'Order Placed',
        message: `Your order ${order.orderId} has been placed successfully`,
        link: `/orders/${order._id}`,
      });

      await Notification.create({
        user: product.seller,
        type: 'order',
        title: 'New Order',
        message: `You have a new order ${order.orderId}`,
        link: `/orders/${order._id}`,
      });

      const populatedOrder = await Order.findById(order._id)
        .populate('product')
        .populate('seller', 'name avatar')
        .populate('buyer', 'name avatar');

      res.status(201).json(populatedOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get order details
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product')
      .populate('seller', 'name avatar email phone')
      .populate('buyer', 'name avatar email phone')
      .populate('address');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization
    if (
      order.buyer.toString() !== req.userId &&
      order.seller.toString() !== req.userId
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (seller only)
router.put(
  '/:id/status',
  authenticate,
  requireRole(['seller']),
  [body('status').isIn(['pending', 'ready-for-pickup', 'on-the-way', 'delivered', 'completed', 'cancelled'])],
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.seller.toString() !== req.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      order.status = req.body.status;
      await order.save();

      // Create notification
      await Notification.create({
        user: order.buyer,
        type: 'order',
        title: 'Order Updated',
        message: `Your order ${order.orderId} status has been updated to ${req.body.status}`,
        link: `/orders/${order._id}`,
      });

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get buyer orders
router.get(
  '/buyer/orders',
  authenticate,
  requireRole(['buyer']),
  query('status').optional().isIn(['to-receive', 'completed', 'cancelled']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.query;
      let query: any = { buyer: req.userId };

      // Map frontend status to backend status
      if (status === 'to-receive') {
        query.status = { $in: ['pending', 'ready-for-pickup', 'on-the-way', 'delivered'] };
      } else if (status === 'completed') {
        query.status = 'completed';
      } else if (status === 'cancelled') {
        query.status = 'cancelled';
      }

      const orders = await Order.find(query)
        .populate('product', 'name imageUrl price')
        .populate('seller', 'name avatar')
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

