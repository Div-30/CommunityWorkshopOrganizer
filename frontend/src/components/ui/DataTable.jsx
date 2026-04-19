export function DataTable({ columns, data, onRowClick, emptyMessage = 'Nothing here yet', className = '' }) {
  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-[15px] text-[var(--color-ink-tertiary)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className={`hidden md:block overflow-x-auto ${className}`}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)]"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-[var(--color-border-light)] last:border-0
                  transition-colors duration-100
                  ${onRowClick ? 'cursor-pointer hover:bg-[var(--color-surface-hover)]' : ''}
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-[14px]">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className={`md:hidden space-y-3 ${className}`}>
        {data.map((row, i) => (
          <div
            key={row.id || i}
            onClick={() => onRowClick?.(row)}
            className={`
              rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4
              ${onRowClick ? 'cursor-pointer active:bg-[var(--color-surface-hover)]' : ''}
            `}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between py-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)]">
                  {col.label}
                </span>
                <span className="text-[14px] text-[var(--color-ink)]">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
