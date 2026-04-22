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
  CreditCard, CheckCircle, Users, BookOpen,
  Link as LinkIcon, FileText, Mic, Ticket,
  BadgeCheck, AlertCircle,
} from 'lucide-react';
import { workshopAPI, registrationAPI, resourceAPI } from '../services/api';

const STATUS_CONFIG = {
  Approved: { variant: 'approved', label: 'Live', icon: BadgeCheck, color: 'var(--color-success)' },
  Pending:  { variant: 'pending',  label: 'Under Review', icon: AlertCircle, color: 'var(--color-warning)' },
  Rejected: { variant: 'rejected', label: 'Not Approved', icon: AlertCircle, color: 'var(--color-danger)' },
};

// Gradient banner colors per workshop id (cycles)
const BANNER_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
  'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
];

export function WorkshopDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [workshop, setWorkshop] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const role = user?.role?.toLowerCase() || 'attendee';

  useEffect(() => {
    async function loadWorkshop() {
      try {
        const [wsData, regData] = await Promise.all([
          workshopAPI.getById(id),
          registrationAPI.getMyRegistrations().catch(() => []),
        ]);
        setWorkshop(wsData);
        setIsRegistered(regData.some(r => r.workshopId === Number(id)));

        // Load resources (non-fatal)
        try {
          const res = await resourceAPI.getByWorkshop(id);
          setResources(Array.isArray(res) ? res : []);
        } catch { /* resources are optional */ }
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
      navigate(`/payments/${id}`);
    } else {
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

  const currentAttendees = workshop.registrations?.length || 0;
  const isFull = currentAttendees >= (workshop.capacity || 0);
  const spotsLeft = (workshop.capacity || 0) - currentAttendees;
  const fillPct = Math.min(100, Math.round((currentAttendees / (workshop.capacity || 1)) * 100));
  const statusCfg = STATUS_CONFIG[workshop.status] || STATUS_CONFIG.Pending;
  const bannerGradient = BANNER_GRADIENTS[(Number(id) - 1) % BANNER_GRADIENTS.length];

  const eventDate = workshop.eventDate ? new Date(workshop.eventDate) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Date TBA';
  const formattedTime = eventDate
    ? eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : 'Time TBA';

  return (
    <PageWrapper role={role}>
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-5">
        <ArrowLeft size={14} /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Main content ─────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* HERO CARD with gradient banner */}
          <Card padding={false} className="overflow-hidden">
            {/* Banner */}
            <div
              className="relative h-[160px] flex items-end px-6 pb-5"
              style={{ background: bannerGradient }}
            >
              {/* Large decorative initial */}
              <div className="absolute top-4 right-6 text-[80px] font-black text-white/10 leading-none select-none">
                {workshop.title.charAt(0)}
              </div>

              {/* Badge row */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-[12px] font-medium text-white">
                  <BookOpen size={12} />
                  Workshop
                </span>
                {workshop.isPaid ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/90 px-3 py-1 text-[12px] font-semibold text-amber-900">
                    <CreditCard size={12} />
                    {Number(workshop.price).toLocaleString()} RWF
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-400/90 px-3 py-1 text-[12px] font-semibold text-emerald-900">
                    Free
                  </span>
                )}
                {isFull && (
                  <span className="inline-flex items-center rounded-full bg-red-500/90 px-3 py-1 text-[12px] font-semibold text-white">
                    Sold Out
                  </span>
                )}
              </div>
            </div>

            {/* Title + status */}
            <div className="px-6 pt-5 pb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-ink)] leading-tight flex-1">
                  {workshop.title}
                </h1>
                <Badge variant={statusCfg.variant} className="shrink-0 mt-1">
                  {statusCfg.label}
                </Badge>
              </div>

              {/* Key info pills row */}
              <div className="flex flex-wrap gap-3 mt-4">
                {[
                  { icon: Calendar, text: formattedDate },
                  { icon: Clock,    text: formattedTime },
                  { icon: MapPin,   text: 'TBA Campus' },
                  { icon: Mic,      text: workshop.speakerName || 'Speaker TBA' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-hover)] px-3 py-2">
                    <Icon size={13} className="text-[var(--color-primary)] shrink-0" />
                    <span className="text-[13px] text-[var(--color-ink-secondary)]">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* ABOUT */}
          <Card>
            <h2 className="text-[17px] font-semibold text-[var(--color-ink)] mb-3 flex items-center gap-2">
              <FileText size={17} className="text-[var(--color-primary)]" />
              About this Workshop
            </h2>
            <p className="text-[15px] text-[var(--color-ink-secondary)] leading-relaxed whitespace-pre-line">
              {workshop.description || 'No description provided.'}
            </p>
          </Card>

          {/* SPEAKER / ORGANIZER */}
          <Card>
            <h2 className="text-[17px] font-semibold text-[var(--color-ink)] mb-4 flex items-center gap-2">
              <Mic size={17} className="text-[var(--color-primary)]" />
              Your Instructor
            </h2>
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white text-[22px] font-bold"
                style={{ background: bannerGradient }}
              >
                {(workshop.speakerName || workshop.organizer?.fullName || 'S').charAt(0)}
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[var(--color-ink)]">
                  {workshop.speakerName || 'TBA'}
                </p>
                <p className="text-[13px] text-[var(--color-ink-tertiary)]">Workshop Host</p>
                {workshop.organizer && (
                  <p className="text-[12px] text-[var(--color-ink-tertiary)] mt-0.5">
                    Organised by <span className="font-medium text-[var(--color-ink-secondary)]">{workshop.organizer.fullName}</span>
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* RESOURCES (if any) */}
          {resources.length > 0 && (
            <Card>
              <h2 className="text-[17px] font-semibold text-[var(--color-ink)] mb-3 flex items-center gap-2">
                <LinkIcon size={17} className="text-[var(--color-primary)]" />
                Workshop Resources
              </h2>
              <ul className="space-y-2">
                {resources.map(r => (
                  <li key={r.resourceId}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all group"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)] group-hover:bg-[var(--color-primary)]">
                        <LinkIcon size={14} className="text-[var(--color-primary)] group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[14px] font-medium text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors">
                        {r.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* ── RIGHT: Sidebar ─────────────────────────────── */}
        <div className="space-y-5">

          {/* REGISTRATION CARD */}
          <Card>
            <h3 className="text-[16px] font-semibold text-[var(--color-ink)] mb-4 flex items-center gap-2">
              <Ticket size={16} className="text-[var(--color-primary)]" />
              Registration
            </h3>

            {/* Price display */}
            <div className={`rounded-xl p-4 mb-4 ${workshop.isPaid ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-emerald-50 dark:bg-emerald-950/30'}`}
              style={{ background: workshop.isPaid ? 'var(--color-warning-light)' : 'var(--color-success-light)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[var(--color-ink-secondary)]">
                  {workshop.isPaid ? 'Registration Fee' : 'Admission'}
                </span>
                <span
                  className="text-[22px] font-extrabold"
                  style={{ color: workshop.isPaid ? 'var(--color-warning)' : 'var(--color-success)' }}
                >
                  {workshop.isPaid ? `${Number(workshop.price).toLocaleString()} RWF` : 'FREE'}
                </span>
              </div>
            </div>

            {/* Capacity bar */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-secondary)]">
                  <Users size={13} />
                  Availability
                </span>
                <span className="text-[13px] font-semibold text-[var(--color-ink)]">
                  {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
                </span>
              </div>
              <CapacityBar current={currentAttendees} capacity={workshop.capacity} showLabel={false} />
              <p className="text-[11px] text-[var(--color-ink-tertiary)] mt-1.5 text-right">
                {currentAttendees} / {workshop.capacity} registered
              </p>
            </div>

            {/* CTA */}
            {isRegistered ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 rounded-xl px-4 py-3"
                  style={{ background: 'var(--color-success-light)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                  <p className="text-[14px] font-semibold" style={{ color: 'var(--color-success)' }}>
                    You're registered!
                  </p>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => navigate('/my-schedule')}>
                  View My Schedule
                </Button>
              </div>
            ) : isFull ? (
              <div className="space-y-3">
                <div className="rounded-xl px-4 py-3" style={{ background: 'var(--color-warning-light)' }}>
                  <p className="text-[14px] font-medium" style={{ color: 'var(--color-warning)' }}>
                    This workshop is full
                  </p>
                </div>
                <Button variant="ghost" className="w-full" disabled>
                  Join Waitlist
                </Button>
              </div>
            ) : workshop.status !== 'Approved' ? (
              <div className="rounded-xl px-4 py-3" style={{ background: 'var(--color-surface-hover)' }}>
                <p className="text-[13px] text-[var(--color-ink-secondary)]">
                  Registration opens once this workshop is approved.
                </p>
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
                  <>
                    <CheckCircle size={16} />
                    Register Now — It's Free!
                  </>
                )}
              </Button>
            )}
          </Card>

          {/* QUICK FACTS */}
          <Card>
            <h3 className="text-[15px] font-semibold text-[var(--color-ink)] mb-3">Quick Facts</h3>
            <dl className="space-y-3">
              {[
                {
                  label: 'Date',
                  value: formattedDate,
                  icon: Calendar,
                },
                {
                  label: 'Time',
                  value: formattedTime,
                  icon: Clock,
                },
                {
                  label: 'Capacity',
                  value: `${workshop.capacity} seats total`,
                  icon: Users,
                },
                {
                  label: 'Status',
                  value: statusCfg.label,
                  icon: BadgeCheck,
                },
                {
                  label: 'Posted',
                  value: new Date(workshop.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  }),
                  icon: BookOpen,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)]">
                    <Icon size={13} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)]">{label}</p>
                    <p className="text-[13px] font-medium text-[var(--color-ink)]">{value}</p>
                  </div>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
