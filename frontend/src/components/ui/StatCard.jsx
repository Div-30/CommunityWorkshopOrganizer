export function StatCard({ icon: Icon, label, value, trend, className = '' }) {
  return (
    <div
      className={`
        flex items-start gap-4 rounded-2xl border border-[var(--color-border)]
        bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]
        transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[var(--shadow-card-hover)]
        ${className}
      `}
    >
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
          <Icon size={20} className="text-[var(--color-primary)]" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[var(--color-ink-secondary)] tracking-wide uppercase">
          {label}
        </p>
        <p className="mt-1 text-[28px] font-bold leading-none text-[var(--color-ink)] tracking-tight">
          {value}
        </p>
        {trend && (
          <p className="mt-1.5 text-[11px] font-medium text-[var(--color-success)]">{trend}</p>
        )}
      </div>
    </div>
  );
}
