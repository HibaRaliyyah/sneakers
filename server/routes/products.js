import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

/* ─── GET /api/products ─── */
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    const query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortObj = {};
    if (sort === 'Price: Low to High') sortObj = { price: 1 };
    else if (sort === 'Price: High to Low') sortObj = { price: -1 };
    else if (sort === 'Newest') sortObj = { createdAt: -1 };
    else sortObj = { _id: 1 }; // Featured

    const products = await Product.find(query).sort(sortObj);
    res.json({ products });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ─── GET /api/products/:id ─── */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
