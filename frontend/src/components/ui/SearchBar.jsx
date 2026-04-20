import { Search } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-tertiary)]"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full h-[44px] rounded-xl border border-[var(--color-border)]
          bg-[var(--color-surface)] pl-10 pr-4 text-[15px]
          text-[var(--color-ink)] placeholder:text-[var(--color-ink-tertiary)]
          transition-all duration-150
          focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)]
        "
      />
    </div>
  );
}
