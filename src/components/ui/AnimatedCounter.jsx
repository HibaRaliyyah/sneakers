import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Counts from 0 to `target` when element enters viewport.
 */
export default function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = (currentTime - startTime) / (duration * 1000);
      const eased = 1 - Math.pow(1 - Math.min(elapsed, 1), 4); // ease-out-quart
      setCount(Math.round(eased * target));
      if (elapsed < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
