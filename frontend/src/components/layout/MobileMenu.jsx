import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS } from '../../utils/constants';
import {
  Compass, CalendarDays, Bell, LayoutDashboard, PlusCircle,
  ClipboardCheck, BookOpen, Users, X, LogOut,
} from 'lucide-react';

const ICON_MAP = {
  Compass, CalendarDays, Bell, LayoutDashboard, PlusCircle,
  ClipboardCheck, BookOpen, Users,
};

export function MobileMenu({ isOpen, onClose, role = 'attendee' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV_LINKS[role] || NAV_LINKS.attendee;

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm backdrop-enter" onClick={onClose} />

      {/* Drawer */}
      <div className="page-enter absolute left-0 top-0 bottom-0 w-[280px] bg-[var(--color-bg)] border-r border-[var(--color-border)] shadow-[var(--shadow-modal)]">
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--color-border)]">
          <p className="text-[15px] font-semibold text-[var(--color-ink)]">Navigation</p>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Links */}
        <nav className="px-3 py-4 space-y-1">
          {links.map((link) => {
            const Icon = ICON_MAP[link.icon] || Compass;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors
                  ${isActive
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)]'
                  }`
                }
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--color-border)] px-3 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold text-[13px]">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[var(--color-ink)] truncate">{user?.fullName || 'User'}</p>
              <p className="text-[11px] text-[var(--color-ink-tertiary)] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
