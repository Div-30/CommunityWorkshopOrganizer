import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import {
  Users, BookOpen, ClipboardCheck, CheckCircle, XCircle, Clock, ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { organizerRequestAPI, userAPI, workshopAPI } from '../services/api';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

const COLORS = {
  Pending: '#f59e0b',
  Approved: '#10b981',
  Rejected: '#ef4444',
};

export function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqs, usersData, workshopsData] = await Promise.all([
          organizerRequestAPI.getAll(),
          userAPI.getAll(),
          workshopAPI.getAll(),
        ]);
        setRequests(Array.isArray(reqs) ? reqs : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setWorkshops(Array.isArray(workshopsData) ? workshopsData : []);
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

  // Chart data
  const workshopStatusData = [
    { name: 'Pending', value: workshops.filter(w => w.status === 'Pending').length },
    { name: 'Approved', value: workshops.filter(w => w.status === 'Approved').length },
    { name: 'Rejected', value: workshops.filter(w => w.status === 'Rejected').length },
  ].filter(d => d.value > 0);

  const userRoleData = [
    { role: 'Attendees', count: users.filter(u => u.userRole === 'Attendee').length },
    { role: 'Organizers', count: users.filter(u => u.userRole === 'Organizer').length },
    { role: 'Managers', count: users.filter(u => u.userRole === 'Manager').length },
  ];

  // Registrations per workshop (top 5)
  const registrationsData = workshops
    .filter(w => w.status === 'Approved')
    .sort((a, b) => (b.registrations?.length || 0) - (a.registrations?.length || 0))
    .slice(0, 5)
    .map(w => ({
      name: w.title.length > 18 ? w.title.slice(0, 18) + '…' : w.title,
      registrations: w.registrations?.length || 0,
      capacity: w.capacity,
    }));

  return (
    <PageWrapper
      role="manager"
      title={`${greeting}, ${firstName} 👋`}
      subtitle="Here's what's happening across the platform"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={loading ? '…' : users.length} />
        <StatCard icon={BookOpen} label="Total Workshops" value={loading ? '…' : workshops.length} />
        <StatCard icon={ClipboardCheck} label="Pending Review" value={loading ? '…' : pending.length} trend={pending.length > 0 ? 'Needs attention' : undefined} />
        <StatCard icon={CheckCircle} label="Approved" value={loading ? '…' : approved.length} />
        <StatCard icon={XCircle} label="Rejected" value={loading ? '…' : rejected.length} />
      </div>

      {/* Charts Row */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Workshop Status Pie */}
          <Card>
            <h2 className="text-[15px] font-semibold text-[var(--color-ink)] mb-4">Workshop Status</h2>
            {workshopStatusData.length === 0 ? (
              <p className="text-[13px] text-[var(--color-ink-tertiary)] py-8 text-center">No workshops yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={workshopStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {workshopStatusData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* User Roles Bar */}
          <Card>
            <h2 className="text-[15px] font-semibold text-[var(--color-ink)] mb-4">Users by Role</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={userRoleData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="role" tick={{ fontSize: 12, fill: 'var(--color-ink-secondary)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-ink-secondary)' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Workshops by Registrations */}
          <Card>
            <h2 className="text-[15px] font-semibold text-[var(--color-ink)] mb-4">Top Workshops</h2>
            {registrationsData.length === 0 ? (
              <p className="text-[13px] text-[var(--color-ink-tertiary)] py-8 text-center">No approved workshops yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={registrationsData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-ink-secondary)' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-ink-secondary)' }} width={90} />
                  <Tooltip />
                  <Bar dataKey="registrations" fill="#10b981" radius={[0, 4, 4, 0]} name="Registrations" />
                  <Bar dataKey="capacity" fill="#e5e7eb" radius={[0, 4, 4, 0]} name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending review queue */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">Pending Organizer Requests</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/manager/reviews')}>
              View all <ArrowRight size={14} />
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

        {/* Workshops pending approval */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">Workshops Pending Approval</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/manager/workshops')}>
              View all <ArrowRight size={14} />
            </Button>
          </div>
          {loading ? (
            <div className="py-8 text-center">
              <p className="text-[15px] text-[var(--color-ink-secondary)]">Loading…</p>
            </div>
          ) : workshops.filter(w => w.status === 'Pending').length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[15px] text-[var(--color-ink-secondary)]">No workshops pending approval 🎉</p>
            </div>
          ) : (
            <div className="space-y-2">
              {workshops.filter(w => w.status === 'Pending').slice(0, 5).map((w) => (
                <div
                  key={w.workshopId}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                  onClick={() => navigate('/manager/workshops')}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)]">
                    <BookOpen size={16} className="text-[var(--color-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--color-ink)] truncate">{w.title}</p>
                    <p className="text-[12px] text-[var(--color-ink-tertiary)]">
                      by {w.organizer?.fullName || 'Unknown'}
                    </p>
                  </div>
                  <Badge variant="pending">Pending</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}
