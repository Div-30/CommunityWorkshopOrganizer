import { useState } from 'react';
import { X } from 'lucide-react';

const DEFAULT_TAGS = [
  'React', 'TypeScript', 'CSS', 'Node.js', 'Python',
  'DevOps', 'Cloud', 'Docker', 'Design', 'AI/ML',
  'GraphQL', 'Testing', 'Security', 'Mobile', 'Database',
];

export function TagSelector({ selected = [], onChange, tags = DEFAULT_TAGS, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => {
              if (isSelected) {
                onChange(selected.filter((t) => t !== tag));
              } else {
                onChange([...selected, tag]);
              }
            }}
            className={`
              inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
              text-[13px] font-medium transition-all duration-100
              cursor-pointer
              ${isSelected
                ? 'bg-[var(--color-primary)] text-white shadow-sm tag-bounce'
                : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }
            `}
          >
            {tag}
            {isSelected && <X size={12} />}
          </button>
        );
      })}
    </div>
  );
}
