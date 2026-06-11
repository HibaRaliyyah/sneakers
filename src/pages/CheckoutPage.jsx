import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { FiArrowLeft, FiLock, FiPackage, FiCreditCard, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../api/index.js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_STYLE = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '15px',
      '::placeholder': { color: 'rgba(255,255,255,0.25)' },
    },
    invalid: { color: '#ff4d4d' },
  },
};

/* ── Inner payment form (must be inside <Elements>) ── */
function PaymentForm({ total, onSuccess, onBack }) {
  const stripe   = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();

  const [processing, setProcessing] = useState(false);
  const [error, setError]           = useState('');
  const [cardReady, setCardReady]   = useState({ num: false, exp: false, cvc: false });

  const [billing, setBilling] = useState({ name: '', email: user?.email || '' });
  const allReady = cardReady.num && cardReady.exp && cardReady.cvc && billing.name && billing.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || processing) return;
    setProcessing(true);
    setError('');

    try {
      // 1. Create PaymentIntent on our backend
      const endpoint = user ? '/api/payment/create-intent' : '/api/payment/create-intent-guest';
      const { clientSecret } = await apiFetch(endpoint, {
        method: 'POST',
        body: { amount: total, items: cartItems },
      });

      // 2. Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: billing.name, email: billing.email },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // 3. Save order in our DB
        if (user) {
          await apiFetch('/api/orders', {
            method: 'POST',
            body: {
              stripePaymentId: result.paymentIntent.id,
              total,
            },
          });
          await clearCart();
        }
        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const inputBase = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '14px 16px',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontSize: '15px',
  };

  const stripeWrapper = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '14px 16px',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Billing details */}
      <div>
        <label className="block text-xs text-white/40 font-mono mb-1.5 tracking-widest">FULL NAME</label>
        <input
          value={billing.name}
          onChange={e => setBilling(b => ({ ...b, name: e.target.value }))}
          placeholder="Jane Doe"
          required
          style={inputBase}
        />
      </div>
      <div>
        <label className="block text-xs text-white/40 font-mono mb-1.5 tracking-widest">EMAIL</label>
        <input
          type="email"
          value={billing.email}
          onChange={e => setBilling(b => ({ ...b, email: e.target.value }))}
          placeholder="jane@example.com"
          required
          style={inputBase}
        />
      </div>

      {/* Card details */}
      <div>
        <label className="block text-xs text-white/40 font-mono mb-1.5 tracking-widest">CARD NUMBER</label>
        <div style={stripeWrapper}>
          <CardNumberElement
            options={CARD_STYLE}
            onChange={e => setCardReady(p => ({ ...p, num: e.complete }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/40 font-mono mb-1.5 tracking-widest">EXPIRY</label>
          <div style={stripeWrapper}>
            <CardExpiryElement
              options={CARD_STYLE}
              onChange={e => setCardReady(p => ({ ...p, exp: e.complete }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/40 font-mono mb-1.5 tracking-widest">CVC</label>
          <div style={stripeWrapper}>
            <CardCvcElement
              options={CARD_STYLE}
              onChange={e => setCardReady(p => ({ ...p, cvc: e.complete }))}
            />
          </div>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="p-3 rounded-xl text-sm text-red-400"
          style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.2)' }}>
          ⚠️ {error}
        </motion.div>
      )}

      {/* Test card hint */}
      <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
        <span style={{ color: 'var(--neon-blue)' }}>Test card: </span>
        <span className="text-white/50 font-mono">4242 4242 4242 4242 · Any future date · Any CVC</span>
      </div>

      <button
        type="submit"
        disabled={!allReady || processing}
        className="w-full py-4 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))', marginTop: '8px' }}
      >
        {processing ? (
          <>
            <motion.div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            Processing...
          </>
        ) : (
          <><FiLock size={14} /> Pay ${total.toLocaleString()}</>
        )}
      </button>

      <p className="text-center text-[11px] text-white/20 flex items-center justify-center gap-1">
        <FiLock size={10} /> Secured by Stripe · 256-bit SSL encrypted
      </p>
    </form>
  );
}

/* ── Success Screen ── */
function PaymentSuccess({ paymentId, onBack }) {
  return (
    <motion.div className="min-h-screen flex items-center justify-center" style={{ background: '#000010' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center px-6 max-w-md">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #00ff80, #00ffcc)' }}>
          <FiCheck size={50} color="#000" strokeWidth={3} />
        </motion.div>
        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="font-display font-black text-4xl text-white mb-3">
          Payment Successful!
        </motion.h2>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-white/40 mb-2">
          Your order has been confirmed and is being prepared.
        </motion.p>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-white/20 text-xs font-mono mb-8">
          Payment ID: {paymentId}
        </motion.p>
        <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
          onClick={onBack}
          className="px-10 py-4 rounded-full font-bold text-black"
          style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}>
          Continue Shopping
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Main CheckoutPage ── */
export default function CheckoutPage({ onBack, cartItems, total }) {
  const [paymentId, setPaymentId] = useState(null);

  if (paymentId) return <PaymentSuccess paymentId={paymentId} onBack={onBack} />;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #000000 0%, #050510 50%, #000000 100%)' }}>
      {/* Background orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(155,89,255,0.06) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-10">
        {/* Header */}
        <motion.div className="flex items-center gap-6 mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Cart</span>
          </button>
          <div className="h-5 w-[1px] bg-white/10" />
          <div className="flex items-center gap-3">
            <FiCreditCard style={{ color: 'var(--neon-blue)' }} />
            <h1 className="font-display font-black text-2xl tracking-tight text-white">Secure Checkout</h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Payment Form */}
          <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
              <h2 className="font-display font-black text-lg text-white mb-6 flex items-center gap-2">
                <FiCreditCard style={{ color: 'var(--neon-blue)' }} /> Payment Details
              </h2>
              <Elements stripe={stripePromise}>
                <PaymentForm total={total} onSuccess={setPaymentId} onBack={onBack} />
              </Elements>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="rounded-2xl p-6 sticky top-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)' }}>
              <h2 className="font-display font-black text-lg text-white mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                {cartItems.map(item => (
                  <div key={item._itemId} className="flex items-center gap-3 py-2 border-b border-white/05">
                    <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: item.color + '22', border: `1px solid ${item.color}44` }}>
                      <div className="w-4 h-4 rounded-full" style={{ background: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{item.name}</p>
                      <p className="text-xs text-white/40">{item.size} · Qty {item.qty}</p>
                    </div>
                    <p className="text-sm font-bold" style={{ color: 'var(--neon-blue)' }}>
                      ${(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Items ({cartItems.reduce((s,i) => s + i.qty, 0)})</span>
                  <span className="text-white">${cartItems.reduce((s,i) => s + i.price * i.qty, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Shipping</span>
                  <span style={{ color: 'var(--neon-cyan)' }}>FREE</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-black font-display text-2xl" style={{ color: 'var(--neon-blue)' }}>
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Accepted cards */}
              <div className="mt-5 pt-4 border-t border-white/08">
                <p className="text-xs text-white/20 mb-2 text-center">Accepted payment methods</p>
                <div className="flex items-center justify-center gap-3">
                  {['VISA', 'MC', 'AMEX', 'DISCOVER'].map(c => (
                    <span key={c} className="text-[10px] text-white/30 font-mono px-2 py-1 rounded"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
