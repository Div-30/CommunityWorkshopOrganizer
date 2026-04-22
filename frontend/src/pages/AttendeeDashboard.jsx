import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { workshopAPI, registrationAPI } from '../services/api';
import { WORKSHOP_TAGS } from '../utils/constants';

const FILTER_TAGS = ['All', ...WORKSHOP_TAGS.slice(0, 8)];

export function AttendeeDashboard() {
  const { user } = useAuth();
  const { error: showError } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const [workshops, setWorkshops] = useState([]);
  const [rsvpIds, setRsvpIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [wsData, regData] = await Promise.all([
          workshopAPI.getAll(),
          registrationAPI.getMyRegistrations()
        ]);
        setWorkshops(wsData || []);
        setRsvpIds(new Set((regData || []).map(r => r.workshopId)));
      } catch (err) {
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
    .filter((w) => {
      const matchesSearch =
        w.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.speakerName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

  const handleRegister = (workshopId, e) => {
    e.stopPropagation();
    navigate(`/payments/${workshopId}`);
  };

  return (
    <PageWrapper
      role="attendee"
      title={`${greeting}, ${firstName}`}
      subtitle="Ready to learn something new today?"
    >
      {/* Search + Filter */}
      <div className="mb-6 space-y-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search workshops, speakers..."
        />
        <div className="flex gap-2 flex-wrap">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`
                rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-100 cursor-pointer
                ${activeTag === tag
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <SkeletonLoader className="h-64 rounded-2xl" />
          <SkeletonLoader className="h-64 rounded-2xl" />
          <SkeletonLoader className="h-64 rounded-2xl" />
        </div>
      ) : filteredWorkshops.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nothing here yet"
          description="No workshops match your search. Try different keywords or check back later!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredWorkshops.map((workshop) => {
            const currentAttendees = workshop.registrations?.length || 0;
            const isFull = currentAttendees >= workshop.capacity;
            const isRsvpd = rsvpIds.has(workshop.workshopId);

            return (
              <Card
                key={workshop.workshopId}
                hover
                className={`cursor-pointer ${isFull && !isRsvpd ? 'opacity-70' : ''}`}
                onClick={() => navigate(`/workshops/${workshop.workshopId}`)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="info">Workshop</Badge>
                  {isFull && <Badge variant="soldout">Sold out</Badge>}
                </div>

                <h3 className="text-[16px] font-semibold text-slate-900 leading-snug mb-1.5">
                  {workshop.title}
                </h3>
                <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-4">
                  {workshop.description}
                </p>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-[13px] text-slate-500">
                    <User size={14} className="text-indigo-600" />
                    {workshop.speakerName || 'TBA'}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-slate-500">
                    <Calendar size={14} className="text-indigo-600" />
                    {new Date(workshop.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-slate-500">
                    <Clock size={14} className="text-indigo-600" />
                    {new Date(workshop.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-slate-500">
                    <MapPin size={14} className="text-indigo-600" />
                    TBA Campus
                  </div>
                </div>

                <CapacityBar current={currentAttendees} capacity={workshop.capacity} className="mb-4" />

                {isRsvpd ? (
                  <Button variant="secondary" className="w-full" disabled>
                    You are going!
                  </Button>
                ) : isFull ? (
                  <Button variant="ghost" className="w-full" onClick={(e) => e.stopPropagation()}>
                    Join Waitlist
                  </Button>
                ) : (
                  <Button className="w-full" onClick={(e) => handleRegister(workshop.workshopId, e)}>
                    Register Now
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
