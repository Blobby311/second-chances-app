import express, { Request, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import Product from '../models/Product';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';
import Favorite from '../models/Favorite';

const router = express.Router();

// Get products (for buyers - browse)
router.get(
  '/',
  query('filter').optional().isIn(['all', 'free', 'veg', 'fruit']),
  query('search').optional().isString(),
  async (req: Request, res: Response) => {
    try {
      const { filter, search } = req.query;
      let query: any = { status: 'to-ship' }; // Only show available products

      // Apply search
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      // Apply filter
      if (filter === 'free') {
        query.price = 0;
      } else if (filter === 'veg') {
        query.category = 'Vegetables';
      } else if (filter === 'fruit') {
        query.category = 'Fruits';
      }

      const products = await Product.find(query)
        .populate('seller', 'name avatar isVerified')
        .sort({ createdAt: -1 })
        .limit(50);

      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get nearby products
router.get(
  '/nearby',
  query('lat').isFloat(),
  query('lng').isFloat(),
  query('radius').optional().isFloat(),
  async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string) || 10; // km

      const products = await Product.find({
        status: 'to-ship',
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: radius * 1000, // Convert km to meters
          },
        },
      })
        .populate('seller', 'name avatar')
        .limit(50);

      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get product details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'name avatar isVerified'
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (seller only)
router.post(
  '/',
  authenticate,
  requireRole(['seller']),
  upload.single('image'),
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('category').isIn(['Fruits', 'Vegetables', 'Mix']),
    body('price').isFloat({ min: 0 }),
    body('deliveryMethod').isIn(['Doorstep', 'Hub Collect', 'Self Pick-Up']),
    body('imperfectLevel').optional().isInt({ min: 0, max: 100 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Image is required' });
      }

      const { name, description, category, price, deliveryMethod, imperfectLevel, likelyContents, bestBefore, location } = req.body;

      const product = new Product({
        seller: req.userId,
        name,
        description,
        category,
        price: parseFloat(price),
        imageUrl: `/uploads/${req.file.filename}`,
        deliveryMethod,
        imperfectLevel: imperfectLevel ? parseInt(imperfectLevel) : 50,
        likelyContents: likelyContents ? JSON.parse(likelyContents) : [],
        bestBefore: bestBefore ? new Date(bestBefore) : undefined,
        location: location ? { type: 'Point', coordinates: [location.longitude, location.latitude] } : undefined,
      });

      await product.save();
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update product (seller only)
router.put(
  '/:id',
  authenticate,
  requireRole(['seller']),
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (product.seller.toString() !== req.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updateData: any = { ...req.body };
      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }
      if (updateData.price) {
        updateData.price = parseFloat(updateData.price);
      }
      if (updateData.imperfectLevel) {
        updateData.imperfectLevel = parseInt(updateData.imperfectLevel);
      }
      if (updateData.likelyContents) {
        updateData.likelyContents = JSON.parse(updateData.likelyContents);
      }

      const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete product (seller only)
router.delete('/:id', authenticate, requireRole(['seller']), async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

