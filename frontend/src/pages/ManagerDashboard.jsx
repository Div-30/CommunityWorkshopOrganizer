import { useEffect, useState } from 'react';
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

import { useNavigate } from 'react-router-dom';
import { organizerRequestAPI, userAPI, workshopAPI } from '../services/api';

export function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [workshopCount, setWorkshopCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqs, users, workshops] = await Promise.all([
          organizerRequestAPI.getAll(),
          userAPI.getAll(),
          workshopAPI.getAll(),
        ]);
        setRequests(Array.isArray(reqs) ? reqs : []);
        setUserCount(Array.isArray(users) ? users.length : 0);
        setWorkshopCount(Array.isArray(workshops) ? workshops.length : 0);
      } catch (err) {
        console.error('Failed to load manager dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pending = requests.filter(r => r.status === 'Pending');
  const approved = requests.filter(r => r.status === 'Approved');
  const rejected = requests.filter(r => r.status === 'Rejected');

  return (
    <PageWrapper
      role="manager"
      title={`${greeting}, ${firstName} 👋`}
      subtitle="Here's what's happening across the platform"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={loading ? '…' : userCount} />
        <StatCard icon={BookOpen} label="Total Workshops" value={loading ? '…' : workshopCount} />
        <StatCard icon={ClipboardCheck} label="Pending Review" value={loading ? '…' : pending.length} trend={pending.length > 0 ? 'Needs attention' : undefined} />
        <StatCard icon={CheckCircle} label="Approved" value={loading ? '…' : approved.length} />
        <StatCard icon={XCircle} label="Rejected" value={loading ? '…' : rejected.length} />
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

          {loading ? (
            <div className="py-8 text-center">
              <p className="text-[15px] text-[var(--color-ink-secondary)]">Loading…</p>
            </div>
          ) : pending.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[15px] text-[var(--color-ink-secondary)]">All clear! No organizer requests pending 🎉</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pending.slice(0, 5).map((r) => (
                <div
                  key={r.requestId}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                  onClick={() => navigate('/manager/reviews')}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-warning-light)]">
                    <Clock size={16} className="text-[var(--color-warning)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--color-ink)] truncate">
                      {r.user?.fullName || `User #${r.userId}`}
                    </p>
                    <p className="text-[12px] text-[var(--color-ink-tertiary)]">{r.user?.email}</p>
                  </div>
                  <Badge variant="pending">Pending</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent activity placeholder */}
        <Card>
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)] mb-4">Recent Activity</h2>
          <div className="py-8 text-center">
            <p className="text-[15px] text-[var(--color-ink-secondary)]">Activity feed coming soon.</p>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
