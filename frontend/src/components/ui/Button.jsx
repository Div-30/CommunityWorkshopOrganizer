export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[var(--shadow-button)] hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-[var(--color-surface)] text-[var(--color-primary)] border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary)] hover:scale-[1.02] active:scale-[0.98]',
    ghost:
      'text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] hover:scale-[1.02] active:scale-[0.98]',
    danger:
      'bg-[var(--color-danger)] text-white hover:bg-[#BE123C] shadow-[var(--shadow-button)] hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[13px]',
    md: 'px-5 py-2.5 text-[15px]',
    lg: 'px-7 py-3.5 text-[16px]',
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Hang tight...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
