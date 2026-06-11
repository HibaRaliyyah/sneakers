import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import gsap from 'gsap';
import HeroCanvas from '../three/HeroCanvas';
import MagneticButton from '../ui/MagneticButton';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

/**
 * Full-screen hero section with 3D shoe, animated headline, CTA buttons.
 */
export default function Hero({ onShopNow, onExplore }) {
  const headlineRef = useRef(null);
  const contentRef = useRef(null);

  // Character-by-character reveal with GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-char', {
        y: 80,
        opacity: 0,
        skewY: 6,
        stagger: 0.035,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5,
      });

      gsap.from('.hero-sub', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.4,
      });

      gsap.from('.hero-scroll-hint', {
        opacity: 0,
        duration: 0.8,
        delay: 2.4,
      });
    });

    return () => ctx.revert();
  }, []);

  const headline = 'Step Into The Future';

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center overflow-hidden"
    >
      {/* 3D Canvas */}
      <div className="canvas-container">
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[3]"
        style={{ background: 'linear-gradient(to bottom, transparent, #000)' }}
      />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-4xl pt-32" ref={contentRef}>
        {/* Label */}
        <div className="hero-sub flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px]" style={{ background: 'var(--neon-blue)' }} />
          <span className="section-label">NEW COLLECTION 2026</span>
        </div>

        {/* Animated headline */}
        <h1
          ref={headlineRef}
          className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-none tracking-[-0.03em] mb-6 overflow-hidden"
        >
          {headline.split('').map((char, i) => (
            <span
              key={i}
              className="hero-char inline-block"
              style={{
                color: char === ' ' ? 'transparent' : 'white',
                minWidth: char === ' ' ? '0.4em' : undefined,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Sub-headline */}
        <p className="hero-sub text-lg md:text-xl text-white/60 max-w-md leading-relaxed mb-10">
          Where precision engineering meets limitless ambition. 
          Experience footwear that defies physics.
        </p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8, ease: 'easeOut' }}
        >
          <div className="hero-cta">
            <MagneticButton
              className="px-8 py-4 rounded-full font-semibold text-black flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}
              onClick={onShopNow}
            >
              Shop Now <FiArrowRight />
            </MagneticButton>
          </div>

          <div className="hero-cta">
            <MagneticButton
              className="px-8 py-4 rounded-full font-semibold text-white flex items-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
              onClick={onExplore}
            >
              <FiPlay size={14} /> Explore Collection
            </MagneticButton>
          </div>
        </motion.div>

        {/* Stats bar */}
        <div className="hero-sub flex gap-10 mt-14 pt-8 border-t border-white/10">
          {[['1M+', 'Customers'], ['100+', 'Countries'], ['98%', 'Satisfaction']].map(
            ([num, label]) => (
              <div key={label}>
                <p className="font-display font-bold text-xl text-white">{num}</p>
                <p className="text-xs text-white/40">{label}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="section-label text-[9px] opacity-40">SCROLL</span>
        <motion.div
          className="w-[1px] h-12 origin-top"
          style={{ background: 'linear-gradient(to bottom, var(--neon-blue), transparent)' }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  );
}
