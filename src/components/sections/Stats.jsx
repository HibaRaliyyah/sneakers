import { motion } from 'framer-motion';
import AnimatedCounter from '../ui/AnimatedCounter';

const STATS = [
  { target: 1000000, suffix: '+', label: 'Customers',   description: 'Worldwide athletes trust VOIDSTEP' },
  { target: 100,     suffix: '+', label: 'Countries',   description: 'Global presence across every continent' },
  { target: 50,      suffix: '+', label: 'Awards',      description: 'Design and innovation accolades' },
  { target: 98,      suffix: '%', label: 'Satisfaction', description: 'Based on verified customer reviews' },
];

/**
 * Stats section with animated count-up numbers.
 */
export default function Stats() {
  return (
    <section className="relative py-28 px-6 md:px-12 overflow-hidden" style={{ background: '#000000' }}>
      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] opacity-30"
        style={{ background: 'linear-gradient(90deg, transparent, var(--neon-blue), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Background text watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        style={{ opacity: 0.025 }}
      >
        <span className="font-display font-black text-[20vw] text-white tracking-tight">
          VOID
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label mb-4">BY THE NUMBERS</p>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-[-0.03em]">
            The <span className="gradient-text">Standard</span> We Set
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            >
              {/* Number */}
              <div
                className="font-display font-black text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight py-2 pr-1 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #ffffff, var(--neon-blue))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  duration={2.5}
                />
              </div>

              {/* Label */}
              <p className="font-display font-bold text-lg text-white mb-2">{stat.label}</p>
              <p className="text-xs text-white/30 leading-relaxed">{stat.description}</p>

              {/* Bottom accent line */}
              <div
                className="mt-5 h-[1px] mx-auto w-0 group-hover:w-full transition-all duration-500"
                style={{ background: 'var(--neon-blue)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
