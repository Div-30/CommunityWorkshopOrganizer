export function SkeletonLoader({ className = '', variant = 'block' }) {
  const variants = {
    block: 'rounded-2xl',
    'stat-card': 'h-[100px] rounded-2xl',
    'card': 'h-[280px] rounded-2xl',
    'list-item': 'h-[72px] rounded-xl',
    'text-line': 'h-4 rounded-lg',
    'avatar': 'h-10 w-10 rounded-full',
    'text-sm': 'h-3 rounded-lg',
  };

  return (
    <div
      className={`skeleton ${variants[variant] || variants.block} ${className}`}
      aria-hidden="true"
    />
  );
}
