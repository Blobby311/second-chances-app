import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import PaymentMethod from '../models/PaymentMethod';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get payment methods
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const methods = await PaymentMethod.find({ user: req.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(methods);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add payment method
router.post(
  '/',
  authenticate,
  [
    body('type').isIn(['GrabPay', 'TnG', 'FPX', 'Card']),
    body('label').trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // If setting as default, unset others
      if (req.body.isDefault) {
        await PaymentMethod.updateMany({ user: req.userId }, { isDefault: false });
      }

      const method = new PaymentMethod({
        ...req.body,
        user: req.userId,
      });

      await method.save();
      res.status(201).json(method);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Set default payment method
router.put('/:id/default', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await PaymentMethod.updateMany({ user: req.userId }, { isDefault: false });
    const method = await PaymentMethod.findByIdAndUpdate(req.params.id, { isDefault: true }, { new: true });

    if (!method) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    res.json(method);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete payment method
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const method = await PaymentMethod.findById(req.params.id);

    if (!method || method.user.toString() !== req.userId) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    await PaymentMethod.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment method deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Process payment (placeholder - integrate with payment gateway)
router.post('/process', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // In production, integrate with payment gateway (Stripe, Razorpay, etc.)
    res.json({ success: true, transactionId: `TXN${Date.now()}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

