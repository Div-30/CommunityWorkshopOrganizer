export default function SkeletonLoader({ count = 3, type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-2xl)] overflow-hidden"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div className="h-1.5 animate-shimmer" />
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-14 rounded-full animate-shimmer" />
                <div className="h-5 w-18 rounded-full animate-shimmer" />
              </div>
              <div className="h-5 w-3/4 rounded-lg animate-shimmer" />
              <div className="h-4 w-full rounded-lg animate-shimmer" />
              <div className="h-4 w-2/3 rounded-lg animate-shimmer" />
              <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="h-4 w-1/2 rounded-lg animate-shimmer" />
                <div className="h-4 w-2/3 rounded-lg animate-shimmer" />
                <div className="h-2 w-full rounded-full animate-shimmer" />
              </div>
              <div className="h-10 w-full rounded-xl animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-2xl)] p-5 flex items-center gap-4"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div className="w-10 h-10 rounded-xl animate-shimmer" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-12 rounded-lg animate-shimmer" />
              <div className="h-3 w-16 rounded animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
