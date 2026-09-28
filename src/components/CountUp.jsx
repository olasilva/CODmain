// src/components/CountUp.jsx
import { useEffect, useRef, useState } from 'react';

export default function CountUp({
  end,
  duration = 1800,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
  as: Tag = 'span',
  delay = 0,
  debug = false,
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState('0');
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (debug) {
      console.log('[CountUp] mounted for target:', end);
    }

    const format = (n) => {
      const fixed = Number(n).toFixed(decimals);
      const [intPart, decPart] = fixed.split('.');
      const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return `${prefix}${withSep}${decPart ? '.' + decPart : ''}${suffix}`;
    };

    // Respect reduced-motion — jump straight to the target
    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    )?.matches;

    if (prefersReduced) {
      if (debug) console.log('[CountUp] reduced motion — final value');
      setDisplay(format(end));
      return;
    }

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (debug) console.log('[CountUp] starting animation to', end);

      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(format(end * eased));
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(format(end));
      };
      requestAnimationFrame(tick);
    };

    // Already in view on mount? Fire immediately (with a small delay).
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (debug) {
      console.log('[CountUp] in view at mount?', inView, rect);
    }

    if (inView) {
      const t = setTimeout(run, delay);
      return () => clearTimeout(t);
    }

    // Otherwise observe and fire when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (debug) {
            console.log('[CountUp] intersection:', entry.isIntersecting);
          }
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, decimals, prefix, suffix, separator, delay, debug]);

  return (
    <Tag ref={ref} className={className}>
      {display}
    </Tag>
  );
}