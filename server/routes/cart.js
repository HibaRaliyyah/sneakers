import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

/* ─── GET /api/cart ─── */
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.userId, items: [] });
    res.json({ cart });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ─── POST /api/cart ─── */
router.post('/', async (req, res) => {
  try {
    const { productId, qty = 1, size = 'US 10', color, colorName } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) cart = await Cart.create({ user: req.userId, items: [] });

    const existing = cart.items.find(
      (i) => i.product.toString() === productId && i.size === size
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({
        product: productId,
        qty,
        size,
        color: color || product.color,
        colorName: colorName || 'Default',
      });
    }

    await cart.save();
    await cart.populate('items.product');
    res.json({ cart });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ─── PUT /api/cart/:itemId ─── */
router.put('/:itemId', async (req, res) => {
  try {
    const { qty } = req.body;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (qty < 1) {
      cart.items.pull(req.params.itemId);
    } else {
      item.qty = qty;
    }

    await cart.save();
    await cart.populate('items.product');
    res.json({ cart });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ─── DELETE /api/cart/:itemId ─── */
router.delete('/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate('items.product');
    res.json({ cart });
  } catch (err) {
    console.error('Remove item error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ─── DELETE /api/cart ─── (clear cart) */
router.delete('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
