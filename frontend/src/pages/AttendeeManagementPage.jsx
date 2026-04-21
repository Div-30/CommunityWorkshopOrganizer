import { useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { AttendeeRoster } from '../components/shared/AttendeeRoster';
import { Users, UserCheck, TrendingUp } from 'lucide-react';


export function AttendeeManagementPage() {
  const { id } = useParams();
  const workshop = [].find(w => w.id === Number(id)) || [][0];
  const fillRate = Math.round((workshop.currentAttendees / workshop.capacity) * 100);

  return (
    <PageWrapper
      role="organizer"
      title={workshop.title}
      subtitle="Manage attendees for this workshop"
      action={
        <Badge variant={workshop.status === 'Approved' ? 'approved' : 'pending'}>
          {workshop.status}
        </Badge>
      }
    >
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users} label="Registered" value={workshop.currentAttendees} />
        <StatCard icon={UserCheck} label="Capacity" value={workshop.capacity} />
        <StatCard icon={TrendingUp} label="Fill Rate" value={`${fillRate}%`} />
      </div>

      {/* Attendee roster */}
      <AttendeeRoster workshopId={workshop.id} capacity={workshop.capacity} />
    </PageWrapper>
  );
}
