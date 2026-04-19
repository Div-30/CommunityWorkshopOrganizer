export function CapacityBar({ current = 0, capacity = 1, showLabel = true, className = '' }) {
  const percentage = Math.min(Math.round((current / capacity) * 100), 100);
  const remaining = Math.max(capacity - current, 0);

  const barColor =
    percentage >= 90
      ? 'bg-[var(--color-danger)]'
      : percentage >= 70
        ? 'bg-[var(--color-warning)]'
        : 'bg-[var(--color-success)]';

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] text-[var(--color-ink-secondary)]">
            {current}/{capacity} spots filled
          </span>
          <span className="text-[13px] font-medium text-[var(--color-ink)]">
            {remaining === 0 ? 'Sold out' : `${remaining} left`}
          </span>
        </div>
      )}
      <div className="w-full h-1.5 bg-[var(--color-border-light)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
