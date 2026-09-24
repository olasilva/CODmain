// src/components/Reveal.jsx
import { useEffect, useRef, useState } from 'react';

/**
 * Wraps children in a div that reveals on scroll.
 *
 * Usage:
 *   <Reveal variant="fade-up" delay={0.1}>
 *     <p>Hello world</p>
 *   </Reveal>
 *
 * Props:
 *   variant  — "fade-up" | "fade-down" | "fade-left" | "fade-right"
 *              | "zoom-in" | "zoom-out" | "flip-in" | "rotate-in" | "fade"
 *   delay    — seconds to delay the animation (0, 0.1, 0.2 ...)
 *   className — extra classes for the wrapper
 *   as       — HTML tag to render (default: div)
 *   once     — if true (default), animation runs once
 *   threshold — 0..1, how much of the element must be visible (default 0.15)
 */
export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  once = true,
  threshold = 0.15,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the browser doesn't support IntersectionObserver → show immediately
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${variant} ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}