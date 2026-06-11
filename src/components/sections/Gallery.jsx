import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import g1 from '../../assets/gallery_1.png';
import g2 from '../../assets/gallery_2.png';
import g3 from '../../assets/gallery_3.png';
import g4 from '../../assets/gallery_4.png';
import g5 from '../../assets/gallery_5.png';
import g6 from '../../assets/gallery_6.png';

const IMAGES = [
  { src: g1, alt: 'Sneaker Detail Shot',        caption: 'Material Obsession'       },
  { src: g2, alt: 'Fashion Editorial Night',     caption: 'Urban Mythology'          },
  { src: g3, alt: 'Floating Sneakers Void',      caption: 'Zero Gravity'             },
  { src: g4, alt: 'Sole Technology Close-up',    caption: 'Sole Intelligence'        },
  { src: g5, alt: 'Design Process',             caption: 'The Blueprint'             },
  { src: g6, alt: 'Action Shot Jump',           caption: 'Kinetic Energy'            },
];

/**
 * Masonry gallery with lightbox modal.
 */
export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <section id="gallery" className="relative py-32 px-6 md:px-12" style={{ background: '#030305' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-label mb-4">VISUAL ARCHIVE</p>
          <h2 className="font-display font-black text-5xl md:text-6xl tracking-[-0.03em]">
            The <span className="gradient-text">Gallery</span>
          </h2>
        </motion.div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {IMAGES.map((img, i) => (
            <motion.div
              key={i}
              className="masonry-item group relative cursor-pointer overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              onClick={() => setLightboxIndex(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ aspectRatio: i % 3 === 1 ? '3/4' : '4/3' }}
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}
              >
                <p className="font-display font-bold text-white text-sm">{img.caption}</p>
                <p className="section-label text-[10px] text-white/50 mt-1">CLICK TO VIEW</p>
              </div>

              {/* Corner accent */}
              <div
                className="absolute top-3 right-3 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'var(--neon-blue)', boxShadow: '0 0 8px var(--neon-blue)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

            {/* Controls */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 glass rounded-full flex items-center justify-center text-white"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + IMAGES.length) % IMAGES.length); }}
            >‹</button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 glass rounded-full flex items-center justify-center text-white"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % IMAGES.length); }}
            >›</button>
            <button
              className="absolute top-6 right-6 z-10 text-white/60 hover:text-white text-3xl"
              onClick={() => setLightboxIndex(null)}
            >✕</button>

            <motion.div
              key={lightboxIndex}
              className="relative z-10 max-w-4xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={IMAGES[lightboxIndex].src}
                alt={IMAGES[lightboxIndex].alt}
                className="w-full rounded-2xl max-h-[80vh] object-contain"
              />
              <p className="text-center text-white/60 mt-4 font-display">
                {IMAGES[lightboxIndex].caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
