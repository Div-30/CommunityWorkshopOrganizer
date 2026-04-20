export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-[2px]',
    md: 'h-6 w-6 border-[2px]',
    lg: 'h-10 w-10 border-[3px]',
  };

  return (
    <span
      className={`
        inline-block rounded-full animate-spin
        border-[var(--color-border)] border-t-[var(--color-primary)]
        ${sizes[size]} ${className}
      `}
      aria-hidden="true"
    />
  );
}
