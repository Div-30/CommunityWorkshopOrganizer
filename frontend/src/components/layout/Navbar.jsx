import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  LogOut, User, Users, Briefcase, UserCog, Menu, Bell,
  Zap, Sun, Moon,
} from 'lucide-react';
import { useState } from 'react';
import { APP_NAME } from '../../utils/constants';

export function Navbar({ onOpenMenu }) {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles = [
    { value: 'Attendee', label: 'Attendee', icon: Users, path: '/dashboard' },
    { value: 'Organizer', label: 'Organizer', icon: Briefcase, path: '/organizer' },
    { value: 'Manager', label: 'Manager', icon: UserCog, path: '/manager' },
  ];

  const handleRoleSwitch = (role, path) => {
    setUser({ ...user, role });
    setShowRoleMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="lg:hidden sticky top-0 z-40 h-14 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="rounded-lg p-2 text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors lg:hidden cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)]">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold text-[var(--color-ink)]">{APP_NAME}</span>
          </Link>
        </div>

        {/* Right: Actions */}
        {user && (
          <div className="flex items-center gap-2">
            {/* Role switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
              >
                <span>{user.role || 'Attendee'}</span>
                <span className="text-[10px]">▼</span>
              </button>

              {showRoleMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
                  <div className="absolute right-0 mt-1 w-52 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-modal)] z-50">
                    <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)]">
                      Switch Role
                    </p>
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <button
                          key={role.value}
                          onClick={() => handleRoleSwitch(role.value, role.path)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[14px] transition-colors cursor-pointer
                            ${user.role === role.value
                              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                              : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)]'
                            }`}
                        >
                          <Icon size={16} />
                          <span className="font-medium">{role.label}</span>
                          {user.role === role.value && <span className="ml-auto">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* User avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[13px] font-semibold">
              {user.fullName?.charAt(0) || 'U'}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
