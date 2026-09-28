// src/components/PageHeader.jsx
export default function PageHeader({
  title,
  subtitle,
  badge,
  action,
  align = 'left',
}) {
  const alignClass =
    align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 ${alignClass}`}
    >
      <div className={align === 'center' ? 'text-center' : ''}>
        {badge && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F9FF] border border-[#1A73E8]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1A73E8] mb-3">
            {badge}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-black font-ebrima leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-black/55 mt-2 font-ebrima max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}