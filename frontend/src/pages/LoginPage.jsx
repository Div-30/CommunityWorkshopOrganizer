import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, Zap } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Attendee');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const roles = [
    { value: 'Attendee', label: 'Attendee', description: 'Browse and register for workshops' },
    { value: 'Organizer', label: 'Organizer', description: 'Create and manage workshops' },
    { value: 'Manager', label: 'Manager', description: 'Oversee all workshops and users' },
  ];

  const validate = () => {
    const e = {};
    if (!email) e.email = 'We need your email to continue';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Hmm, that email doesn\'t look right';
    if (!password) e.password = 'Don\'t forget your password';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }

    setLoading(true);
    setErrors({});

    try {
      const user = await login(email, password, selectedRole);
      success('Welcome back! 👋');
      const role = user.role?.toLowerCase();
      
      if (role === 'manager' || role === 'admin') {
         navigate('/manager');
      } else if (role === 'organizer') {
         navigate('/organizer');
      } else {
         navigate('/dashboard');
      }
    } catch (err) {
      // Show the error toast and update the input error state
      showError(err.message || 'Login failed. Please check your credentials or if the server is running.');
      setErrors({ email: 'Invalid credentials or server unreachable.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] page-enter">
        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)] mb-4 shadow-lg">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-ink)]">
            Welcome back 👋
          </h1>
          <p className="mt-1.5 text-[15px] text-[var(--color-ink-secondary)]">
            Great to see you again! Let's get you signed in.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-card)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-ink)] mb-2.5">
                Sign in as
              </label>
              <div className="flex gap-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`
                      flex-1 rounded-xl border-2 px-3 py-3 text-center transition-all duration-150 cursor-pointer
                      ${selectedRole === role.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-ink-tertiary)]'
                      }
                    `}
                  >
                    <p className={`text-[14px] font-semibold ${selectedRole === role.value ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink)]'}`}>
                      {role.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--color-ink-tertiary)]">{role.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="[EMAIL_ADDRESS]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={Lock}
            />

            <div className="flex justify-end">
              <button type="button" className="text-[13px] font-medium text-[var(--color-primary)] hover:underline cursor-pointer">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[14px] text-[var(--color-ink-secondary)]">
              New here?{' '}
              <Link to="/register" className="font-medium text-[var(--color-primary)] hover:underline">
                Let's get you started
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
