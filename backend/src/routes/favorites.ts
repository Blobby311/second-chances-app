import express, { Response } from 'express';
import Favorite from '../models/Favorite';
import Product from '../models/Product';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user favorites
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await Favorite.find({ user: req.userId }).populate('product');
    res.json(favorites.map((f) => f.product));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add to favorites
router.post('/:productId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const existing = await Favorite.findOne({ user: req.userId, product: productId });
    if (existing) {
      return res.json({ message: 'Already favorited' });
    }

    const favorite = new Favorite({
      user: req.userId,
      product: productId,
    });

    await favorite.save();
    res.status(201).json({ message: 'Added to favorites' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from favorites
router.delete('/:productId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await Favorite.findOneAndDelete({ user: req.userId, product: req.params.productId });
    res.json({ message: 'Removed from favorites' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

