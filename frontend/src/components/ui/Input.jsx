import { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, error, icon: Icon, id, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`input ${error ? 'input-error' : ''} ${Icon ? 'pl-10' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--accent-rose)' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
