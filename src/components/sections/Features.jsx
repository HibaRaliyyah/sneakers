import { motion } from 'framer-motion';
import FeatureCard from '../ui/FeatureCard';
import { TbFeather, TbHeartbeat, TbLayersIntersect, TbLeaf } from 'react-icons/tb';

const FEATURES = [
  {
    icon: TbFeather,
    title: 'Lightweight Design',
    description: 'Engineered with aerospace-derived materials. Under 180g per shoe. Feel nothing, perform everything.',
  },
  {
    icon: TbHeartbeat,
    title: 'Premium Comfort',
    description: 'Bio-adaptive foam conforms to your unique foot shape within 72 hours. Personalized support, always.',
  },
  {
    icon: TbLayersIntersect,
    title: 'Smart Cushioning',
    description: 'Responsive energy return system captures ground impact and converts it to forward propulsion.',
  },
  {
    icon: TbLeaf,
    title: 'Sustainable Materials',
    description: '83% recycled ocean plastics. Carbon-neutral manufacturing. Luxury that doesn\'t cost the Earth.',
  },
];

/**
 * Features section with animated viewport-triggered cards.
 */
export default function Features() {
  return (
    <section id="features" className="relative py-32 px-6 md:px-12" style={{ background: '#030305' }}>
      {/* Glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-20"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.3) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-label mb-4">WHY VOIDSTEP</p>
          <h2 className="font-display font-black text-5xl md:text-6xl tracking-[-0.03em] mb-4">
            Built <span className="gradient-text">Different</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto">
            Four core obsessions drive every design decision we make.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>

        {/* Bottom divider line */}
        <motion.div
          className="mt-24 h-[1px] max-w-2xl mx-auto"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </section>
  );
}
