import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/shared/EmptyState';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { Calendar, Clock, MapPin, FileText, X, BookOpen } from 'lucide-react';
import { registrationAPI } from '../services/api';

export function MySchedulePage() {
  const { user } = useAuth();
  const { error: showError, success } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await registrationAPI.getMyRegistrations();
        setRegistrations(data || []);
      } catch (err) {
        showError('Failed to load your schedule.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id) => {
    try {
      await registrationAPI.cancel(id);
      success('Registration cancelled.');
      setRegistrations(prev => prev.filter(r => r.registrationId !== id));
    } catch (err) {
      showError(err.message || 'Failed to cancel registration.');
    }
  };

  const registeredWorkshops = registrations.map((reg) => {
    return { ...reg.workshop, registrationId: reg.registrationId, registeredAt: reg.registeredAt };
  }).filter(w => w.workshopId); // Ensure workshop exists

  const now = new Date();
  const upcoming = registeredWorkshops.filter((w) => new Date(w.eventDate) >= now);
  const past = registeredWorkshops.filter((w) => new Date(w.eventDate) < now);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: upcoming.length },
    { id: 'past', label: 'Past', icon: BookOpen, count: past.length },
  ];

  const workshops = activeTab === 'upcoming' ? upcoming : past;

  // Group by date
  const grouped = {};
  workshops.forEach((w) => {
    const dateKey = new Date(w.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
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

      {loading ? (
        <div className="space-y-6">
           <SkeletonLoader className="h-24 w-full" />
           <SkeletonLoader className="h-24 w-full" />
        </div>
      ) : workshops.length === 0 ? (
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
              <h3 className="text-[13px] font-medium uppercase tracking-wider text-slate-500 mb-3 px-1">
                {date}
              </h3>
              <div className="space-y-3">
                {items.map((workshop) => (
                  <Card key={workshop.registrationId}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Time badge */}
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50">
                        <span className="text-[16px] font-bold text-indigo-600">
                          {new Date(workshop.eventDate).getDate()}
                        </span>
                        <span className="text-[11px] font-medium text-indigo-600 uppercase">
                          {new Date(workshop.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-semibold text-slate-900">
                          {workshop.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
                            <Clock size={13} />
                            {new Date(workshop.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
                            <MapPin size={13} />
                            TBA Campus
                          </span>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                            <Badge variant="info">Workshop</Badge>
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
                            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleCancel(workshop.registrationId)}>
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
