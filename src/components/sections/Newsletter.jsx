import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowRight, FiCheck } from 'react-icons/fi';

/**
 * Newsletter subscription section with floating orbs and success animation.
 */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section className="relative py-32 px-6 md:px-12 overflow-hidden" style={{ background: '#000' }}>
      {/* Floating orbs */}
      {[
        { size: 400, color: 'var(--neon-blue)', x: '-10%', y: '20%', delay: 0     },
        { size: 300, color: 'var(--neon-purple)', x: '80%', y: '60%', delay: 1    },
        { size: 200, color: 'var(--neon-cyan)',  x: '50%', y: '-10%', delay: 0.5  },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}22, transparent)`,
            left: orb.x,
            top: orb.y,
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
        />
      ))}

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              <FiMail className="text-neon-blue" size={28} style={{ color: 'var(--neon-blue)' }} />
            </div>
          </div>

          <p className="section-label mb-4">STAY AHEAD</p>
          <h2 className="font-display font-black text-5xl md:text-6xl tracking-[-0.03em] mb-4">
            First to the <span className="gradient-text">Future</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto mb-12">
            Get early access to new drops, exclusive colorways, and behind-the-scenes content.
            No noise. Only signal.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <AnimatePresence mode="wait">
            {status !== 'success' ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-6 py-4 rounded-full text-sm text-white placeholder:text-white/30 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(0,212,255,0.4)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 rounded-full font-semibold text-black text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                  style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}
                >
                  {status === 'loading' ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>Join <FiArrowRight size={14} /></>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,255,204,0.15)', border: '2px solid var(--neon-cyan)' }}
                >
                  <FiCheck size={32} style={{ color: 'var(--neon-cyan)' }} />
                </div>
                <p className="font-display font-bold text-2xl text-white">You're in.</p>
                <p className="text-white/50 text-sm">Welcome to the future. Check your inbox.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-xs text-white/25">
            No spam, ever. Unsubscribe in one click.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
