import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../../hooks/useMousePosition';

/**
 * Custom cursor: outer ring + inner dot that follows mouse.
 */
export default function CursorGlow() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const { x, y } = useMousePosition();
  const outerPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.style.left = `${x}px`;
      innerRef.current.style.top = `${y}px`;
    }

    const lerp = (a, b, t) => a + (b - a) * t;

    const animateOuter = () => {
      outerPos.current.x = lerp(outerPos.current.x, x, 0.12);
      outerPos.current.y = lerp(outerPos.current.y, y, 0.12);

      if (outerRef.current) {
        outerRef.current.style.left = `${outerPos.current.x}px`;
        outerRef.current.style.top = `${outerPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animateOuter);
    };

    rafRef.current = requestAnimationFrame(animateOuter);
    return () => cancelAnimationFrame(rafRef.current);
  }, [x, y]);

  useEffect(() => {
    const handleEnter = () => {
      if (outerRef.current) {
        outerRef.current.style.transform = 'translate(-50%, -50%) scale(2.5)';
        outerRef.current.style.opacity = '0.5';
        outerRef.current.style.borderColor = 'rgba(0,212,255,0.3)';
      }
    };
    const handleLeave = () => {
      if (outerRef.current) {
        outerRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        outerRef.current.style.opacity = '1';
        outerRef.current.style.borderColor = 'rgba(0,212,255,0.6)';
      }
    };

    const links = document.querySelectorAll('a, button, [data-cursor-hover]');
    links.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      links.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="cursor-outer"
        style={{ left: 0, top: 0 }}
      />
      <div
        ref={innerRef}
        className="cursor-inner"
        style={{ left: 0, top: 0 }}
      />
    </>
  );
}
