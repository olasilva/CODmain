// src/components/Stagger.jsx
import { Children, cloneElement, isValidElement } from 'react';

export default function Stagger({
  children,
  base = 0,
  step = 80,
  variant = 'droplet',
  as: Tag = null,
  className = '',
}) {
  const items = Children.toArray(children);

  const wrapped = items.map((child, i) => {
    const delay = base + i * step;

    // Non-element children (strings, numbers, null) — wrap in a plain span
    if (!isValidElement(child)) {
      return (
        <span
          key={i}
          className={variant}
          style={{ animationDelay: `${delay}ms` }}
        >
          {child}
        </span>
      );
    }

    const existingStyle =
      child.props.style && typeof child.props.style === 'object'
        ? child.props.style
        : {};

    // className may be a string OR a function (NavLink) — only merge strings
    const rawClass = child.props.className;
    const existingClass =
      typeof rawClass === 'string' ? rawClass : '';

    const classNames = existingClass.includes(variant)
      ? existingClass
      : `${variant} ${existingClass}`.trim();

    return cloneElement(child, {
      key: child.key ?? i,
      // If className was a function, do NOT overwrite it — the parent
      // component manages its own active/inactive classes.
      ...(typeof rawClass === 'string' ? { className: classNames } : {}),
      style: {
        ...existingStyle,
        animationDelay: `${delay}ms`,
      },
    });
  });

  if (Tag) {
    return <Tag className={className}>{wrapped}</Tag>;
  }
  return <>{wrapped}</>;
}