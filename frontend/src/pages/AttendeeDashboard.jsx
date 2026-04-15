import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, User, Calendar, ExternalLink, X, BookOpen, Users } from 'lucide-react';
import { mockWorkshops } from '../data/mockData';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function AttendeeDashboard() {
  const [workshops, setWorkshops] = useState(mockWorkshops);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [rsvps, setRsvps] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'Attendee') navigate('/login');
    const savedRsvps = JSON.parse(localStorage.getItem('myRsvps') || '[]');
    setRsvps(savedRsvps);
  }, [navigate]);

  const handleRsvp = (workshop) => {
    const newRsvps = [...rsvps, workshop.workshopId];
    setRsvps(newRsvps);
    localStorage.setItem('myRsvps', JSON.stringify(newRsvps));
  };

  const handleCancelRsvp = (workshopId) => {
    const newRsvps = rsvps.filter((id) => id !== workshopId);
    setRsvps(newRsvps);
    localStorage.setItem('myRsvps', JSON.stringify(newRsvps));
  };

  const allTags = ['All', ...new Set(mockWorkshops.flatMap((w) => w.tags))];

  const filteredWorkshops = workshops.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === 'All' || w.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const mySchedule = workshops.filter((w) => rsvps.includes(w.workshopId));

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
            Welcome back
          </p>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Workshop Discovery
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Find and register for upcoming community workshops
          </p>
        </div>

        <div className="flex gap-3">
          <div
            className="rounded-xl px-5 py-3 text-center"
            style={{
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.15)',
            }}
          >
            <p className="text-xl font-bold" style={{ color: 'var(--accent-violet)' }}>
              {workshops.length}
            </p>
            <p className="text-xs font-medium" style={{ color: 'var(--accent-violet)', opacity: 0.8 }}>
              Workshops
            </p>
          </div>
          <div
            className="rounded-xl px-5 py-3 text-center"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.15)',
            }}
          >
            <p className="text-xl font-bold" style={{ color: 'var(--accent-emerald)' }}>
              {rsvps.length}
            </p>
            <p className="text-xs font-medium" style={{ color: 'var(--accent-emerald)', opacity: 0.8 }}>
              Enrolled
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <motion.div variants={itemVariants}>
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ background: 'var(--bg-muted)' }}
        >
          {['browse', 'schedule'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
              style={{
                background: activeTab === tab ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-tertiary)',
                boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <span className="flex items-center gap-2">
                {tab === 'browse' ? (
                  <>
                    <BookOpen size={14} />
                    Browse All
                  </>
                ) : (
                  <>
                    <Calendar size={14} />
                    My Schedule
                    {rsvps.length > 0 && (
                      <span
                        className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                        style={{ background: 'var(--accent-violet)' }}
                      >
                        {rsvps.length}
                      </span>
                    )}
                  </>
                )}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {activeTab === 'browse' && (
        <>
          {/* Search & Filter Bar */}
          <motion.div variants={itemVariants}>
            <Card className="p-4 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-tertiary)' }}
                />
                <input
                  type="text"
                  placeholder="Search by title or speaker..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className="whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={{
                      background: filterTag === tag
                        ? 'var(--accent-violet)'
                        : 'var(--bg-muted)',
                      color: filterTag === tag
                        ? 'white'
                        : 'var(--text-secondary)',
                      boxShadow: filterTag === tag ? 'var(--shadow-glow-violet)' : 'none',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Workshop Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredWorkshops.map((workshop, index) => {
              const isRsvpd = rsvps.includes(workshop.workshopId);
              const isFull = workshop.registeredCount >= workshop.capacity;
              const fillPct = Math.round((workshop.registeredCount / workshop.capacity) * 100);

              return (
                <motion.div key={workshop.workshopId} variants={itemVariants}>
                  <Card variant="interactive" className="flex flex-col h-full group">
                    {/* Top accent bar */}
                    <div
                      className="h-1 w-full"
                      style={{
                        background: isRsvpd
                          ? 'linear-gradient(to right, #10b981, #06b6d4)'
                          : isFull
                          ? `linear-gradient(to right, var(--bg-subtle), var(--text-tertiary))`
                          : 'var(--gradient-hero)',
                      }}
                    />

                    <div className="p-5 flex-1 flex flex-col">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 items-center mb-3">
                        {workshop.tags.map((tag) => (
                          <Badge key={tag} tag={tag}>{tag}</Badge>
                        ))}
                        {isRsvpd && (
                          <span
                            className="ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                            style={{
                              background: 'rgba(16,185,129,0.1)',
                              color: 'var(--accent-emerald)',
                              border: '1px solid rgba(16,185,129,0.2)',
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full animate-pulse"
                              style={{ background: 'var(--accent-emerald)' }}
                            />
                            Enrolled
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className="text-base font-bold leading-snug mb-1.5 transition-colors duration-200"
                        style={{
                          color: 'var(--text-primary)',
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {workshop.title}
                      </h3>
                      <p
                        className="text-xs mb-4 line-clamp-2 leading-relaxed"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {workshop.description}
                      </p>

                      {/* Meta */}
                      <div
                        className="mt-auto space-y-2.5 pt-3"
                        style={{ borderTop: '1px solid var(--border-subtle)' }}
                      >
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <User size={14} style={{ color: 'var(--text-tertiary)' }} />
                          <span className="font-medium">{workshop.speaker}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <Calendar size={14} style={{ color: 'var(--text-tertiary)' }} />
                          <span>
                            {new Date(workshop.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}{' '}
                            &middot;{' '}
                            {new Date(workshop.date).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Capacity bar */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                              {isFull ? 'Fully booked' : `${workshop.capacity - workshop.registeredCount} spots left`}
                            </span>
                            <span className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                              {workshop.registeredCount}/{workshop.capacity}
                            </span>
                          </div>
                          <div
                            className="w-full rounded-full h-1.5 overflow-hidden"
                            style={{ background: 'var(--bg-muted)' }}
                          >
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${fillPct}%` }}
                              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                              style={{
                                background: isFull
                                  ? 'var(--accent-rose)'
                                  : fillPct > 80
                                  ? 'var(--accent-amber)'
                                  : 'var(--accent-violet)',
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4">
                        {isRsvpd ? (
                          <div className="space-y-2">
                            <Button
                              variant="danger"
                              size="sm"
                              className="w-full"
                              onClick={() => handleCancelRsvp(workshop.workshopId)}
                            >
                              <X size={14} /> Cancel RSVP
                            </Button>
                            {workshop.resourceLinks?.length > 0 && (
                              <div className="pt-2">
                                <p
                                  className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                                  style={{ color: 'var(--text-tertiary)' }}
                                >
                                  Resources
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  {workshop.resourceLinks.map((link, i) => (
                                    <a
                                      key={i}
                                      href={link.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all duration-200 hover:-translate-y-px"
                                      style={{
                                        background: 'var(--bg-muted)',
                                        color: 'var(--accent-violet)',
                                        border: '1px solid var(--border-default)',
                                      }}
                                    >
                                      <ExternalLink size={12} /> {link.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleRsvp(workshop)}
                            disabled={isFull}
                            size="sm"
                            className="w-full"
                            variant={isFull ? 'secondary' : 'primary'}
                          >
                            {isFull ? 'Workshop Full' : '✓ RSVP Now — It\'s Free'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
            {filteredWorkshops.length === 0 && (
              <motion.div className="col-span-full py-16 text-center" variants={itemVariants}>
                <div className="text-5xl mb-3 opacity-60">🔍</div>
                <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  No workshops found
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Try adjusting your search or filters
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}

      {activeTab === 'schedule' && (
        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="show">
          {mySchedule.length === 0 ? (
            <motion.div variants={itemVariants}>
              <Card className="py-20 text-center">
                <div className="text-5xl mb-4 opacity-60">📅</div>
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                  No workshops yet
                </p>
                <p className="text-sm mt-2 mb-6" style={{ color: 'var(--text-tertiary)' }}>
                  Browse and RSVP to workshops to see them here
                </p>
                <Button onClick={() => setActiveTab('browse')}>
                  <BookOpen size={16} /> Browse Workshops
                </Button>
              </Card>
            </motion.div>
          ) : (
            mySchedule.map((workshop, index) => (
              <motion.div key={workshop.workshopId} variants={itemVariants}>
                <Card className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center transition-all duration-200 hover:!shadow-[var(--shadow-md)]">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {workshop.tags.map((tag) => (
                        <Badge key={tag} tag={tag}>{tag}</Badge>
                      ))}
                    </div>
                    <h3
                      className="text-base font-bold"
                      style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {workshop.title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      <span className="inline-flex items-center gap-1">
                        <User size={12} /> {workshop.speaker}
                      </span>
                      {' '}&middot;{' '}
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(workshop.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at{' '}
                        {new Date(workshop.date).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {workshop.resourceLinks?.length > 0 && (
                      <div className="flex gap-2">
                        {workshop.resourceLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all duration-200 hover:-translate-y-px"
                            style={{
                              background: 'var(--bg-muted)',
                              color: 'var(--accent-violet)',
                              border: '1px solid var(--border-default)',
                            }}
                          >
                            <ExternalLink size={12} /> {link.title}
                          </a>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelRsvp(workshop.workshopId)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </motion.div>
  );
}