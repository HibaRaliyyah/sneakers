import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes    from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes    from './routes/cart.js';
import orderRoutes   from './routes/orders.js';
import paymentRoutes from './routes/payment.js';

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ 
  origin: true, // Allow all origins for Vercel deployment 
  credentials: true 
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/payment',  paymentRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── MongoDB Connection ───────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    })
    .then(() => {
      console.log('✅ Connected to MongoDB Atlas');
      // Only listen if not running in Vercel serverless environment
      if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
          console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
      }
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
    });
}

export default app;
