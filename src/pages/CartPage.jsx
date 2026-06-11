import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag, FiLock, FiPackage } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../api/index.js';

export default function CartPage({ onBack, onCheckout }) {
  const { cartItems, cartLoading, updateQty, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [promoCode, setPromoCode]     = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError]   = useState('');

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.15) : 0;
  const shipping  = subtotal > 300 ? 0 : 25;
  const total     = subtotal - discount + shipping;

  const applyPromo = () => { if (promoCode.toUpperCase() === 'VOID15') setPromoApplied(true); };

  const handleCheckout = () => {
    onCheckout?.();
  };

  if (orderPlaced) return <OrderSuccess onBack={onBack} />;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #000000 0%, #050510 50%, #000000 100%)' }}>
      <div className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(155,89,255,0.06) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
        <motion.div className="flex items-center gap-6 mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </button>
          <div className="h-5 w-[1px] bg-white/10" />
          <div className="flex items-center gap-3">
            <FiShoppingBag style={{ color: 'var(--neon-blue)' }} />
            <h1 className="font-display font-black text-2xl tracking-tight text-white">Your Cart</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'var(--neon-blue)', color: '#000' }}>
              {cartItems.length}
            </span>
          </div>
          {!user && (
            <span className="ml-auto text-xs text-white/30 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              Guest cart — <span style={{ color: 'var(--neon-blue)' }}>sign in</span> to save
            </span>
          )}
        </motion.div>

        {cartLoading ? <CartSkeleton /> : cartItems.length === 0 ? <EmptyCart onBack={onBack} /> : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, i) => (
                  <motion.div key={item._itemId} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.35, delay: i * 0.05 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
                    <div className="flex gap-5 p-5">
                      <div className="w-28 h-28 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.4)' }}>
                        <svg viewBox="0 0 120 70" className="w-20 h-20">
                          <defs><filter id={`g-${item._itemId}`}><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                          <ellipse cx="58" cy="60" rx="50" ry="7" fill="#0a0a15" />
                          <ellipse cx="58" cy="55" rx="48" ry="5" fill={item.color} opacity="0.8" filter={`url(#g-${item._itemId})`} />
                          <path d="M15,50 Q12,38 20,30 Q30,22 50,20 Q68,19 80,22 Q95,25 105,35 Q110,42 108,50 Z" fill="#0d0d1a" />
                          <path d="M30,38 Q55,33 80,36" stroke={item.color} strokeWidth="2.5" fill="none" filter={`url(#g-${item._itemId})`} />
                          {[0,1,2,3].map(j => <line key={j} x1={46+j*7} y1="22" x2={46+j*7} y2="38" stroke={item.color} strokeWidth="1" opacity="0.6" />)}
                        </svg>
                        {item.badge && <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: item.color, color: '#000' }}>{item.badge}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="section-label text-[10px] mb-1">{item.category}</p>
                            <h3 className="font-display font-black text-lg text-white tracking-tight">{item.name}</h3>
                          </div>
                          <button onClick={() => removeItem(item._itemId)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3 mb-4">
                          <span className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
                            <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: item.color }} />
                            {item.colorName}
                          </span>
                          <span className="text-xs text-white/40 font-mono">{item.size}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <button onClick={() => updateQty(item._itemId, item.qty - 1)} className="w-5 h-5 flex items-center justify-center text-white/50 hover:text-white"><FiMinus size={12} /></button>
                            <span className="text-sm font-bold text-white w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item._itemId, item.qty + 1)} className="w-5 h-5 flex items-center justify-center hover:text-white" style={{ color: 'var(--neon-blue)' }}><FiPlus size={12} /></button>
                          </div>
                          <p className="font-display font-black text-xl" style={{ color: 'var(--neon-blue)' }}>${(item.price * item.qty).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs text-white/40 font-mono mb-3">PROMO CODE</p>
                <div className="flex gap-3">
                  <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="e.g. VOID15"
                    className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 font-mono tracking-widest" />
                  <button onClick={applyPromo} disabled={promoApplied} className="px-5 py-3 rounded-xl text-sm font-bold transition-all"
                    style={{ background: promoApplied ? 'rgba(0,255,100,0.15)' : 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))', color: promoApplied ? '#00ff64' : '#000', border: promoApplied ? '1px solid rgba(0,255,100,0.3)' : 'none' }}>
                    {promoApplied ? '✓ Applied' : 'Apply'}
                  </button>
                </div>
                {promoApplied && <p className="text-xs mt-2" style={{ color: '#00ff64' }}>🎉 15% discount applied!</p>}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-1">
              <div className="rounded-2xl p-6 sticky top-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)' }}>
                <h2 className="font-display font-black text-lg text-white mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <SummaryRow label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
                  {promoApplied && <SummaryRow label="Discount (15%)" value={`-$${discount}`} valueColor="#00ff64" />}
                  <SummaryRow label="Shipping" value={shipping === 0 ? 'FREE' : `$${shipping}`} valueColor={shipping === 0 ? '#00ffcc' : undefined} />
                  <div className="border-t border-white/10 pt-4"><SummaryRow label="Total" value={`$${total.toLocaleString()}`} large /></div>
                </div>
                {shipping > 0 && (
                  <div className="rounded-xl p-3 mb-5 text-xs" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
                    <span style={{ color: 'var(--neon-blue)' }}>Add ${300 - subtotal} more</span>
                    <span className="text-white/40"> for free shipping</span>
                  </div>
                )}
                {orderError && (
                  <div className="mb-4 p-3 rounded-xl text-xs text-red-400" style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.2)' }}>
                    ⚠️ {orderError}
                  </div>
                )}
                <button onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}>
                  <FiLock size={14} />{user ? 'Proceed to Payment' : 'Sign In to Checkout'}
                </button>
                <div className="mt-4 flex items-center justify-center gap-4">
                  {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(c => <span key={c} className="text-[10px] text-white/20 font-mono">{c}</span>)}
                </div>
                <p className="text-center text-[11px] text-white/20 mt-4">🔒 256-bit SSL encrypted checkout</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, large, valueColor }) {
  return (
    <div className="flex justify-between items-center">
      <span className={large ? 'text-white font-bold' : 'text-white/40 text-sm'}>{label}</span>
      <span className={large ? 'font-black font-display text-xl' : 'font-semibold text-sm'} style={{ color: valueColor || (large ? 'var(--neon-blue)' : 'white') }}>{value}</span>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex gap-5">
              <div className="w-28 h-28 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="flex-1 space-y-3 pt-2">
                <div className="h-3 w-20 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="h-5 w-40 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderSuccess({ onBack }) {
  return (
    <motion.div className="min-h-screen flex items-center justify-center" style={{ background: '#000010' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #00ff80, #00ffcc)' }}>
          <FiPackage size={40} color="#000" />
        </motion.div>
        <h2 className="font-display font-black text-4xl text-white mb-3">Order Placed! 🎉</h2>
        <p className="text-white/40 mb-2">Your sneakers are on their way.</p>
        <p className="text-white/20 text-sm mb-8">You'll receive a confirmation shortly.</p>
        <button onClick={onBack} className="px-10 py-4 rounded-full font-bold text-black" style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}>
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );
}

function EmptyCart({ onBack }) {
  return (
    <motion.div className="text-center py-32" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-8xl mb-6">👟</div>
      <h2 className="font-display font-black text-3xl text-white mb-3">Your cart is empty</h2>
      <p className="text-white/40 mb-8">Add some futuristic kicks to get started.</p>
      <button onClick={onBack} className="px-8 py-4 rounded-full font-bold text-black" style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}>
        Explore Collection
      </button>
    </motion.div>
  );
}
