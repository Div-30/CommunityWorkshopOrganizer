const colorMap = {
  React: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', border: 'rgba(59,130,246,0.2)' },
  Frontend: { bg: 'rgba(14,165,233,0.1)', text: '#0ea5e9', border: 'rgba(14,165,233,0.2)' },
  Beginner: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.2)' },
  CSS: { bg: 'rgba(236,72,153,0.1)', text: '#ec4899', border: 'rgba(236,72,153,0.2)' },
  Design: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7', border: 'rgba(168,85,247,0.2)' },
  Advanced: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  DevOps: { bg: 'rgba(249,115,22,0.1)', text: '#f97316', border: 'rgba(249,115,22,0.2)' },
  Cloud: { bg: 'rgba(6,182,212,0.1)', text: '#06b6d4', border: 'rgba(6,182,212,0.2)' },
  Intermediate: { bg: 'rgba(234,179,8,0.1)', text: '#eab308', border: 'rgba(234,179,8,0.2)' },
};

const defaultColor = { bg: 'var(--bg-muted)', text: 'var(--text-secondary)', border: 'var(--border-default)' };

export default function Badge({ children, tag, className = '' }) {
  const colors = colorMap[tag] || defaultColor;

  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide ${className}`}
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {children}
    </span>
  );
}
