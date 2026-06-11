import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiSearch, FiFilter, FiShoppingBag, FiHeart, FiX, FiCheck, FiLoader, FiMinus, FiPlus } from 'react-icons/fi';
import { apiFetch } from '../api/index.js';
import { useCart } from '../context/CartContext.jsx';

const CATEGORIES  = ['All', 'Signature', 'Performance', 'Luxury', 'Lifestyle'];
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'];

function ShoeCard({ product, onAddToCart }) {
  const { cartItems, updateQty, removeItem, addToCart } = useCart();
  const [liked, setLiked]     = useState(false);
  const [hovering, setHovering] = useState(false);

  const cartItem = cartItems.find(i => i.id === (product._id || product.id));

  const handleAdd = (e) => {
    e.stopPropagation();
    if (cartItem) {
      updateQty(cartItem._itemId, cartItem.qty + 1);
    } else {
      if (onAddToCart) onAddToCart(product);
      else addToCart(product);
    }
  };

  const handleMinus = (e) => {
    e.stopPropagation();
    if (cartItem) {
      if (cartItem.qty > 1) {
        updateQty(cartItem._itemId, cartItem.qty - 1);
      } else {
        removeItem(cartItem._itemId);
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.35 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovering ? `${product.color}40` : 'rgba(255,255,255,0.07)'}`,
        transition: 'border-color 0.3s',
      }}
    >
      {/* Image area */}
      <div
        className="relative h-52 flex items-center justify-center overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.5)' }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hovering ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: `radial-gradient(circle at 50% 80%, ${product.color}20 0%, transparent 70%)` }}
        />

        <motion.div
          animate={{ y: hovering ? -8 : 0, scale: hovering ? 1.08 : 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ShoeSVG color={product.color} size={160} />
        </motion.div>

        {product.badge && (
          <span
            className="absolute top-3 left-3 px-2 py-1 text-[10px] font-black rounded-lg tracking-wider"
            style={{ background: product.color, color: '#000' }}
          >
            {product.badge}
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 p-2 rounded-xl transition-all"
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: `1px solid ${liked ? product.color : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          <FiHeart
            size={14}
            fill={liked ? product.color : 'none'}
            style={{ color: liked ? product.color : 'rgba(255,255,255,0.4)' }}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="section-label text-[10px] mb-1.5">{product.category}</p>
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display font-black text-base text-white tracking-tight">{product.name}</h3>
          <span className="font-display font-black text-lg" style={{ color: product.color }}>
            ${product.price}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-yellow-400 text-xs">{'★'.repeat(Math.round(product.rating || 4))}</span>
          <span className="text-white/30 text-[10px]">({product.reviewCount || 0})</span>
        </div>

        {/* Color dot */}
        <div className="flex gap-1.5 mb-4">
          {[product.color, '#ffffff', '#0a0a15'].map((c, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-full border border-white/15"
              style={{ background: c, boxShadow: i === 0 ? `0 0 6px ${c}80` : 'none' }}
            />
          ))}
        </div>

        {cartItem ? (
          <div className="w-full py-2 rounded-xl flex items-center justify-between px-4 transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
            <button onClick={handleMinus} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white"><FiMinus size={14} /></button>
            <span className="text-sm font-bold w-4 text-center">{cartItem.qty}</span>
            <button onClick={handleAdd} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white" style={{ color: 'var(--neon-blue)' }}><FiPlus size={14} /></button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))',
              color: '#000',
            }}
          >
            <FiShoppingBag size={13} /> Add to Cart
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ShoeSVG({ color, size = 140 }) {
  const id = `glow-coll-${color.replace('#', '')}`;
  const s = size;
  return (
    <svg width={s} height={s * 0.65} viewBox="0 0 160 100">
      <defs>
        <filter id={id}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id={`body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#080812" />
        </linearGradient>
      </defs>
      <ellipse cx="82" cy="96" rx="62" ry="5" fill="rgba(0,0,0,0.4)" />
      <path d="M22,82 Q18,74 25,68 L138,68 Q148,68 150,76 Q150,84 140,86 L30,86 Q22,86 22,82 Z" fill="#050510" />
      <path d="M24,74 Q20,68 27,63 L136,63 Q146,63 148,70 Q148,76 140,78 L30,78 Q24,78 24,74 Z" fill={color} opacity="0.85" filter={`url(#${id})`} />
      <path d="M28,74 Q22,58 30,42 Q42,28 68,24 Q90,20 112,26 Q130,31 142,45 Q150,56 148,68 L24,68 Z" fill={`url(#body-${id})`} />
      <path d="M118,30 Q140,32 148,50 Q150,60 148,68 L118,68 Z" fill="#080812" />
      <path d="M28,74 Q22,58 30,42 L46,42 L46,74 Z" fill="#0a0a18" />
      <path d="M74,24 Q88,22 92,24 L94,58 Q82,60 74,58 Z" fill="#0c0c1e" />
      <path d="M46,56 Q78,46 112,50 Q128,52 142,58" stroke={color} strokeWidth="3" fill="none" filter={`url(#${id})`} strokeLinecap="round" />
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={70+i*6} y1="26" x2={70+i*6} y2="54" stroke={color} strokeWidth="1.2" opacity="0.6" />
      ))}
      <rect x="26" y="46" width="5" height="14" rx="2.5" fill={color} filter={`url(#${id})`} />
      <path d="M46,42 Q60,36 74,36 Q88,36 94,42" stroke={color} strokeWidth="2" fill="none" filter={`url(#${id})`} strokeLinecap="round" />
    </svg>
  );
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="h-52" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="p-5 space-y-3">
        <div className="h-2 w-16 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="h-4 w-32 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="h-8 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
    </div>
  );
}

export default function CollectionPage({ onBack, onAddToCart }) {
  const { addToCart } = useCart();
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch]           = useState('');
  const [sort, setSort]               = useState('Featured');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice]       = useState(600);
  const [addedId, setAddedId]         = useState(null);

  // Fetch products from backend
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (search) params.set('search', search);
    if (maxPrice < 600) params.set('maxPrice', maxPrice);
    params.set('sort', sort);

    apiFetch(`/api/products?${params.toString()}`)
      .then(({ products }) => setProducts(products || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCategory, search, sort, maxPrice]);

  const handleAddToCart = (product) => {
    setAddedId(product._id);
    const handler = onAddToCart || addToCart;
    handler(product);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #000000 0%, #04040f 50%, #000000 100%)' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10"
          style={{ background: 'radial-gradient(ellipse, var(--neon-blue) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group mb-8"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="section-label mb-3">VOIDSTEP · {new Date().getFullYear()}</p>
              <h1 className="font-display font-black text-5xl md:text-6xl text-white tracking-tight leading-none">
                Full <span className="gradient-text">Collection</span>
              </h1>
              <p className="text-white/30 mt-3 text-sm">{products.length} styles available</p>
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl max-w-xs w-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <FiSearch size={15} className="text-white/30 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search styles..."
                className="bg-transparent text-sm text-white placeholder-white/20 outline-none flex-1"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-white/30 hover:text-white">
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: activeCategory === cat
                    ? 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))'
                    : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat ? '#000' : 'rgba(255,255,255,0.5)',
                  border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs text-white/50 border border-white/10 rounded-xl px-3 py-2 outline-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {SORT_OPTIONS.map((o) => <option key={o} value={o} style={{ background: '#0a0a15' }}>{o}</option>)}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all"
              style={{
                background: showFilters ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${showFilters ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: showFilters ? 'var(--neon-blue)' : 'rgba(255,255,255,0.5)',
              }}
            >
              <FiFilter size={12} /> Filters
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="section-label text-[10px]">MAX PRICE</span>
                  <span className="font-display font-bold text-sm" style={{ color: 'var(--neon-blue)' }}>${maxPrice}</span>
                </div>
                <input
                  type="range" min={150} max={600} step={10} value={maxPrice}
                  onChange={(e) => setMaxPrice(+e.target.value)}
                  className="w-full"
                  style={{ accentColor: 'var(--neon-blue)' }}
                />
                <div className="flex justify-between text-xs text-white/20 mt-1">
                  <span>$150</span><span>$600</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="text-center py-12 text-red-400">
            <p className="text-lg mb-2">⚠️ Failed to load products</p>
            <p className="text-sm text-white/30">{error}</p>
          </div>
        )}

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <div key={product._id} className="relative">
                  <ShoeCard product={product} onAddToCart={handleAddToCart} />
                  <AnimatePresence>
                    {addedId === product._id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none z-20"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
                      >
                        <span className="font-bold text-sm" style={{ color: 'var(--neon-cyan)' }}>✓ Added to Cart</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24 text-white/20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-display font-bold text-xl">No results found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
