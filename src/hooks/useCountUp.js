// src/hooks/useCountUp.js
import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 → target when the element enters the viewport.
 *
 * Usage:
 *   const [ref, value] = useCountUp(1250, 1800);
 *   return <span ref={ref}>{value}</span>;
 */
export default function useCountUp(target, duration = 1800, options = {}) {
  const {
    start = 0,
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    easing = 'easeOutCubic',
    once = true,
  } = options;

  const ref = useRef(null);
  const [value, setValue] = useState(start);
  const startedRef = useRef(false);
  const frameRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    )?.matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    const easeFns = {
      linear: (t) => t,
      easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
      easeInOutCubic: (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    };
    const ease = easeFns[easing] || easeFns.easeOutCubic;

    const animate = () => {
      const t0 = performance.now();
      const from = start;
      const to = target;
      const delta = to - from;

      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = ease(p);
        setValue(from + delta * eased);
        if (p < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setValue(to);
        }
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !(once && startedRef.current)) {
            startedRef.current = true;
            animate();
            if (once) observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, start, easing, once]);

  // Format the current value
  const formatNumber = (n) => {
    const fixed = Number(n).toFixed(decimals);
    const [intPart, decPart] = fixed.split('.');
    const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return `${prefix}${intWithSep}${decPart ? '.' + decPart : ''}${suffix}`;
  };

  return [ref, formatNumber(value), value];
}