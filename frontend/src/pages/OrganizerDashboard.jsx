import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { CapacityBar } from '../components/ui/CapacityBar';
import { EmptyState } from '../components/shared/EmptyState';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import {
  Plus, BookOpen, Users, TrendingUp, Award,
  Edit2, Trash2, Eye, Copy, Sparkles,
} from 'lucide-react';
import { MOCK_WORKSHOPS } from '../utils/mockData';

const STATUS_MAP = {
  Approved: 'approved',
  Pending: 'pending',
  Rejected: 'rejected',
};

const STATUS_LABEL = {
  Approved: 'Live',
  Pending: 'Under review 🔍',
  Rejected: 'Needs changes',
};

export function OrganizerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Use organizer's workshops (mock: filter some)
  const workshops = MOCK_WORKSHOPS.filter(w => [1, 3, 5, 7].includes(w.id));

  const totalAttendees = workshops.reduce((sum, w) => sum + (w.currentAttendees || 0), 0);
  const avgFill = workshops.length
    ? Math.round(workshops.reduce((sum, w) => sum + ((w.currentAttendees / w.capacity) * 100), 0) / workshops.length)
    : 0;
  const soldOut = workshops.filter(w => w.currentAttendees >= w.capacity).length;

  return (
    <PageWrapper
      role="organizer"
      title={`${greeting}, ${firstName} 👋`}
      subtitle="Here's how your workshops are doing"
      action={
        <Button onClick={() => navigate('/workshops/create')}>
          <Plus size={16} />
          Create Workshop
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen} label="Workshops" value={workshops.length} />
        <StatCard icon={Users} label="Attendees" value={totalAttendees} trend="+12% this week" />
        <StatCard icon={TrendingUp} label="Avg Fill Rate" value={`${avgFill}%`} />
        <StatCard icon={Award} label="Sold Out" value={soldOut} />
      </div>

      {/* Workshop list */}
      {workshops.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nothing here yet — let's change that!"
          description="You haven't created any workshops yet. Ready to share your knowledge with the world?"
          actionLabel="Create your first workshop"
          onAction={() => navigate('/workshops/create')}
        />
      ) : (
        <div className="space-y-3">
          {workshops.map((workshop) => (
            <Card key={workshop.id}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold text-[var(--color-ink)] truncate">
                      {workshop.title}
                    </h3>
                    <Badge variant={STATUS_MAP[workshop.status] || 'default'}>
                      {STATUS_LABEL[workshop.status] || workshop.status}
                    </Badge>
                  </div>
                  <p className="text-[13px] text-[var(--color-ink-secondary)]">
                    {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    {workshop.location}
                  </p>
                </div>

                {/* Capacity */}
                <div className="w-full lg:w-48">
                  <CapacityBar
                    current={workshop.currentAttendees}
                    capacity={workshop.capacity}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/workshops/${workshop.id}`)}>
                    <Eye size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/workshops/${workshop.id}/edit`)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
                    onClick={() => setDeleteDialog({ isOpen: true, id: workshop.id })}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={() => setDeleteDialog({ isOpen: false, id: null })}
        title="Delete this workshop?"
        message="Are you sure? This cannot be undone, and all registrations will be cancelled."
        confirmText="Yes, delete it"
        cancelText="Never mind"
      />
    </PageWrapper>
  );
}
