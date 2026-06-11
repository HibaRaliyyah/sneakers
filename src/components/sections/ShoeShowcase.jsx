import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../ui/ProductCard';
import shoeX1   from '../../assets/shoe_x1.png';
import shoeApex from '../../assets/shoe_apex.png';
import shoeLunar from '../../assets/shoe_lunar.png';

const PRODUCTS = [
  {
    name: 'VOID X1',
    category: 'Signature Series',
    price: 349,
    description: 'Our flagship model. Engineered with aerospace-grade materials and adaptive cushioning technology.',
    badge: 'BESTSELLER',
    image: shoeX1,
    colors: ['#00d4ff', '#ffffff', '#1a1a2e'],
  },
  {
    name: 'APEX RUNNER',
    category: 'Performance Line',
    price: 289,
    description: 'Built for the relentless. Carbon fiber plate meets bio-adaptive foam for peak performance.',
    badge: 'NEW DROP',
    image: shoeApex,
    colors: ['#ff4444', '#111111', '#ff6600'],
  },
  {
    name: 'LUNAR DRIFT',
    category: 'Luxury Edition',
    price: 449,
    description: 'Where luxury meets function. Premium materials, translucent sole, and artisan craftsmanship.',
    badge: 'LIMITED',
    image: shoeLunar,
    colors: ['#e0c080', '#ffffff', '#9b59ff'],
  },
];

/**
 * Featured shoe showcase — 3 product cards with 3D tilt.
 */
export default function ShoeShowcase({ onViewAll, onAddToCart }) {
  const [displayProducts, setDisplayProducts] = useState(PRODUCTS);

  useEffect(() => {
    import('../../api/index.js').then(({ apiFetch }) => {
      apiFetch('/api/products')
        .then(({ products }) => {
          if (products) {
            setDisplayProducts(PRODUCTS.map(p => {
              const dbProd = products.find(d => d.name === p.name);
              return dbProd ? { ...p, _id: dbProd._id } : p;
            }));
          }
        })
        .catch(console.error);
    });
  }, []);

  return (
    <section id="showcase" className="relative py-32 px-6 md:px-12 bg-void">
      {/* Background grid lines */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Glow orbs */}
      <div className="glow-orb w-96 h-96 bg-neon-blue/10 -top-20 -left-20 opacity-30" />
      <div className="glow-orb w-80 h-80 bg-purple-500/10 top-1/2 -right-20 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-label mb-4">FEATURED COLLECTION</p>
          <h2 className="font-display font-black text-5xl md:text-6xl tracking-[-0.03em] text-white mb-4">
            Define Your <span className="gradient-text">Era</span>
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            Three silhouettes. Infinite possibilities. Each designed to make the future feel inevitable.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} onAddToCart={onAddToCart} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onViewAll}
            className="px-10 py-4 rounded-full font-semibold text-sm border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            View Full Collection →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
