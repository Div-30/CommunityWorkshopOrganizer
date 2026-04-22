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
import {
  Calendar, Clock, MapPin, User, ArrowLeft,
  CreditCard, CheckCircle, Users, Tag, BookOpen,
} from 'lucide-react';
import { workshopAPI, registrationAPI } from '../services/api';

const STATUS_VARIANT = { Approved: 'approved', Pending: 'pending', Rejected: 'rejected' };
const STATUS_LABEL = { Approved: 'Live', Pending: 'Under Review', Rejected: 'Not Approved' };

export function WorkshopDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

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

  const handleRegister = async () => {
    if (workshop.isPaid) {
      // Paid workshop → go through payment page
      navigate(`/payments/${id}`);
    } else {
      // Free workshop → register directly
      setRegistering(true);
      try {
        await registrationAPI.register(Number(id));
        setIsRegistered(true);
        setWorkshop(prev => ({
          ...prev,
          registrations: [...(prev.registrations || []), {}],
        }));
        success("You're registered! See you there 🎉");
      } catch (err) {
        showError(err.message || 'Failed to register. Please try again.');
      } finally {
        setRegistering(false);
      }
    }
  };

  const role = user?.role?.toLowerCase() || 'attendee';
  const currentAttendees = workshop?.registrations?.length || 0;
  const isFull = currentAttendees >= (workshop?.capacity || 0);
  const spotsLeft = (workshop?.capacity || 0) - currentAttendees;

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
          <p className="text-[var(--color-ink-secondary)]">Workshop not found.</p>
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

        {/* ── Left: Main Content ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Hero Card */}
          <Card>
            {/* Status badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Badge variant="info">
                <BookOpen size={12} className="mr-1" />
                Workshop
              </Badge>
              {workshop.status && (
                <Badge variant={STATUS_VARIANT[workshop.status] || 'default'}>
                  {STATUS_LABEL[workshop.status] || workshop.status}
                </Badge>
              )}
              {workshop.isPaid ? (
                <Badge variant="warning">
                  <CreditCard size={12} className="mr-1" />
                  Paid · {Number(workshop.price).toLocaleString()} RWF
                </Badge>
              ) : (
                <Badge variant="success">Free</Badge>
              )}
              {isFull && <Badge variant="soldout">Sold Out</Badge>}
            </div>

            {/* Title */}
            <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-ink)] leading-tight mb-2">
              {workshop.title}
            </h1>

            {/* Short description teaser */}
            <p className="text-[15px] text-[var(--color-ink-secondary)] leading-relaxed mb-6 line-clamp-3">
              {workshop.description}
            </p>

            {/* Key info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: User,
                  label: 'Speaker',
                  value: workshop.speakerName || 'TBA',
                },
                {
                  icon: Calendar,
                  label: 'Date',
                  value: new Date(workshop.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                  }),
                },
                {
                  icon: Clock,
                  label: 'Time',
                  value: new Date(workshop.eventDate).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: '2-digit',
                  }),
                },
                {
                  icon: MapPin,
                  label: 'Location',
                  value: 'TBA Campus',
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 rounded-xl bg-[var(--color-surface-hover)] px-4 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)]">
                    <Icon size={15} className="text-[var(--color-primary)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)]">
                      {label}
                    </p>
                    <p className="text-[14px] font-medium text-[var(--color-ink)] truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* About Section */}
          <Card>
            <h2 className="text-[18px] font-semibold text-[var(--color-ink)] mb-4">
              About this workshop
            </h2>
            <p className="text-[15px] text-[var(--color-ink-secondary)] leading-relaxed whitespace-pre-line">
              {workshop.description}
            </p>
          </Card>

          {/* Speaker Card */}
          <Card>
            <h2 className="text-[18px] font-semibold text-[var(--color-ink)] mb-4">Your instructor</h2>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
                <User size={24} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[var(--color-ink)]">
                  {workshop.speakerName || 'TBA'}
                </p>
                <p className="text-[13px] text-[var(--color-ink-tertiary)]">Workshop Host</p>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Right: Sidebar ───────────────────────────────────── */}
        <div className="space-y-5">

          {/* Registration Card */}
          <Card>
            <h3 className="text-[16px] font-semibold text-[var(--color-ink)] mb-4">Registration</h3>

            {/* Pricing */}
            <div className={`rounded-xl p-4 mb-4 ${workshop.isPaid ? 'bg-[var(--color-warning-light)]' : 'bg-[var(--color-success-light)]'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[var(--color-ink-secondary)]">
                  {workshop.isPaid ? 'Registration Fee' : 'Admission'}
                </span>
                <span className={`text-[18px] font-bold ${workshop.isPaid ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'}`}>
                  {workshop.isPaid ? `${Number(workshop.price).toLocaleString()} RWF` : 'Free'}
                </span>
              </div>
            </div>

            {/* Capacity */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-secondary)]">
                  <Users size={13} />
                  Spots
                </span>
                <span className="text-[13px] font-semibold text-[var(--color-ink)]">
                  {spotsLeft} of {workshop.capacity} left
                </span>
              </div>
              <CapacityBar current={currentAttendees} capacity={workshop.capacity} showLabel={false} />
            </div>

            {/* CTA */}
            {isRegistered ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-xl bg-[var(--color-success-light)] px-4 py-3">
                  <CheckCircle size={16} className="text-[var(--color-success)]" />
                  <p className="text-[14px] font-medium text-[var(--color-success)]">
                    You are registered!
                  </p>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => navigate('/my-schedule')}>
                  View My Schedule
                </Button>
              </div>
            ) : isFull ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-[var(--color-warning-light)] px-4 py-3">
                  <p className="text-[14px] font-medium text-[var(--color-warning)]">
                    This workshop is full
                  </p>
                </div>
                <Button variant="ghost" className="w-full" disabled>
                  Join Waitlist
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={handleRegister}
                loading={registering}
              >
                {workshop.isPaid ? (
                  <>
                    <CreditCard size={16} />
                    Pay & Register · {Number(workshop.price).toLocaleString()} RWF
                  </>
                ) : (
                  'Register Now — It\'s Free!'
                )}
              </Button>
            )}
          </Card>

          {/* Quick Facts Card */}
          <Card>
            <h3 className="text-[15px] font-semibold text-[var(--color-ink)] mb-3">Quick Facts</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[13px] text-[var(--color-ink-secondary)]">
                <Tag size={13} className="text-[var(--color-primary)]" />
                {workshop.status === 'Approved' ? 'Officially approved' : 'Pending approval'}
              </li>
              <li className="flex items-center gap-2 text-[13px] text-[var(--color-ink-secondary)]">
                <Users size={13} className="text-[var(--color-primary)]" />
                {workshop.capacity} total seats
              </li>
              <li className="flex items-center gap-2 text-[13px] text-[var(--color-ink-secondary)]">
                <Calendar size={13} className="text-[var(--color-primary)]" />
                Added {new Date(workshop.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
