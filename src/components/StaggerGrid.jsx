// src/components/StaggerGrid.jsx
import { Children, cloneElement, isValidElement } from 'react';

export default function StaggerGrid({
  children,
  base = 0,
  step = 70,
  variant = 'droplet',
  className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
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