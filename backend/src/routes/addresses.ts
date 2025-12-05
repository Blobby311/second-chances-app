import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Address from '../models/Address';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user addresses
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await Address.find({ user: req.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add address
router.post(
  '/',
  authenticate,
  [
    body('label').trim().notEmpty(),
    body('address').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('state').trim().notEmpty(),
    body('postalCode').trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // If this is set as default, unset others
      if (req.body.isDefault) {
        await Address.updateMany({ user: req.userId }, { isDefault: false });
      }

      const address = new Address({
        ...req.body,
        user: req.userId,
      });

      await address.save();
      res.status(201).json(address);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update address
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address || address.user.toString() !== req.userId) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If setting as default, unset others
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.userId, _id: { $ne: req.params.id } }, { isDefault: false });
    }

    const updated = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Set default address
router.put('/:id/default', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await Address.updateMany({ user: req.userId }, { isDefault: false });
    const address = await Address.findByIdAndUpdate(req.params.id, { isDefault: true }, { new: true });

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(address);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete address
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address || address.user.toString() !== req.userId) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: 'Address deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

