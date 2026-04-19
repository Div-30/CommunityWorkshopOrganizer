import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/shared/EmptyState';
import { Calendar, Clock, MapPin, FileText, X, BookOpen } from 'lucide-react';
import { MOCK_WORKSHOPS, MOCK_REGISTRATIONS } from '../utils/mockData';

export function MySchedulePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  const registeredWorkshops = MOCK_REGISTRATIONS.map((reg) => {
    const workshop = MOCK_WORKSHOPS.find((w) => w.id === reg.workshopId);
    return { ...workshop, registrationId: reg.id, registeredAt: reg.registeredAt };
  }).filter(Boolean);

  const now = new Date();
  const upcoming = registeredWorkshops.filter((w) => new Date(w.date) >= now);
  const past = registeredWorkshops.filter((w) => new Date(w.date) < now);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: upcoming.length },
    { id: 'past', label: 'Past', icon: BookOpen, count: past.length },
  ];

  const workshops = activeTab === 'upcoming' ? upcoming : past;

  // Group by date
  const grouped = {};
  workshops.forEach((w) => {
    const dateKey = new Date(w.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(w);
  });

  return (
    <PageWrapper
      role="attendee"
      title="My Schedule"
      subtitle="Your upcoming and past workshops"
    >
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {workshops.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={activeTab === 'upcoming' ? 'Nothing scheduled yet' : 'No past workshops'}
          description={
            activeTab === 'upcoming'
              ? "You haven't registered for any upcoming workshops. Go discover something exciting!"
              : "You'll see your completed workshops here."
          }
          actionLabel={activeTab === 'upcoming' ? 'Discover workshops' : undefined}
          onAction={activeTab === 'upcoming' ? () => window.location.href = '/dashboard' : undefined}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-[13px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)] mb-3 px-1">
                {date}
              </h3>
              <div className="space-y-3">
                {items.map((workshop) => (
                  <Card key={workshop.registrationId}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Time badge */}
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
                        <span className="text-[16px] font-bold text-[var(--color-primary)]">
                          {new Date(workshop.date).getDate()}
                        </span>
                        <span className="text-[11px] font-medium text-[var(--color-primary)] uppercase">
                          {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-semibold text-[var(--color-ink)]">
                          {workshop.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-secondary)]">
                            <Clock size={13} />
                            {new Date(workshop.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-secondary)]">
                            <MapPin size={13} />
                            {workshop.location}
                          </span>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          {workshop.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="info">{tag}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        {activeTab === 'upcoming' && (
                          <>
                            <Button variant="secondary" size="sm">
                              <FileText size={14} />
                              Resources
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]">
                              <X size={14} />
                              Cancel
                            </Button>
                          </>
                        )}
                        {activeTab === 'past' && (
                          <Button variant="secondary" size="sm">
                            <FileText size={14} />
                            Resources
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
