// src/components/PageReveal.jsx
import { Children, cloneElement, isValidElement } from 'react';

/**
 * Wraps page content and staggers the droplet animation across its
 * direct children.
 *
 * <PageReveal base={0} step={100}>
 *   <PageHeader title="About" />
 *   <SectionOne />
 *   <SectionTwo />
 * </PageReveal>
 */
export default function PageReveal({
  children,
  base = 0,
  step = 110,
  variant = 'droplet',
  className = '',
}) {
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, i) => {
        const delay = base + i * step;
        if (!isValidElement(child)) {
          return (
            <div
              key={i}
              className={variant}
              style={{ animationDelay: `${delay}ms` }}
            >
              {child}
            </div>
          );
        }
        const existingStyle = child.props.style || {};
        const existingClass = child.props.className || '';
        const classNames = existingClass.includes(variant)
          ? existingClass
          : `${variant} ${existingClass}`.trim();

        return cloneElement(child, {
          key: child.key ?? i,
          className: classNames,
          style: { ...existingStyle, animationDelay: `${delay}ms` },
        });
      })}
    </div>
  );
}