export function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 rounded-xl bg-[var(--color-surface-hover)] p-1 border border-[var(--color-border)] ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium
            transition-all duration-150 cursor-pointer
            ${activeTab === tab.id
              ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-sm'
              : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
            }
          `}
        >
          {tab.icon && <tab.icon size={15} />}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className={`
              text-[11px] font-medium px-1.5 py-0.5 rounded-full
              ${activeTab === tab.id
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                : 'bg-[var(--color-border-light)] text-[var(--color-ink-tertiary)]'
              }
            `}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
