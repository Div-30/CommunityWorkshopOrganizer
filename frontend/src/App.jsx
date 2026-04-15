import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LogOut, Sparkles, LayoutDashboard, GraduationCap, Wrench } from 'lucide-react';
import LoginForm from './components/LoginForm';
import AttendeeDashboard from './pages/AttendeeDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateWorkshopForm from './pages/CreateWorkshopForm';
import PageTransition from './components/PageTransition';
import ThemeToggle from './components/ui/ThemeToggle';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('userRole');
  const isLoggedIn = !!role && location.pathname !== '/login';

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('myRsvps');
    navigate('/login');
  };

  return (
    <header
      className="glass-strong sticky top-0 z-50 py-3.5 px-6 flex items-center justify-between"
      style={{
        borderBottom: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'var(--gradient-hero)',
            boxShadow: 'var(--shadow-glow-violet)',
          }}
          onClick={() => isLoggedIn && navigate(role === 'Attendee' ? '/attendee' : '/organizer')}
        >
          <Sparkles size={18} />
        </div>
        <div>
          <h1
            className="text-sm font-bold tracking-tight leading-none"
            style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Community Workshops
          </h1>
          {isLoggedIn && (
            <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Signed in as{' '}
              <span className="font-semibold" style={{ color: 'var(--accent-violet)' }}>{role}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <ThemeToggle />

        {isLoggedIn && (
          <>
            <span
              className="hidden sm:flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl"
              style={{
                background: 'var(--bg-muted)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: role === 'Attendee' ? 'var(--accent-emerald)' : 'var(--accent-violet)',
                  boxShadow: role === 'Attendee'
                    ? '0 0 6px rgba(16,185,129,0.4)'
                    : '0 0 6px rgba(124,58,237,0.4)',
                }}
              />
              {role === 'Attendee' ? (
                <><GraduationCap size={14} /> Attendee</>
              ) : (
                <><Wrench size={14} /> Organizer</>
              )}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px active:scale-95"
              style={{
                color: 'var(--text-tertiary)',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-rose)';
                e.currentTarget.style.background = 'rgba(244,63,94,0.08)';
                e.currentTarget.style.borderColor = 'rgba(244,63,94,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-tertiary)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}

function App() {
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col mesh-gradient"
      style={{ background: 'var(--bg-base)', fontFamily: "'Outfit', sans-serif" }}
    >
      <Header />

      <main className="flex-1 overflow-x-hidden w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<PageTransition><LoginForm /></PageTransition>} />
            <Route path="/attendee" element={<PageTransition><AttendeeDashboard /></PageTransition>} />
            <Route path="/organizer" element={<PageTransition><OrganizerDashboard /></PageTransition>} />
            <Route path="/organizer/create" element={<PageTransition><CreateWorkshopForm /></PageTransition>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer
        className="py-6 text-center text-xs mt-auto"
        style={{
          color: 'var(--text-tertiary)',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-4 h-4 rounded-md"
            style={{ background: 'var(--gradient-hero)' }}
          />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}>
            Community Workshop Organizer
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;