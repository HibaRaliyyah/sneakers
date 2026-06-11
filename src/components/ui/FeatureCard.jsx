import { motion } from 'framer-motion';

/**
 * Animated feature card with icon and scroll reveal.
 */
export default function FeatureCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      className="glass rounded-2xl p-8 group relative overflow-hidden"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ borderColor: 'rgba(0,212,255,0.3)', y: -4 }}
    >
      {/* Animated glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(0,212,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Icon */}
      <div className="mb-6 relative">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
          style={{
            background: 'rgba(0,212,255,0.1)',
            border: '1px solid rgba(0,212,255,0.2)',
          }}
        >
          <Icon />
        </div>
        <div
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full opacity-30 group-hover:opacity-70 transition-opacity"
          style={{ background: 'var(--neon-blue)', filter: 'blur(12px)' }}
        />
      </div>

      <h3 className="font-display font-bold text-xl text-white mb-3">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{description}</p>

      {/* Bottom border accent */}
      <div
        className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500"
        style={{ background: 'linear-gradient(90deg, var(--neon-blue), transparent)' }}
      />
    </motion.div>
  );
}
