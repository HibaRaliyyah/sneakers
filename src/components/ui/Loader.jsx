import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Cinematic page loader with logo reveal animation.
 */
export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 600);
          }, 300);
          return 100;
        }
        // Ease-out-like increments
        const remaining = 100 - prev;
        return prev + Math.max(0.5, remaining * 0.06);
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h1
              className="loader-text text-6xl md:text-8xl gradient-text tracking-[-0.04em]"
            >
              VOID<span style={{ color: 'var(--neon-blue)' }}>STEP</span>
            </h1>
            <p className="section-label mt-3 opacity-60">
              engineered for tomorrow
            </p>
          </motion.div>

          {/* Progress bar container */}
          <div className="w-64 md:w-96">
            <div className="h-[1px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-cyan))',
                  boxShadow: '0 0 10px var(--neon-blue)',
                }}
              />
            </div>
            <div className="flex justify-between mt-3 text-xs font-mono text-white/40">
              <span>INITIALIZING</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
