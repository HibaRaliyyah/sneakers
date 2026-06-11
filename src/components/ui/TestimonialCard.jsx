import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

/**
 * Glassmorphism testimonial card.
 */
export default function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      className="glass-strong rounded-2xl p-8 flex-shrink-0 w-80 md:w-96"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className="w-4 h-4 fill-current"
            style={{ color: i < testimonial.rating ? 'var(--neon-blue)' : 'rgba(255,255,255,0.2)' }}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-white/80 leading-relaxed mb-6 text-sm md:text-base">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-display font-bold text-lg"
          style={{
            background: `linear-gradient(135deg, ${testimonial.color}33, ${testimonial.color}66)`,
            border: `1px solid ${testimonial.color}44`,
            color: testimonial.color,
          }}
        >
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs text-white/40">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}
