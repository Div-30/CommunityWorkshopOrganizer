import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES = {
  success: 'border-[#059669]/20 bg-[var(--color-success-light)]',
  error: 'border-[#E11D48]/20 bg-[var(--color-danger-light)]',
  info: 'border-[#4F46E5]/20 bg-[var(--color-primary-light)]',
  warning: 'border-[#D97706]/20 bg-[var(--color-warning-light)]',
};

const ICON_COLORS = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-danger)]',
  info: 'text-[var(--color-primary)]',
  warning: 'text-[var(--color-warning)]',
};

export function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;

        return (
          <div
            key={toast.id}
            className={`
              toast-enter pointer-events-auto rounded-xl border px-4 py-3.5
              shadow-[var(--shadow-toast)] backdrop-blur-sm
              ${STYLES[toast.type] || STYLES.info}
            `}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <Icon size={18} className={`mt-0.5 shrink-0 ${ICON_COLORS[toast.type] || ICON_COLORS.info}`} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-[var(--color-ink)]">{toast.title}</p>
                <p className="mt-0.5 text-[13px] text-[var(--color-ink-secondary)]">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-lg p-1 text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
