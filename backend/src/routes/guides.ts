import express, { Request, Response } from 'express';
import Guide from '../models/Guide';
import { query } from 'express-validator';

const router = express.Router();

// Get guides
router.get(
  '/',
  query('category').optional().isIn(['Vegetables', 'Fruits', 'Packaging', 'Business']),
  async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const query: any = { isActive: true };
      if (category) {
        query.category = category;
      }

      const guides = await Guide.find(query).sort({ createdAt: -1 });
      res.json(guides);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get guide details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    res.json(guide);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

