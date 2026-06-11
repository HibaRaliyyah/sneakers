import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Magnetic button — content shifts subtly toward cursor.
 */
export default function MagneticButton({ children, className = '', onClick, ...props }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    setOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`magnetic-btn ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
