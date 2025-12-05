import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import Order from '../models/Order';

const router = express.Router();

// AI Chat (placeholder - integrate with AI service)
router.post(
  '/chat',
  authenticate,
  [body('message').trim().notEmpty(), body('context').optional().isObject()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { message, context } = req.body;

      // In production, integrate with AI service (OpenAI, etc.)
      // For now, return a simple response
      const response = `AI response to: ${message}. This is a placeholder - integrate with your AI service.`;

      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get AI chat history
router.get('/chat/history', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // In production, store chat history in database
    res.json([]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Food assistant (buyer)
router.post(
  '/food-assistant',
  authenticate,
  [body('question').trim().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get recent purchases for context
      const recentPurchases = await Order.find({ buyer: req.userId })
        .populate('product', 'name category')
        .sort({ createdAt: -1 })
        .limit(5);

      const { question } = req.body;

      // In production, send to AI with context
      const response = `AI food assistant response to: ${question}. Recent purchases context: ${recentPurchases.length} items.`;

      res.json({ response, recentPurchases });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get recent purchases for AI context
router.get('/buyer/recent-purchases', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const purchases = await Order.find({ buyer: req.userId })
      .populate('product', 'name category imageUrl')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(purchases);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

