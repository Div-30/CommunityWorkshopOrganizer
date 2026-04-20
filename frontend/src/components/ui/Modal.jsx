import { X, AlertTriangle } from 'lucide-react';

export function Modal({ isOpen, onClose, title, description, children, danger = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm backdrop-enter"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="modal-enter relative w-full max-w-lg rounded-2xl bg-[var(--color-surface)] p-6 shadow-[var(--shadow-modal)] border border-[var(--color-border)]">
        <div className="mb-6 flex items-start gap-4">
          {danger && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-danger-light)]">
              <AlertTriangle size={20} className="text-[var(--color-danger)]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">{title}</h2>
            {description && (
              <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--color-ink-secondary)]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
