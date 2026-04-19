export function Input({
  label,
  hint,
  error,
  icon: Icon,
  as = 'input',
  className = '',
  rows = 4,
  ...props
}) {
  const Component = as;

  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="block text-[13px] font-medium text-[var(--color-ink)]">
          {label}
          {hint && (
            <span className="ml-2 font-normal text-[var(--color-ink-tertiary)]">{hint}</span>
          )}
        </span>
      )}

      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-tertiary)]">
            <Icon size={16} />
          </span>
        )}

        <Component
          rows={as === 'textarea' ? rows : undefined}
          className={`
            w-full rounded-xl border bg-[var(--color-surface)] h-[44px]
            px-3.5 py-2.5 text-[15px] text-[var(--color-ink)]
            placeholder:text-[var(--color-ink-tertiary)]
            transition-all duration-150
            focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)]
            ${as === 'textarea' ? 'h-auto min-h-[100px] resize-y' : ''}
            ${Icon ? 'pl-10' : ''}
            ${error
              ? 'border-[var(--color-danger)] bg-[var(--color-danger-light)] gentle-shake'
              : 'border-[var(--color-border)]'
            }
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="text-[13px] font-medium text-[var(--color-danger)]">{error}</p>
      )}
    </label>
  );
}
