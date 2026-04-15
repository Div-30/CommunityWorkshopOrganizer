import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: `font-semibold text-sm transition-all duration-200 rounded-[var(--radius-xl)]`,
  ghost: `font-semibold text-sm transition-all duration-200 rounded-[var(--radius-xl)]`,
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-sm',
};

const Button = forwardRef(
  ({ children, variant = 'primary', size = 'md', loading = false, disabled = false, className = '', ...props }, ref) => {
    const isDisabled = disabled || loading;

    const getVariantClasses = () => {
      if (variant === 'danger') {
        return `${variants.danger} bg-[var(--accent-rose)] text-white hover:brightness-110 hover:-translate-y-px active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[var(--accent-rose)] focus-visible:outline-offset-2 shadow-[var(--shadow-md)]`;
      }
      if (variant === 'ghost') {
        return `${variants.ghost} bg-transparent hover:bg-[var(--bg-muted)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[var(--accent-violet)] focus-visible:outline-offset-2`;
      }
      return variants[variant] || variants.primary;
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`${getVariantClasses()} ${sizes[size]} inline-flex items-center justify-center gap-2 ${
          isDisabled ? 'opacity-50 cursor-not-allowed !transform-none' : ''
        } ${className}`}
        style={{ color: variant === 'ghost' ? 'var(--text-secondary)' : undefined }}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
