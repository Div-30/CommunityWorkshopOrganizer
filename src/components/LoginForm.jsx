import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Wrench, ArrowRight, Check } from 'lucide-react';
import Button from './ui/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function LoginForm() {
  const [role, setRole] = useState('Attendee');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('userRole');
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('userRole', role);
    navigate(role === 'Attendee' ? '/attendee' : '/organizer');
  };

  const roles = [
    {
      value: 'Attendee',
      icon: GraduationCap,
      desc: 'Browse & RSVP workshops',
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    },
    {
      value: 'Organizer',
      icon: Wrench,
      desc: 'Create & manage events',
      gradient: 'linear-gradient(135deg, #7c3aed, #d946ef)',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl animate-float"
          style={{ background: 'rgba(124,58,237,0.08)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl animate-float-delayed"
          style={{ background: 'rgba(217,70,239,0.06)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'rgba(245,158,11,0.04)' }}
        />
      </div>

      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Logo + Brand */}
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white font-bold text-2xl mb-5"
            style={{
              background: 'var(--gradient-hero)',
              boxShadow: 'var(--shadow-glow-violet)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <GraduationCap size={28} />
            </motion.div>
          </div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Community Workshops
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Learn, connect, and grow together
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="card-glass p-8"
          variants={itemVariants}
          style={{ boxShadow: 'var(--shadow-xl)' }}
        >
          <h2
            className="text-lg font-bold mb-1"
            style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Sign in to continue
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
            Choose your role to get started
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selector */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'var(--text-tertiary)' }}
              >
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(({ value, icon: Icon, desc, gradient }) => {
                  const isSelected = role === value;
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      className="relative py-5 px-4 rounded-xl text-left text-sm font-medium transition-all duration-300"
                      style={{
                        background: isSelected ? 'var(--bg-muted)' : 'var(--bg-surface)',
                        border: `2px solid ${isSelected ? 'var(--accent-violet)' : 'var(--border-default)'}`,
                        boxShadow: isSelected ? 'var(--shadow-glow-violet)' : 'none',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSelected && (
                        <motion.span
                          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ background: 'var(--accent-violet)' }}
                        >
                          <Check size={12} className="text-white" />
                        </motion.span>
                      )}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                        style={{ background: gradient }}
                      >
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {value}
                      </div>
                      <div className="text-xs mt-0.5 font-normal" style={{ color: 'var(--text-tertiary)' }}>
                        {desc}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <Button type="submit" className="w-full !py-3.5" size="lg">
              Continue as {role}
              <ArrowRight size={16} />
            </Button>
          </form>
        </motion.div>

        <motion.p
          className="text-center text-xs mt-6"
          style={{ color: 'var(--text-tertiary)' }}
          variants={itemVariants}
        >
          This is a prototype — no real authentication required
        </motion.p>
      </motion.div>
    </div>
  );
}