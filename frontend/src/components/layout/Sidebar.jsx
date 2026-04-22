import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS, APP_NAME } from '../../utils/constants';
import {
  Compass, CalendarDays, Bell, LayoutDashboard, PlusCircle,
  ClipboardCheck, BookOpen, Users, LogOut, ChevronLeft, Zap, UserCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/Badge';

const ICON_MAP = {
  Compass, CalendarDays, Bell, LayoutDashboard, PlusCircle,
  ClipboardCheck, BookOpen, Users,
};

export function Sidebar({ role = 'attendee' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const links = NAV_LINKS[role] || NAV_LINKS.attendee;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* Group links by section */
  const sections = [];
  let currentSection = null;
  links.forEach((link) => {
    if (link.section && link.section !== currentSection) {
      currentSection = link.section;
      sections.push({ type: 'divider', label: link.section });
    }
    sections.push({ type: 'link', ...link });
  });

  return (
    <aside
      className={`
        hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30
        border-r border-[var(--color-border)] bg-[var(--color-bg)]
        transition-all duration-200
        ${collapsed ? 'w-16' : 'w-[240px]'}
      `}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 px-5 h-16 border-b border-[var(--color-border)] ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">{APP_NAME}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Sidebar navigation">
        {sections.map((item, i) => {
          if (item.type === 'divider') {
            return (
              <div key={`divider-${i}`} className={`pt-4 pb-2 ${collapsed ? 'hidden' : ''}`}>
                <p className="px-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-tertiary)]">
                  {item.label}
                </p>
              </div>
            );
          }

          const Icon = ICON_MAP[item.icon] || Compass;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-all duration-150
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]'
                  : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-2 flex items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-medium text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
      >
        <ChevronLeft size={16} className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        {!collapsed && <span>Collapse</span>}
      </button>

      {/* User section */}
      <div className={`border-t border-[var(--color-border)] px-3 py-3 ${collapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          {/* Avatar — click to go to profile */}
          <Link
            to="/profile"
            title="Edit profile"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold text-[13px] hover:ring-2 hover:ring-[var(--color-primary)] transition-all"
          >
            {user?.fullName?.charAt(0) || 'U'}
          </Link>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <Link to="/profile" className="block hover:underline underline-offset-2">
                <p className="text-[13px] font-medium text-[var(--color-ink)] truncate">
                  {user?.fullName || 'User'}
                </p>
              </Link>
              <Badge variant={role === 'manager' ? 'warning' : role === 'organizer' ? 'info' : 'default'} className="mt-0.5">
                {user?.role || 'Attendee'}
              </Badge>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-danger)] transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
