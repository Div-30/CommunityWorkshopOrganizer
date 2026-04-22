import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchBar } from '../components/ui/SearchBar';
import { CapacityBar } from '../components/ui/CapacityBar';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { EmptyState } from '../components/shared/EmptyState';
import {
  Calendar, User, Clock, Sparkles, CreditCard,
  ArrowRight, CheckCircle, Users,
} from 'lucide-react';
import { workshopAPI, registrationAPI } from '../services/api';

// Rotating gradient palette for card accent bars
const GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
  'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
];

export function AttendeeDashboard() {
  const { user } = useAuth();
  const { error: showError } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [workshops, setWorkshops] = useState([]);
  const [rsvpIds, setRsvpIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [wsData, regData] = await Promise.all([
          workshopAPI.getAll(),
          registrationAPI.getMyRegistrations().catch(() => []),
        ]);
        setWorkshops(wsData || []);
        setRsvpIds(new Set((regData || []).map(r => r.workshopId)));
      } catch {
        showError('Failed to load workshops. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const filteredWorkshops = workshops
    .filter(w => w.status === 'Approved')
    .filter(w =>
      (w.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.speakerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <PageWrapper
      role="attendee"
      title={`${greeting}, ${firstName} 👋`}
      subtitle="Discover workshops and grow your skills"
    >
      {/* Search */}
      <div className="mb-7">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search workshops by title, speaker or topic..."
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <SkeletonLoader key={i} className="h-72 rounded-2xl" />)}
        </div>
      ) : filteredWorkshops.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No workshops found"
          description={searchTerm
            ? `No results for "${searchTerm}". Try different keywords.`
            : 'No workshops are available right now. Check back soon!'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredWorkshops.map((workshop, idx) => {
            const currentAttendees = workshop.registrations?.length || 0;
            const isFull = currentAttendees >= workshop.capacity;
            const isRsvpd = rsvpIds.has(workshop.workshopId);
            const gradient = GRADIENTS[idx % GRADIENTS.length];
            const spotsLeft = workshop.capacity - currentAttendees;

            return (
              <article
                key={workshop.workshopId}
                onClick={() => navigate(`/workshops/${workshop.workshopId}`)}
                className="group relative flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                {/* Gradient accent bar */}
                <div
                  className="h-1.5 w-full shrink-0 transition-all duration-300 group-hover:h-2"
                  style={{ background: gradient }}
                />

                <div className="flex flex-col flex-1 p-5">
                  {/* Top badge row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                      {isRsvpd ? (
                        <Badge variant="approved">
                          <CheckCircle size={11} className="mr-1" />
                          Registered
                        </Badge>
                      ) : (
                        <Badge variant="info">Workshop</Badge>
                      )}
                      {isFull && !isRsvpd && <Badge variant="soldout">Full</Badge>}
                    </div>

                    {/* Price pill */}
                    {workshop.isPaid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[12px] font-semibold text-amber-700">
                        <CreditCard size={11} />
                        {Number(workshop.price).toLocaleString()} RWF
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700">
                        Free
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-[16px] font-bold text-[var(--color-ink)] leading-snug mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {workshop.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[13px] text-[var(--color-ink-tertiary)] leading-relaxed line-clamp-2 mb-4 flex-1">
                    {workshop.description || 'Click to learn more about this workshop.'}
                  </p>

                  {/* Info pills */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      {
                        icon: User,
                        text: workshop.speakerName || 'TBA',
                        label: 'Speaker',
                      },
                      {
                        icon: Calendar,
                        text: workshop.eventDate
                          ? new Date(workshop.eventDate).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })
                          : 'TBA',
                        label: 'Date',
                      },
                      {
                        icon: Clock,
                        text: workshop.eventDate
                          ? new Date(workshop.eventDate).toLocaleTimeString('en-US', {
                              hour: 'numeric', minute: '2-digit',
                            })
                          : 'TBA',
                        label: 'Time',
                      },
                      {
                        icon: Users,
                        text: isFull ? 'Full' : `${spotsLeft} left`,
                        label: 'Spots',
                      },
                    ].map(({ icon: Icon, text, label }) => (
                      <div key={label} className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-hover)] px-2.5 py-2">
                        <Icon size={12} className="text-[var(--color-primary)] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-tertiary)] leading-none mb-0.5">{label}</p>
                          <p className="text-[12px] font-medium text-[var(--color-ink)] truncate">{text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Capacity bar */}
                  <CapacityBar current={currentAttendees} capacity={workshop.capacity} className="mb-4" />

                  {/* CTA */}
                  {isRsvpd ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/my-schedule'); }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold border-2 border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle size={14} />
                      You're going! · View Schedule
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/workshops/${workshop.workshopId}`); }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:gap-3"
                      style={{ background: gradient }}
                    >
                      {workshop.isPaid ? (
                        <>
                          <CreditCard size={14} />
                          View & Pay · {Number(workshop.price).toLocaleString()} RWF
                        </>
                      ) : (
                        <>
                          View Details & Register
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
