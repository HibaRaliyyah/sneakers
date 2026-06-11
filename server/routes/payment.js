import express from 'express';
import Stripe from 'stripe';
import authenticate from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payment/create-intent
 * Creates a Stripe PaymentIntent for the cart total.
 * Body: { amount: number (in dollars), currency?: string, items: [] }
 */
router.post('/create-intent', authenticate, async (req, res) => {
  try {
    const { amount, currency = 'usd', items } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Amount must be in cents for Stripe
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata: {
        userId: req.userId,
        itemCount: items?.length || 0,
      },
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/payment/create-intent-guest
 * Creates a Stripe PaymentIntent for guest users.
 */
router.post('/create-intent-guest', async (req, res) => {
  try {
    const { amount, currency = 'usd', items } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata: {
        guest: 'true',
        itemCount: items?.length || 0,
      },
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
