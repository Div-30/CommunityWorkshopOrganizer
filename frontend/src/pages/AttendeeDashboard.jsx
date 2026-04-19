import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchBar } from '../components/ui/SearchBar';
import { CapacityBar } from '../components/ui/CapacityBar';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { EmptyState } from '../components/shared/EmptyState';
import { Calendar, MapPin, User, Clock, Sparkles } from 'lucide-react';
import { MOCK_WORKSHOPS, MOCK_REGISTRATIONS } from '../utils/mockData';
import { WORKSHOP_TAGS } from '../utils/constants';

const FILTER_TAGS = ['All', ...WORKSHOP_TAGS.slice(0, 8)];

export function AttendeeDashboard() {
  const { user } = useAuth();
  const { success } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [rsvpIds, setRsvpIds] = useState(new Set(MOCK_REGISTRATIONS.map(r => r.workshopId)));

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const approvedWorkshops = MOCK_WORKSHOPS.filter(w => w.status === 'Approved');

  const filteredWorkshops = approvedWorkshops.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = activeTag === 'All' || w.tags?.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const handleRsvp = (workshopId) => {
    setRsvpIds(prev => new Set([...prev, workshopId]));
    success('Spot saved! See you there 🎉');
  };

  return (
    <PageWrapper
      role="attendee"
      title={`${greeting}, ${firstName} 👋`}
      subtitle="Ready to learn something new today?"
    >
      {/* Search + Filter */}
      <div className="mb-6 space-y-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search workshops, speakers..."
        />

        {/* Tag filter pills */}
        <div className="flex gap-2 flex-wrap">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`
                rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-100 cursor-pointer
                ${activeTag === tag
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Workshop Grid */}
      {filteredWorkshops.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nothing here yet"
          description="No workshops match your search. Try different keywords or check back later!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredWorkshops.map((workshop) => {
            const isFull = workshop.currentAttendees >= workshop.capacity;
            const isRsvpd = rsvpIds.has(workshop.id);

            return (
              <Card key={workshop.id} hover className={isFull && !isRsvpd ? 'opacity-70' : ''}>
                {/* Tags */}
                <div className="flex items-center gap-2 mb-3">
                  {workshop.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="info">{tag}</Badge>
                  ))}
                  {isFull && <Badge variant="soldout">Sold out</Badge>}
                </div>

                {/* Title + Description */}
                <h3 className="text-[16px] font-semibold text-[var(--color-ink)] leading-snug mb-1.5">
                  {workshop.title}
                </h3>
                <p className="text-[13px] text-[var(--color-ink-secondary)] leading-relaxed line-clamp-2 mb-4">
                  {workshop.description}
                </p>

                {/* Metadata */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-[13px] text-[var(--color-ink-secondary)]">
                    <User size={14} className="text-[var(--color-primary)]" />
                    {workshop.speaker}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[var(--color-ink-secondary)]">
                    <Calendar size={14} className="text-[var(--color-primary)]" />
                    {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[var(--color-ink-secondary)]">
                    <Clock size={14} className="text-[var(--color-primary)]" />
                    {new Date(workshop.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[var(--color-ink-secondary)]">
                    <MapPin size={14} className="text-[var(--color-primary)]" />
                    {workshop.location}
                  </div>
                </div>

                {/* Capacity */}
                <CapacityBar
                  current={workshop.currentAttendees}
                  capacity={workshop.capacity}
                  className="mb-4"
                />

                {/* Action */}
                {isRsvpd ? (
                  <Button variant="secondary" className="w-full" disabled>
                    ✓ You're going!
                  </Button>
                ) : isFull ? (
                  <Button variant="ghost" className="w-full">
                    Join Waitlist
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleRsvp(workshop.id)}>
                    Count me in!
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
