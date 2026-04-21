import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { CapacityBar } from '../components/ui/CapacityBar';
import { EmptyState } from '../components/shared/EmptyState';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import {
  Plus, BookOpen, Users, TrendingUp, Award,
  Edit2, Trash2, Eye, Copy, Sparkles,
} from 'lucide-react';
import { workshopAPI } from '../services/api';

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
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        const data = await workshopAPI.getMyWorkshops();
        setWorkshops(data || []);
      } catch (err) {
        showError('Failed to load your workshops.');
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const totalAttendees = workshops.reduce((sum, w) => sum + (w.registrations?.length || 0), 0);
  const avgFill = workshops.length
    ? Math.round(workshops.reduce((sum, w) => sum + (((w.registrations?.length || 0) / w.capacity) * 100), 0) / workshops.length)
    : 0;
  const soldOut = workshops.filter(w => (w.registrations?.length || 0) >= w.capacity).length;

  const handleDelete = async () => {
    try {
      await workshopAPI.delete(deleteDialog.id);
      setWorkshops(ws => ws.filter(w => w.workshopId !== deleteDialog.id));
      success('Workshop deleted successfully.');
      setDeleteDialog({ isOpen: false, id: null });
    } catch (err) {
      showError(err.message || 'Failed to delete the workshop.');
    }
  };

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

      {loading ? (
        <div className="space-y-3">
          <SkeletonLoader className="h-24 w-full" />
          <SkeletonLoader className="h-24 w-full" />
        </div>
      ) : workshops.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nothing here yet — let's change that!"
          description="You haven't created any workshops yet. Ready to share your knowledge with the world?"
          actionLabel="Create your first workshop"
          onAction={() => navigate('/workshops/create')}
        />
      ) : (
        <div className="space-y-3">
          {workshops.map((workshop) => {
             const currentAttendees = workshop.registrations?.length || 0;
             return (
            <Card key={workshop.workshopId}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold text-slate-900 truncate">
                      {workshop.title}
                    </h3>
                    <Badge variant={STATUS_MAP[workshop.status] || 'default'}>
                      {STATUS_LABEL[workshop.status] || workshop.status}
                    </Badge>
                  </div>
                  <p className="text-[13px] text-slate-500">
                    {new Date(workshop.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    TBA Campus
                  </p>
                </div>

                {/* Capacity */}
                <div className="w-full lg:w-48">
                  <CapacityBar
                    current={currentAttendees}
                    capacity={workshop.capacity}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/workshops/${workshop.workshopId}`)}>
                    <Eye size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/workshops/${workshop.workshopId}/edit`)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => setDeleteDialog({ isOpen: true, id: workshop.workshopId })}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          )})}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete this workshop?"
        message="Are you sure? This cannot be undone, and all registrations will be cancelled."
        confirmText="Yes, delete it"
        cancelText="Never mind"
      />
    </PageWrapper>
  );
}
