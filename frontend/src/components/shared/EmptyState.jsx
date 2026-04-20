import { Button } from '../ui/Button';

export function EmptyState({
  icon: Icon,
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {Icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-light)]">
          <Icon size={28} className="text-[var(--color-primary)]" />
        </div>
      )}
      <h3 className="text-[18px] font-semibold text-[var(--color-ink)]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-[15px] text-[var(--color-ink-secondary)] leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
