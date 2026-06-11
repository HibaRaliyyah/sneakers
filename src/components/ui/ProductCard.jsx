import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

/**
 * 3D-tilt product card with glassmorphism, hover animations, and Quick View.
 */
export default function ProductCard({ product, index, onAddToCart }) {
  const { cartItems, updateQty, removeItem, addToCart } = useCart();
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const cartItem = cartItems.find(i => i.id === (product._id || product.id));

  const handleAdd = () => {
    if (cartItem) {
      updateQty(cartItem._itemId, cartItem.qty + 1);
    } else {
      if (onAddToCart) onAddToCart(product);
      else addToCart(product);
    }
  };

  const handleMinus = () => {
    if (cartItem) {
      if (cartItem.qty > 1) {
        updateQty(cartItem._itemId, cartItem.qty - 1);
      } else {
        removeItem(cartItem._itemId);
      }
    }
  };

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 20;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        className="tilt-card relative rounded-2xl overflow-hidden cursor-pointer"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          background: 'rgba(255,255,255,0.04)',
          border: hovered ? '1px solid rgba(0,212,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: hovered
            ? '0 0 40px rgba(0,212,255,0.15), 0 30px 60px rgba(0,0,0,0.6)'
            : '0 20px 40px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px)',
          transition: 'border 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="section-label text-[10px] px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ transform: `scale(${hovered ? 1.08 : 1})`, transition: 'transform 0.5s ease' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="section-label text-[10px] mb-1 opacity-60">{product.category}</p>
              <h3 className="font-display font-bold text-xl text-white">{product.name}</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display font-bold neon-text-blue">${product.price}</p>
            </div>
          </div>

          <p className="text-sm text-white/50 leading-relaxed mb-5">{product.description}</p>

          {/* Color swatches */}
          <div className="flex gap-2 mb-5">
            {product.colors.map((color, i) => (
              <div key={i} className="w-5 h-5 rounded-full border border-white/20 cursor-pointer hover:scale-125 transition-transform"
                style={{ background: color }} />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-black transition-all"
              style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}
              onClick={() => setShowQuickView(true)}
            >
              Quick View
            </button>
            {cartItem ? (
              <div className="flex items-center gap-2 px-2 py-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <button onClick={(e) => { e.stopPropagation(); handleMinus(); }} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white"><FiMinus size={14} /></button>
                <span className="text-sm font-bold w-4 text-center">{cartItem.qty}</span>
                <button onClick={(e) => { e.stopPropagation(); handleAdd(); }} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white" style={{ color: 'var(--neon-blue)' }}><FiPlus size={14} /></button>
              </div>
            ) : (
              <button
                className="px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                }}
                onClick={(e) => { e.stopPropagation(); handleAdd(); }}
              >
                + Cart
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      {showQuickView && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowQuickView(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div
            className="relative glass-strong rounded-3xl p-8 max-w-lg w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl"
              onClick={() => setShowQuickView(false)}
            >✕</button>
            <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded-xl mb-6" />
            <h2 className="font-display text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-white/50 text-sm mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-display font-bold neon-text-blue">${product.price}</span>
              {cartItem ? (
                <div className="flex items-center gap-4 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleMinus(); }} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white"><FiMinus size={16} /></button>
                  <span className="text-lg font-bold w-6 text-center">{cartItem.qty}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleAdd(); }} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white" style={{ color: 'var(--neon-blue)' }}><FiPlus size={16} /></button>
                </div>
              ) : (
                <button
                  className="px-6 py-3 rounded-xl font-semibold text-black"
                  style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}
                  onClick={(e) => { e.stopPropagation(); handleAdd(); }}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
