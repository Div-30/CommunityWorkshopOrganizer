import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { userAPI } from '../services/api';
import { User, Lock, Save } from 'lucide-react';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ fullName: '', email: '' });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    userAPI.getProfile()
      .then(data => setProfile({ fullName: data.fullName || '', email: data.email || '' }))
      .catch(() => showError('Failed to load profile.'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = () => {
    const e = {};
    if (!profile.fullName.trim()) e.fullName = 'Full name is required';
    if (passwords.newPassword && passwords.newPassword.length < 6)
      e.newPassword = 'Password must be at least 6 characters';
    if (passwords.newPassword !== passwords.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSave = async () => {
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setErrors({});
    setLoading(true);
    try {
      await userAPI.updateProfile(
        profile.fullName,
        passwords.newPassword || undefined
      );
      success('Profile updated successfully!');
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      showError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const role = user?.role?.toLowerCase() || 'attendee';

  return (
    <PageWrapper
      role={role}
      title="My Profile"
      subtitle="Update your personal information"
    >
      <div className="max-w-lg space-y-5">
        {/* Personal Info */}
        <Card>
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)] mb-4 flex items-center gap-2">
            <User size={18} className="text-[var(--color-primary)]" />
            Personal Information
          </h2>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={profile.fullName}
              onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
              error={errors.fullName}
              required
            />
            <Input
              label="Email Address"
              value={profile.email}
              disabled
              hint="Cannot be changed"
            />
          </div>
        </Card>

        {/* Change Password */}
        <Card>
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)] mb-1 flex items-center gap-2">
            <Lock size={18} className="text-[var(--color-primary)]" />
            Change Password
          </h2>
          <p className="text-[13px] text-[var(--color-ink-tertiary)] mb-4">Leave blank to keep your current password</p>
          <div className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={passwords.newPassword}
              onChange={(e) => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
              error={errors.newPassword}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
              error={errors.confirmPassword}
            />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} loading={loading} className="flex-1">
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
