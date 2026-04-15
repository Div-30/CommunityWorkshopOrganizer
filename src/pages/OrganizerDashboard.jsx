import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, LayoutDashboard, Users, TrendingUp, Flame, Pencil, UserCheck } from 'lucide-react';
import { mockWorkshops } from '../data/mockData';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function OrganizerDashboard() {
  const [workshops, setWorkshops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'Organizer') navigate('/login');

    const userWorkshops = mockWorkshops.filter(
      (w) => w.speaker === 'Oliver Organizer' || w.speaker === 'Divin Paul'
    );
    const newWorkshops = JSON.parse(localStorage.getItem('createdWorkshops') || '[]');
    setWorkshops([...userWorkshops, ...newWorkshops]);
  }, [navigate]);

  const totalAttendees = workshops.reduce((acc, w) => acc + w.registeredCount, 0);
  const totalCapacity = workshops.reduce((acc, w) => acc + w.capacity, 0);
  const avgFill =
    workshops.length > 0
      ? Math.round(
          (workshops.reduce((acc, w) => acc + w.registeredCount / w.capacity, 0) /
            workshops.length) *
            100
        )
      : 0;
  const fullWorkshops = workshops.filter((w) => w.registeredCount >= w.capacity).length;

  const stats = [
    {
      label: 'Workshops',
      value: workshops.length,
      icon: LayoutDashboard,
      gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      glow: 'rgba(124,58,237,0.12)',
      border: 'rgba(124,58,237,0.2)',
    },
    {
      label: 'Total Attendees',
      value: totalAttendees,
      icon: Users,
      gradient: 'linear-gradient(135deg, #d946ef, #ec4899)',
      glow: 'rgba(217,70,239,0.12)',
      border: 'rgba(217,70,239,0.2)',
    },
    {
      label: 'Avg. Fill Rate',
      value: `${avgFill}%`,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
      glow: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.2)',
    },
    {
      label: 'Sold Out',
      value: fullWorkshops,
      icon: Flame,
      gradient: 'linear-gradient(135deg, #f43f5e, #f97316)',
      glow: 'rgba(244,63,94,0.12)',
      border: 'rgba(244,63,94,0.2)',
    },
  ];

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: 'var(--accent-violet)' }}
          >
            Organizer Portal
          </p>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Management Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Manage your workshops and track attendee capacity
          </p>
        </div>
        <Link to="/organizer/create">
          <Button size="md">
            <Plus size={16} /> Create Workshop
          </Button>
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={itemVariants}>
        {stats.map(({ label, value, icon: Icon, gradient, glow, border }, index) => (
          <motion.div
            key={label}
            className="rounded-[var(--radius-2xl)] p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: glow,
              border: `1px solid ${border}`,
            }}
            variants={itemVariants}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: gradient }}
            >
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p
                className="text-2xl font-bold"
                style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {value}
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                {label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Overall Capacity */}
      {totalCapacity > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-5">
            <div className="flex justify-between items-center mb-2.5">
              <p
                className="text-sm font-semibold"
                style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Overall Capacity Usage
              </p>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {totalAttendees}{' '}
                <span style={{ color: 'var(--text-tertiary)' }} className="font-normal">
                  / {totalCapacity} seats
                </span>
              </p>
            </div>
            <div
              className="w-full rounded-full h-3 overflow-hidden"
              style={{ background: 'var(--bg-muted)' }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalAttendees / totalCapacity) * 100, 100)}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                style={{ background: 'var(--gradient-hero)' }}
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Workshop List */}
      <motion.div variants={itemVariants}>
        <Card>
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--border-default)' }}
          >
            <h2
              className="font-bold"
              style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Your Active Workshops
            </h2>
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              {workshops.length} total
            </span>
          </div>

          <div>
            {workshops.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-5xl mb-4 opacity-60">📋</div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  No workshops yet
                </p>
                <p className="text-sm mt-1 mb-5" style={{ color: 'var(--text-tertiary)' }}>
                  Create your first workshop to get started
                </p>
                <Link to="/organizer/create">
                  <Button>
                    <Plus size={16} /> Create Workshop
                  </Button>
                </Link>
              </div>
            ) : (
              workshops.map((workshop, index) => {
                const fillPct = Math.round((workshop.registeredCount / workshop.capacity) * 100);
                const isFull = workshop.registeredCount >= workshop.capacity;

                return (
                  <motion.div
                    key={workshop.workshopId}
                    className="px-6 py-5 flex flex-col lg:flex-row gap-5 items-start lg:items-center transition-all duration-200"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    whileHover={{ backgroundColor: 'var(--bg-muted)' }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3
                          className="font-bold truncate"
                          style={{
                            color: 'var(--text-primary)',
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {workshop.title}
                        </h3>
                        {isFull && (
                          <span
                            className="flex-shrink-0 text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full"
                            style={{
                              background: 'var(--text-primary)',
                              color: 'var(--bg-surface)',
                            }}
                          >
                            Full
                          </span>
                        )}
                      </div>
                      <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(workshop.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {workshop.tags?.map((tag) => (
                          <Badge key={tag} tag={tag}>{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="w-full lg:w-56 flex-shrink-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                          Capacity
                        </span>
                        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          {workshop.registeredCount}{' '}
                          <span style={{ color: 'var(--text-tertiary)' }} className="font-normal">
                            / {workshop.capacity}
                          </span>
                        </span>
                      </div>
                      <div
                        className="w-full rounded-full h-2 overflow-hidden mb-3"
                        style={{ background: 'var(--bg-muted)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${fillPct}%` }}
                          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 + index * 0.05 }}
                          style={{
                            background: isFull
                              ? 'var(--accent-rose)'
                              : fillPct > 80
                              ? 'var(--accent-amber)'
                              : 'var(--accent-violet)',
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" className="flex-1 !text-[11px]">
                          <Pencil size={12} /> Edit
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1 !text-[11px]">
                          <UserCheck size={12} /> Attendees
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}