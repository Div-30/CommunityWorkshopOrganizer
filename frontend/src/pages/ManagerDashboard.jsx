import { useAuth } from '../context/AuthContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import {
  Users, BookOpen, ClipboardCheck, CheckCircle, XCircle,
  Clock, ArrowRight,
} from 'lucide-react';
import { MOCK_WORKSHOPS, MOCK_USERS, MOCK_ACTIVITY } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';

export function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const pending = MOCK_WORKSHOPS.filter(w => w.status === 'Pending');
  const approved = MOCK_WORKSHOPS.filter(w => w.status === 'Approved');
  const rejected = MOCK_WORKSHOPS.filter(w => w.status === 'Rejected');

  return (
    <PageWrapper
      role="manager"
      title={`${greeting}, ${firstName} 👋`}
      subtitle="Here's what's happening across the platform"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={MOCK_USERS.length} />
        <StatCard icon={BookOpen} label="Total Workshops" value={MOCK_WORKSHOPS.length} />
        <StatCard icon={ClipboardCheck} label="Pending Review" value={pending.length} trend={pending.length > 0 ? 'Needs attention' : undefined} />
        <StatCard icon={CheckCircle} label="Approved" value={approved.length} />
        <StatCard icon={XCircle} label="Rejected" value={rejected.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending review queue */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">Pending Review</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/manager/reviews')}>
              View all
              <ArrowRight size={14} />
            </Button>
          </div>

          {pending.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[15px] text-[var(--color-ink-secondary)]">All clear! No workshops pending review 🎉</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pending.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                  onClick={() => navigate('/manager/reviews')}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-warning-light)]">
                    <Clock size={16} className="text-[var(--color-warning)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--color-ink)] truncate">{w.title}</p>
                    <p className="text-[12px] text-[var(--color-ink-tertiary)]">by {w.organizerName}</p>
                  </div>
                  <Badge variant="pending">Under review</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent activity */}
        <Card>
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)] mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {MOCK_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-[var(--color-surface-hover)] transition-colors">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                <div className="min-w-0">
                  <p className="text-[14px] text-[var(--color-ink)] leading-relaxed">{activity.action}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-[var(--color-ink-tertiary)]">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
