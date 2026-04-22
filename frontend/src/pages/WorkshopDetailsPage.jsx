import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CapacityBar } from '../components/ui/CapacityBar';
import { Spinner } from '../components/ui/Spinner';
import { Calendar, Clock, MapPin, User, ArrowLeft, CreditCard } from 'lucide-react';
import { workshopAPI, registrationAPI } from '../services/api';

export function WorkshopDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: showError } = useToast();
  
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    async function loadWorkshop() {
      try {
        const [wsData, regData] = await Promise.all([
          workshopAPI.getById(id),
          registrationAPI.getMyRegistrations()
        ]);
        setWorkshop(wsData);
        setIsRegistered(regData.some(r => r.workshopId === Number(id)));
      } catch (err) {
        showError('Failed to load workshop details');
      } finally {
        setLoading(false);
      }
    }
    loadWorkshop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRegister = () => {
    navigate(`/payments/${id}`);
  };

  const role = user?.role?.toLowerCase() || 'attendee';
  const currentAttendees = workshop?.registrations?.length || 0;
  const isFull = currentAttendees >= (workshop?.capacity || 0);

  if (loading) {
    return (
      <PageWrapper role={role}>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (!workshop) {
    return (
      <PageWrapper role={role}>
        <Card>
          <p className="text-slate-500">Workshop not found</p>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper role={role}>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft size={14} />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="info">Workshop</Badge>
              {workshop.status && (
                <Badge variant={workshop.status === 'Approved' ? 'approved' : workshop.status === 'Pending' ? 'pending' : 'rejected'}>
                  {workshop.status}
                </Badge>
              )}
              {isFull && <Badge variant="soldout">Sold out</Badge>}
            </div>

            <h1 className="text-[28px] font-semibold tracking-tight text-slate-900 mb-3">
              {workshop.title}
            </h1>
            <p className="text-[15px] text-slate-600 leading-relaxed mb-6">
              {workshop.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-[14px] text-slate-600">
                <User size={16} className="text-indigo-600" />
                <span className="font-medium">Speaker:</span> {workshop.speakerName || 'TBA'}
              </div>
              <div className="flex items-center gap-2 text-[14px] text-slate-600">
                <Calendar size={16} className="text-indigo-600" />
                <span className="font-medium">Date:</span> {new Date(workshop.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 text-[14px] text-slate-600">
                <Clock size={16} className="text-indigo-600" />
                <span className="font-medium">Time:</span> {new Date(workshop.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>
              <div className="flex items-center gap-2 text-[14px] text-slate-600">
                <MapPin size={16} className="text-indigo-600" />
                <span className="font-medium">Location:</span> TBA Campus
              </div>
            </div>

            <CapacityBar current={currentAttendees} capacity={workshop.capacity} />
          </Card>

          {/* About Section */}
          <Card>
            <h2 className="text-[18px] font-semibold text-slate-900 mb-3">About this workshop</h2>
            <p className="text-[14px] text-slate-600 leading-relaxed">
              {workshop.description}
            </p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-[16px] font-semibold text-slate-900 mb-4">Registration</h3>
            
            {isRegistered ? (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-[14px] text-emerald-700 font-medium">You are registered</p>
                </div>
                <Button variant="secondary" className="w-full" disabled>
                  Already Registered
                </Button>
              </div>
            ) : isFull ? (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-[14px] text-amber-700 font-medium">This workshop is full</p>
                </div>
                <Button variant="ghost" className="w-full">
                  Join Waitlist
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] text-slate-600">Available seats</span>
                    <span className="text-[14px] font-semibold text-slate-900">
                      {workshop.capacity - currentAttendees} / {workshop.capacity}
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handleRegister}
                >
                  <CreditCard size={16} />
                  Register Now
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-[16px] font-semibold text-slate-900 mb-3">Speaker</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <User size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-slate-900">{workshop.speakerName || 'TBA'}</p>
                <p className="text-[13px] text-slate-500">Workshop Host</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
