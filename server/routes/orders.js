import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

/* ─── POST /api/orders ─── */
router.post('/', async (req, res) => {
  try {
    const { promoCode, address } = req.body;

    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    const items = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      price: i.product.price,
      color: i.color,
      colorName: i.colorName,
      size: i.size,
      qty: i.qty,
    }));

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = promoCode?.toUpperCase() === 'VOID15' ? Math.round(subtotal * 0.15) : 0;
    const shipping = subtotal > 300 ? 0 : 25;
    const total = subtotal - discount + shipping;

    const order = await Order.create({
      user: req.userId,
      items,
      subtotal,
      discount,
      shipping,
      total,
      promoCode: promoCode || '',
      address: address || {},
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({ order });
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ─── GET /api/orders ─── */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ─── GET /api/orders/:id ─── */
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
