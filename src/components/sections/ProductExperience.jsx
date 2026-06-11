import { Suspense } from 'react';
import { motion } from 'framer-motion';
import ProductCanvas from '../three/ProductCanvas';

/**
 * Interactive 3D product experience section.
 * Canvas is larger + shifted right to fill whitespace.
 */
export default function ProductExperience({ onConfigure }) {
  return (
    <section
      id="experience"
      className="relative py-0 overflow-hidden"
      style={{ background: '#050508' }}
    >
      {/* Full-width grid — text left, canvas fills the right 60% */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] min-h-screen">

        {/* Left: Text panel */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-24 z-10">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="section-label mb-6">3D EXPERIENCE</p>
            <h2 className="font-display font-black text-5xl md:text-6xl tracking-[-0.03em] leading-none mb-6">
              See Every<br />
              <span className="gradient-text">Dimension</span>
            </h2>
            <p className="text-white/50 leading-relaxed mb-10 max-w-sm">
              Explore the VOID X1 from every angle. Rotate, zoom, and customize your colorway 
              in real time. This is the future of shoe shopping.
            </p>

            {/* Feature bullets */}
            <div className="space-y-4 mb-10">
              {[
                '360° real-time rotation',
                '5 exclusive colorways',
                'Photorealistic materials',
                'Environment reflections',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--neon-blue)' }} />
                  <span className="text-sm text-white/60">{item}</span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={onConfigure}
              className="px-8 py-3.5 rounded-full font-semibold text-black text-sm inline-flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}
            >
              Configure Yours →
            </button>
          </motion.div>
        </div>

        {/* Right: 3D Canvas — full height, pushed slightly beyond the column
            to bleed into the right edge and look larger */}
        <motion.div
          className="relative h-[70vh] lg:h-auto lg:-mr-8 xl:-mr-16"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            /* Subtle glow behind the model */
            background:
              'radial-gradient(ellipse 70% 60% at 65% 50%, rgba(0,212,255,0.06) 0%, transparent 70%)',
          }}
        >
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center text-white/20 text-sm font-mono">
              LOADING 3D MODEL...
            </div>
          }>
            <ProductCanvas />
          </Suspense>
        </motion.div>

      </div>
    </section>
  );
}
