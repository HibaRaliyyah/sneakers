import { useState, useEffect, useRef } from 'react';

/**
 * Tracks mouse position and returns normalized (-1 to 1) and raw (px) values.
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0, normalX: 0, normalY: 0 });
  const rafRef = useRef(null);
  const rawRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      rawRef.current = { x: e.clientX, y: e.clientY };
    };

    const update = () => {
      const { x, y } = rawRef.current;
      const normalX = (x / window.innerWidth) * 2 - 1;
      const normalY = -(y / window.innerHeight) * 2 + 1;
      setPosition({ x, y, normalX, normalY });
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return position;
}
