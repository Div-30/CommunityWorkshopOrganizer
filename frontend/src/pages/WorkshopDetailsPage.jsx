import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CapacityBar } from '../components/ui/CapacityBar';
import { AttendeeRoster } from '../components/shared/AttendeeRoster';
import { ResourceManager } from '../components/shared/ResourceManager';
import { Calendar, Clock, MapPin, User, ArrowLeft } from 'lucide-react';
import { MOCK_WORKSHOPS } from '../utils/mockData';

export function WorkshopDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const workshop = MOCK_WORKSHOPS.find(w => w.id === Number(id)) || MOCK_WORKSHOPS[0];
  const isOrganizer = user?.role?.toLowerCase() === 'organizer' || user?.role?.toLowerCase() === 'manager';
  const role = user?.role?.toLowerCase() || 'attendee';

  return (
    <PageWrapper role={role}>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft size={14} />
        Back
      </Button>

      {/* Workshop header */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {workshop.tags?.map(tag => (
            <Badge key={tag} variant="info">{tag}</Badge>
          ))}
          <Badge variant={workshop.status === 'Approved' ? 'approved' : workshop.status === 'Pending' ? 'pending' : 'rejected'}>
            {workshop.status}
          </Badge>
        </div>

        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-ink)] mb-2">
          {workshop.title}
        </h1>
        <p className="text-[15px] text-[var(--color-ink-secondary)] leading-relaxed mb-6 max-w-2xl">
          {workshop.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2 text-[14px] text-[var(--color-ink-secondary)]">
            <User size={16} className="text-[var(--color-primary)]" />
            {workshop.speaker}
          </div>
          <div className="flex items-center gap-2 text-[14px] text-[var(--color-ink-secondary)]">
            <Calendar size={16} className="text-[var(--color-primary)]" />
            {new Date(workshop.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 text-[14px] text-[var(--color-ink-secondary)]">
            <Clock size={16} className="text-[var(--color-primary)]" />
            {new Date(workshop.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2 text-[14px] text-[var(--color-ink-secondary)]">
            <MapPin size={16} className="text-[var(--color-primary)]" />
            {workshop.location}
          </div>
        </div>

        <CapacityBar current={workshop.currentAttendees} capacity={workshop.capacity} />
      </Card>

      {/* Attendee roster + Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isOrganizer && <AttendeeRoster workshopId={workshop.id} capacity={workshop.capacity} />}
        <ResourceManager workshopId={workshop.id} isOrganizer={isOrganizer} />
      </div>
    </PageWrapper>
  );
}
