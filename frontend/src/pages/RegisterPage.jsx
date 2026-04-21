import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Lock, Zap, Info } from 'lucide-react';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Attendee',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e = {};
    if (!formData.fullName) e.fullName = 'We\'d love to know your name';
    if (!formData.email) e.email = 'We need your email to continue';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'That email doesn\'t look right';
    if (!formData.password) e.password = 'Choose a secure password';
    else if (formData.password.length < 6) e.password = 'Make it at least 6 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords don\'t match';
    if (!formData.acceptTerms) e.acceptTerms = 'Please accept the terms to continue';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }

    setLoading(true);
    setErrors({});

    try {
      // Force Attendee role for backend database compliance
      const result = await register({ ...formData, role: 'Attendee' });
      
      const requestedRole = formData.role.toLowerCase();

      if (result.loggedIn) {
        // Auto-login worked — navigate straight to the right dashboard
        if (requestedRole === 'organizer') {
          success("Account created! Let's get your Organizer application started.");
          navigate('/organizer-request');
        } else {
          success("You're all set! 🎉");
          navigate('/dashboard');
        }
      } else {
        // Account was created but auto-login failed (backend needs restart) —
        // send to login page with a helpful message
        success('Account created successfully! Please sign in to continue.');
        navigate('/login');
      }
    } catch (err) {
      showError(err.message || 'Hmm, something went wrong. Try again?');
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
            Let's get you started
          </h1>
          <p className="mt-1.5 text-[15px] text-[var(--color-ink-secondary)]">
            Join our community and start learning today!
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-card)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Jane Doe"
              value={formData.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              error={errors.fullName}
              icon={User}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => update('email', e.target.value)}
              error={errors.email}
              icon={Mail}
            />

            {/* Role toggle */}
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-ink)] mb-2.5">
                I want to...
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'Attendee', label: 'Learn', desc: 'Browse & register for workshops' },
                  { value: 'Organizer', label: 'Teach', desc: 'Create & manage workshops' },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => update('role', role.value)}
                    className={`
                      flex-1 rounded-xl border-2 px-3 py-3 text-center transition-all duration-150 cursor-pointer
                      ${formData.role === role.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-ink-tertiary)]'
                      }
                    `}
                  >
                    <p className={`text-[14px] font-semibold ${formData.role === role.value ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink)]'}`}>
                      {role.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--color-ink-tertiary)]">{role.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex items-start gap-2 mt-2.5 px-1">
                <Info size={13} className="mt-0.5 shrink-0 text-[var(--color-ink-tertiary)]" />
                <p className="text-[11px] text-[var(--color-ink-tertiary)]">
                  Manager accounts are invite-only. Contact your admin for access.
                </p>
              </div>
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => update('password', e.target.value)}
              error={errors.password}
              icon={Lock}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              icon={Lock}
            />

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => update('acceptTerms', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary-ring)] cursor-pointer accent-[var(--color-primary)]"
              />
              <span className="text-[13px] text-[var(--color-ink-secondary)]">
                I agree to the{' '}
                <a href="#" className="text-[var(--color-primary)] hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[var(--color-primary)] hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-[13px] font-medium text-[var(--color-danger)] -mt-3">{errors.acceptTerms}</p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Create my account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[14px] text-[var(--color-ink-secondary)]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[var(--color-primary)] hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
