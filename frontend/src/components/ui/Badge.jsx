const VARIANT_STYLES = {
  default: 'bg-[var(--color-neutral-light)] text-[var(--color-neutral)]',
  success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
  info: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',

  /* Status badges */
  pending: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
  approved: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  rejected: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
  soldout: 'bg-[var(--color-neutral-light)] text-[var(--color-neutral)]',
};

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5
        text-[11px] font-medium tracking-wide
        ${VARIANT_STYLES[variant] || VARIANT_STYLES.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
