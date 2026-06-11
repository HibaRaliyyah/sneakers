import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import brandStoryImg from '../../assets/brand_story.png';

const TIMELINE = [
  { year: '2018', event: 'Founded in a Tokyo garage. One prototype. Zero compromises.' },
  { year: '2020', event: 'VOID X1 drops. 10,000 pairs sell out in 4 minutes.' },
  { year: '2022', event: 'Partnership with MIT Materials Lab. Smart cushioning born.' },
  { year: '2024', event: '50 design awards. Operations in 100+ countries.' },
  { year: '2026', event: 'The next chapter. You\'re already part of it.' },
];

/**
 * Brand story section: split-screen with scroll-driven image reveal and timeline.
 */
export default function BrandStory() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  const imageScale    = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);
  const imageOpacity  = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const clipProgress  = useTransform(scrollYProgress, [0.05, 0.4], [0, 100]);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative py-0 overflow-hidden"
      style={{ background: '#000' }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* LEFT: Text + Timeline */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-24 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="section-label mb-6">OUR STORY</p>
            <h2 className="font-display font-black text-5xl md:text-6xl tracking-[-0.03em] leading-none mb-8">
              Born in<br />
              <span className="gradient-text">Obsession</span>
            </h2>
            <p className="text-white/50 leading-relaxed mb-12 max-w-sm">
              VOIDSTEP didn't start in a boardroom. It started with a single question: 
              <em className="text-white/70"> what if a shoe had no limits?</em>
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative pl-6">
            {/* Vertical line */}
            <motion.div
              className="absolute left-0 top-0 w-[1px] origin-top"
              style={{ background: 'linear-gradient(to bottom, var(--neon-blue), transparent)', height: '100%' }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                >
                  {/* Dot */}
                  <div
                    className="absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2"
                    style={{
                      borderColor: 'var(--neon-blue)',
                      background: i === TIMELINE.length - 1 ? 'var(--neon-blue)' : '#000',
                      boxShadow: i === TIMELINE.length - 1 ? '0 0 10px var(--neon-blue)' : 'none',
                    }}
                  />
                  <div className="flex items-start gap-4">
                    <span className="section-label text-[10px] flex-shrink-0 mt-0.5">{item.year}</span>
                    <p className="text-sm text-white/60 leading-relaxed">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Scroll-animated image */}
        <div className="relative h-[60vh] lg:h-auto order-1 lg:order-2 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ scale: imageScale, opacity: imageOpacity }}
          >
            <img
              src={brandStoryImg}
              alt="VOIDSTEP Brand Story"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Image overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, #000 0%, transparent 40%), linear-gradient(to bottom, transparent 60%, #000 100%)' }}
          />

          {/* Floating badge */}
          <motion.div
            className="absolute bottom-12 right-8 glass rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="section-label text-[10px] mb-1">DESIGN AWARDS</p>
            <p className="font-display font-black text-4xl neon-text-blue">50+</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
