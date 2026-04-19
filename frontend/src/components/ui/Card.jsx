export function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div
      className={`
        bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]
        shadow-[var(--shadow-card)] transition-all duration-150
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:-translate-y-[2px] hover:shadow-[var(--shadow-card-hover)] cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
