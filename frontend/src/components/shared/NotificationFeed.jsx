import { Bell, Calendar, Users, RefreshCw, MapPin } from 'lucide-react';

const ICON_MAP = {
  rsvp: Users,
  reminder: Calendar,
  waitlist: RefreshCw,
  update: MapPin,
};

export function NotificationFeed({ notifications = [] }) {
  if (notifications.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-light)]">
          <Bell size={24} className="text-[var(--color-primary)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--color-ink)]">All caught up!</p>
        <p className="mt-1 text-[13px] text-[var(--color-ink-tertiary)]">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {notifications.map((notif) => {
        const Icon = ICON_MAP[notif.type] || Bell;
        return (
          <div
            key={notif.id}
            className={`
              flex items-start gap-3.5 rounded-xl px-4 py-3.5 transition-colors
              ${notif.read
                ? 'hover:bg-[var(--color-surface-hover)]'
                : 'bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-light)]'
              }
            `}
          >
            <div className={`
              mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
              ${notif.read ? 'bg-[var(--color-surface-hover)]' : 'bg-[var(--color-surface)]'}
            `}>
              <Icon size={15} className={notif.read ? 'text-[var(--color-ink-tertiary)]' : 'text-[var(--color-primary)]'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[14px] leading-snug ${notif.read ? 'text-[var(--color-ink-secondary)]' : 'font-medium text-[var(--color-ink)]'}`}>
                {notif.title}
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-ink-tertiary)] leading-relaxed">
                {notif.message}
              </p>
              <p className="mt-1.5 text-[11px] font-medium text-[var(--color-ink-tertiary)]">
                {notif.time}
              </p>
            </div>
            {!notif.read && (
              <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
