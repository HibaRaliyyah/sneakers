import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import TestimonialCard from '../ui/TestimonialCard';

const TESTIMONIALS = [
  {
    name: 'Marcus Chen',
    role: 'Professional Sprinter',
    quote: 'I\'ve worn every major brand on the market. VOIDSTEP doesn\'t just compete — it rewrites what a performance shoe can be. The energy return is unlike anything I\'ve felt.',
    rating: 5,
    color: '#00d4ff',
  },
  {
    name: 'Aisha Okonkwo',
    role: 'Fashion Director, APEX Magazine',
    quote: 'The LUNAR DRIFT has become my statement piece. It\'s not just footwear — it\'s sculpture. I\'ve had more compliments on these shoes than anything in my wardrobe.',
    rating: 5,
    color: '#9b59ff',
  },
  {
    name: 'Jordan Reeves',
    role: 'Ultra-Marathon Runner',
    quote: 'Completed a 100-mile race in the APEX RUNNER. No blisters. No fatigue. My second pair arrives next week. This is the only shoe I will ever trust my feet to.',
    rating: 5,
    color: '#ff0099',
  },
  {
    name: 'Sofia Marchetti',
    role: 'Head of Design, Luxoria Studio',
    quote: 'As a designer, I appreciate obsession with detail. VOIDSTEP exhibits the kind of design discipline I associate with Dieter Rams. Functional, beautiful, inevitable.',
    rating: 5,
    color: '#00ffcc',
  },
];

/**
 * Auto-playing testimonials carousel with glassmorphism cards.
 */
export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDir(1);
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const go = (direction) => {
    setDir(direction);
    setCurrent((prev) => (prev + direction + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const variants = {
    enter:  (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section className="relative py-32 px-6 md:px-12 overflow-hidden" style={{ background: '#050508' }}>
      {/* Background bokeh orbs */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-10"
          style={{
            width: `${200 + i * 80}px`,
            height: `${200 + i * 80}px`,
            background: `radial-gradient(circle, ${['#00d4ff', '#9b59ff', '#ff0099'][i]}, transparent)`,
            left: `${[10, 50, 80][i]}%`,
            top: `${[20, 60, 30][i]}%`,
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-label mb-4">TESTIMONIALS</p>
          <h2 className="font-display font-black text-5xl md:text-6xl tracking-[-0.03em]">
            Voices of the <span className="gradient-text">Future</span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative flex flex-col items-center">
          <div className="w-full max-w-2xl overflow-hidden">
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={current}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full"
              >
                <TestimonialCard testimonial={TESTIMONIALS[current]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-10">
            <button
              onClick={() => go(-1)}
              className="w-12 h-12 glass rounded-full flex items-center justify-center hover:border-neon-blue/40 transition-all"
            >
              <FiChevronLeft />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? '32px' : '8px',
                    background: i === current ? 'var(--neon-blue)' : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="w-12 h-12 glass rounded-full flex items-center justify-center hover:border-neon-blue/40 transition-all"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
