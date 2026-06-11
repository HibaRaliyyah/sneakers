import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiClock, FiCheck, FiTruck } from 'react-icons/fi';
import { apiFetch } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#ffaa00', icon: FiClock },
  confirmed: { label: 'Confirmed', color: '#00d4ff', icon: FiCheck },
  shipped:   { label: 'Shipped',   color: '#9b59ff', icon: FiTruck },
  delivered: { label: 'Delivered', color: '#00ff80', icon: FiPackage },
  cancelled: { label: 'Cancelled', color: '#ff4444', icon: FiArrowLeft },
};

export default function OrdersPage({ onBack }) {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    apiFetch('/api/orders')
      .then(({ orders }) => setOrders(orders || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen" style={{ background: '#000010' }}>
      <div className="fixed inset-0 pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--neon-blue) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group mb-8">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </button>
          <p className="section-label mb-2">VOIDSTEP ACCOUNT</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight">
            My <span className="gradient-text">Orders</span>
          </h1>
        </motion.div>

        {!user && (
          <div className="text-center py-20 text-white/30">
            <FiPackage size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-bold text-white">Please sign in to view your orders</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl p-6 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between mb-4">
                  <div className="h-4 w-32 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="h-4 w-20 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
                </div>
                <div className="h-3 w-48 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-400 text-center py-10">⚠️ {error}</p>}

        {!loading && !error && user && orders.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <FiPackage size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-bold text-white mb-2">No orders yet</p>
            <p className="text-sm">Your order history will appear here after your first purchase.</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order, idx) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
            const Icon = cfg.icon;
            return (
              <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }} className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-white/30 font-mono mb-1">ORDER #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-white/20">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                      <Icon size={11} />
                      {cfg.label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, j) => (
                      <div key={j} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ background: item.color || '#00d4ff' }} />
                          <span className="text-white/80 font-medium">{item.name}</span>
                          <span className="text-white/30 text-xs">× {item.qty}</span>
                          {item.size && <span className="text-white/20 text-xs font-mono">{item.size}</span>}
                        </div>
                        <span className="text-white/50">${(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/05">
                    <div className="flex gap-4 text-xs text-white/30">
                      {order.discount > 0 && <span className="text-green-400">-${order.discount} saved</span>}
                      <span>{order.shipping === 0 ? 'Free shipping' : `$${order.shipping} shipping`}</span>
                    </div>
                    <p className="font-display font-black text-lg" style={{ color: 'var(--neon-blue)' }}>
                      ${order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
