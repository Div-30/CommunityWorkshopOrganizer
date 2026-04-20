import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, ArrowRight, Check, Star, Users, BookOpen, Globe,
  Shield, Sparkles, BarChart3, Clock, Calendar, ChevronRight,
  Play, TrendingUp, Award, MessageSquare, Layers, Command,
  Code2, AtSign, Network, Menu, X,
} from 'lucide-react';

/* ━━━ DATA ━━━ */
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Community', href: '#community' },
  { label: 'Pricing', href: '#pricing' },
];

const FEATURES = [
  {
    icon: Sparkles,
    color: 'from-violet-500 to-indigo-500',
    bg: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
    title: 'Discover & Register',
    desc: 'Browse a curated feed of technical workshops filtered by topic, skill level, and date. RSVP in one click.',
  },
  {
    icon: Layers,
    color: 'from-indigo-500 to-sky-500',
    bg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
    title: 'Create with Ease',
    desc: 'Organizers get a beautiful multi-step form to schedule workshops, set capacity, attach resources, and tag topics.',
  },
  {
    icon: Shield,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    title: 'Manager Oversight',
    desc: 'A powerful approval queue lets managers review, approve, or request changes before anything goes live.',
  },
  {
    icon: BarChart3,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    title: 'Real-time Analytics',
    desc: 'Track fill rates, attendance trends, and engagement metrics across all workshops from one clean dashboard.',
  },
  {
    icon: Clock,
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-500/10',
    iconColor: 'text-rose-400',
    title: 'Smart Scheduling',
    desc: 'Calendar views, date-grouped schedules, and automated reminders keep everyone on time and in the loop.',
  },
  {
    icon: MessageSquare,
    color: 'from-sky-500 to-cyan-500',
    bg: 'bg-sky-500/10',
    iconColor: 'text-sky-400',
    title: 'Attendee Management',
    desc: 'Export rosters, bulk-message attendees, manage waitlists, and control capacity — all from one page.',
  },
];

const STEPS = [
  { num: '01', title: 'Sign up in seconds', desc: 'Create your account as an Attendee or Organizer. No credit card, no setup friction.' },
  { num: '02', title: 'Discover workshops', desc: 'Browse events by topic, filter by date, and RSVP with one click. Your schedule updates instantly.' },
  { num: '03', title: 'Host or attend', desc: 'Organizers create and submit workshops; attendees register and get reminders — everyone wins.' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Senior React Developer',
    avatar: 'S',
    color: 'bg-violet-500',
    text: 'I\'ve attended 12 workshops this year through this platform. The discovery experience is unreal — I find exactly what I need, when I need it.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Workshop Organizer, DevOps',
    avatar: 'M',
    color: 'bg-indigo-500',
    text: 'Creating a workshop takes under 5 minutes. The approval flow is smooth, and my attendee roster management saved me hours every event.',
  },
  {
    name: 'Priya Patel',
    role: 'CSS Architecture Lead',
    avatar: 'P',
    color: 'bg-emerald-500',
    text: 'The platform feels like it was designed by people who actually run workshops. Every detail is right — especially the capacity tracking.',
  },
  {
    name: 'Alex Rivera',
    role: 'TypeScript Instructor',
    avatar: 'A',
    color: 'bg-amber-500',
    text: 'My workshops fill up in hours. The waitlist feature and bulk messaging turned post-event chaos into a calm, organized process.',
  },
];

const STATS = [
  { value: '12,400+', label: 'Community Members', icon: Users },
  { value: '840+',   label: 'Workshops Hosted',  icon: BookOpen },
  { value: '96%',    label: 'Satisfaction Rate',  icon: Star },
  { value: '38',     label: 'Cities Worldwide',   icon: Globe },
];

const PRICING = [
  {
    name: 'Attendee',
    price: 'Free',
    period: 'forever',
    desc: 'For anyone who wants to learn and grow with the community.',
    cta: 'Get started free',
    href: '/register',
    highlight: false,
    features: [
      'Browse all public workshops',
      'One-click RSVP',
      'Personal schedule view',
      'Reminder notifications',
      'Resource downloads',
      'Community access',
    ],
  },
  {
    name: 'Organizer',
    price: 'Free',
    period: 'during beta',
    desc: 'For experts who want to share their knowledge with the world.',
    cta: 'Start organizing',
    href: '/register',
    highlight: true,
    badge: 'Most popular',
    features: [
      'Everything in Attendee',
      'Create unlimited workshops',
      'Attendee management dashboard',
      'Resource attachment & sharing',
      'Fill-rate analytics',
      'Bulk messaging attendees',
      'CSV export',
      'Priority review queue',
    ],
  },
  {
    name: 'Manager',
    price: 'Invite only',
    period: 'contact us',
    desc: 'For community leads overseeing the full platform.',
    cta: 'Request access',
    href: '/register',
    highlight: false,
    features: [
      'Everything in Organizer',
      'Workshop approval queue',
      'Full user management',
      'Platform-wide analytics',
      'Role assignment',
      'Content moderation',
    ],
  },
];

const TICKER_TAGS = [
  'React', 'TypeScript', 'CSS', 'Node.js', 'Python', 'DevOps',
  'Cloud', 'Docker', 'Design', 'AI/ML', 'GraphQL', 'Testing',
  'Security', 'Mobile', 'Database', 'Architecture', 'Performance',
  'Accessibility', 'React', 'TypeScript', 'CSS', 'Node.js', 'Python',
  'DevOps', 'Cloud', 'Docker', 'Design', 'AI/ML', 'GraphQL', 'Testing',
];

/* ━━━ COMPONENT ━━━ */
export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ━━━ NAVBAR ━━━ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#09090b]/90 backdrop-blur-xl border-b border-white/8' : ''}`}>
        <div className="mx-auto max-w-[1180px] px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 no-underline" style={{ textDecoration: 'none' }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/40">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold text-white">Workshop</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-2 rounded-lg text-[14px] font-medium text-white/60 hover:text-white hover:bg-white/6 transition-all duration-150"
                style={{ textDecoration: 'none' }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-[14px] font-medium text-white/60 hover:text-white transition-colors"
              style={{ textDecoration: 'none' }}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-[14px] font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              style={{ textDecoration: 'none' }}
            >
              Get started free
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/6 transition-colors cursor-pointer"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/8 bg-[#09090b]/95 backdrop-blur-xl px-6 py-4 space-y-1">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-[14px] font-medium text-white/60 hover:text-white hover:bg-white/6 transition-colors"
                style={{ textDecoration: 'none' }}>
                {l.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/8 flex flex-col gap-2">
              <Link to="/login" className="block px-3 py-2.5 text-[14px] font-medium text-white/60 hover:text-white transition-colors" style={{ textDecoration: 'none' }}>Sign in</Link>
              <Link to="/register" className="block rounded-lg bg-indigo-600 px-3 py-2.5 text-[14px] font-semibold text-white text-center" style={{ textDecoration: 'none' }}>Get started free</Link>
            </div>
          </div>
        )}
      </header>

      {/* ━━━ HERO ━━━ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-grid">
        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb-float-1 absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="orb-float-2 absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="orb-float-3 absolute bottom-1/4 left-1/2 w-[300px] h-[300px] rounded-full bg-sky-600/10 blur-[80px]" />
        </div>

        {/* Radial dark vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#09090b_80%)] pointer-events-none" />

        <div className="relative z-10 text-center px-6 pt-20">
          {/* Badge */}
          <div className="fade-up inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-[13px] font-medium text-indigo-300 mb-8 backdrop-blur-sm">
            <Sparkles size={13} />
            Now in public beta — free for everyone
            <span className="font-semibold text-indigo-200">→</span>
          </div>

          {/* Heading */}
          <h1 className="fade-up fade-up-delay-1 mb-6 max-w-4xl mx-auto text-[clamp(40px,7vw,80px)] font-bold leading-[1.08] tracking-tight">
            The home for{' '}
            <span className="gradient-text">technical communities</span>
            {' '}to learn together
          </h1>

          {/* Sub-heading */}
          <p className="fade-up fade-up-delay-2 mx-auto mb-10 max-w-xl text-[18px] text-white/55 leading-relaxed">
            Create, discover, and register for collaborative workshops.
            Built for developers, designers, and everyone in between.
          </p>

          {/* CTAs */}
          <div className="fade-up fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-7 py-3.5 text-[15px] font-semibold text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ textDecoration: 'none' }}
            >
              Get started — it's free
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 px-7 py-3.5 text-[15px] font-medium text-white/80 hover:text-white backdrop-blur-sm transition-all duration-200"
              style={{ textDecoration: 'none' }}
            >
              <Play size={14} fill="currentColor" />
              See how it works
            </Link>
          </div>

          {/* Social proof avatars */}
          <div className="fade-up fade-up-delay-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-[13px] text-white/40">
            <div className="flex -space-x-2.5">
              {['S','M','P','A','L','J'].map((i, idx) => (
                <div key={idx} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#09090b] text-[11px] font-bold text-white ${['bg-violet-600','bg-indigo-600','bg-emerald-600','bg-amber-600','bg-rose-600','bg-sky-600'][idx]}`}>
                  {i}
                </div>
              ))}
            </div>
            <span>Join <strong className="text-white/70 font-semibold">12,400+</strong> community members worldwide</span>
          </div>

          {/* App preview mockup */}
          <div className="fade-up fade-up-delay-5 mt-16 relative mx-auto max-w-5xl">
            {/* Glow under image */}
            <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-2xl blur-xl" />
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/70" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/70" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex-1 mx-4 rounded-md bg-white/6 px-3 py-1 text-[11px] text-white/30">
                  workshop.community/dashboard
                </div>
              </div>

              {/* Mock app UI */}
              <div className="p-6 bg-[#0f0e0c] min-h-[360px]">
                {/* Mini sidebar */}
                <div className="flex gap-4 h-full">
                  <div className="w-40 shrink-0 space-y-1 pt-1">
                    {['Discover', 'My Schedule', 'Notifications'].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] ${i === 0 ? 'bg-indigo-600/20 text-indigo-300' : 'text-white/30'}`}>
                        <div className={`h-3 w-3 rounded-sm ${i === 0 ? 'bg-indigo-500/60' : 'bg-white/10'}`} />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1">
                    {/* Greeting */}
                    <div className="mb-4">
                      <div className="h-5 w-56 bg-white/15 rounded-lg mb-2 skeleton" />
                      <div className="h-3.5 w-36 bg-white/8 rounded-md" />
                    </div>

                    {/* Search & filters */}
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 h-9 bg-white/6 rounded-lg border border-white/8" />
                      {['React','CSS','DevOps','Cloud'].map((t,i) => (
                        <div key={i} className={`px-3 py-1 rounded-full text-[11px] font-medium ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-white/6 text-white/40 border border-white/8'}`}>{t}</div>
                      ))}
                    </div>

                    {/* Workshop card grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { tag:'React', color:'bg-indigo-500/20 text-indigo-300', fill:80, title:'Building Accessible React Components' },
                        { tag:'DevOps', color:'bg-emerald-500/20 text-emerald-300', fill:100, title:'Docker & Kubernetes in Production', full: true },
                        { tag:'CSS', color:'bg-violet-500/20 text-violet-300', fill:48, title:'Advanced CSS Grid Techniques' },
                      ].map((c, i) => (
                        <div key={i} className="rounded-xl border border-white/8 bg-white/4 p-3">
                          <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${c.color} mb-2`}>{c.tag}</div>
                          <p className="text-[11px] font-semibold text-white/80 leading-snug mb-2">{c.title}</p>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${c.full ? 'bg-rose-500 w-full' : c.fill > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{width:`${c.fill}%`}} />
                          </div>
                          <p className="text-[10px] text-white/30 mt-1">{c.full ? 'Sold out' : `${c.fill}% filled`}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TICKER ━━━ */}
      <section className="relative border-y border-white/6 bg-white/2 py-5 overflow-hidden">
        <div className="flex">
          <div className="ticker-track flex gap-4 whitespace-nowrap">
            {TICKER_TAGS.map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 text-[12px] font-medium text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ STATS ━━━ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 mb-4">
                  <stat.icon size={20} className="text-indigo-400" />
                </div>
                <p className="stat-counter text-[36px] font-bold text-white tracking-tight">{stat.value}</p>
                <p className="mt-1 text-[13px] text-white/45">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FEATURES ━━━ */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-[1180px]">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-[12px] font-medium text-indigo-300 mb-5">
              <Zap size={12} />
              Everything you need
            </div>
            <h2 className="text-[clamp(28px,5vw,48px)] font-bold tracking-tight text-white mb-4">
              Built for communities<br />that move fast
            </h2>
            <p className="mx-auto max-w-lg text-[17px] text-white/50 leading-relaxed">
              Every feature was designed around how real communities actually work — not how someone imagined they might.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-white/8 bg-white/3 p-6 hover:bg-white/6 hover:border-white/14 transition-all duration-200 cursor-default"
              >
                {/* Gradient top line */}
                <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.bg} mb-5`}>
                  <f.icon size={22} className={f.iconColor} />
                </div>
                <h3 className="text-[17px] font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-[14px] text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section id="how" className="py-24 px-6 border-y border-white/6 bg-white/2">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-[12px] font-medium text-violet-300 mb-6">
                <Command size={12} />
                How it works
              </div>
              <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-white mb-5">
                Go from zero to workshop host in minutes
              </h2>
              <p className="text-[16px] text-white/50 leading-relaxed mb-10">
                No complex setup. No onboarding calls. Just sign up and start — whether you're learning or teaching.
              </p>

              <div className="space-y-8">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10">
                      <span className="text-[13px] font-bold text-indigo-400 font-mono">{step.num}</span>
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-white mb-1">{step.title}</h3>
                      <p className="text-[14px] text-white/50 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-[14px] font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ textDecoration: 'none' }}
                >
                  Start for free today
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right — feature callout cards */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 rounded-3xl blur-2xl" />
              <div className="relative space-y-4">
                {[
                  { icon: Calendar, color: 'text-indigo-400 bg-indigo-500/15', title: 'Smart calendar', desc: 'Date-grouped schedule view with one-tap RSVP.' },
                  { icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/15', title: 'Fill-rate heatmaps', desc: 'Know exactly how popular each topic is in real time.' },
                  { icon: Award, color: 'text-amber-400 bg-amber-500/15', title: 'Approval workflow', desc: 'Managers review workshops before they go live — quality guaranteed.' },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/4 p-5 hover:bg-white/7 hover:border-white/14 transition-all duration-200 glow-border"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
                      <card.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-white">{card.title}</h4>
                      <p className="text-[13px] text-white/50 mt-0.5">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section id="community" className="py-24 px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-[12px] font-medium text-emerald-300 mb-5">
              <Star size={12} fill="currentColor" />
              Community love
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-white mb-3">
              Trusted by thousands of learners
            </h2>
            <p className="mx-auto max-w-md text-[16px] text-white/50">
              Real people, real workshops, real growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/8 bg-white/3 p-6 hover:bg-white/5 hover:border-white/12 transition-all duration-200"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" className="text-amber-400" />
                  ))}
                </div>

                <blockquote className="text-[15px] text-white/70 leading-relaxed mb-5">
                  "{t.text}"
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.color} text-[12px] font-bold text-white`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white">{t.name}</p>
                    <p className="text-[12px] text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ PRICING ━━━ */}
      <section id="pricing" className="py-24 px-6 border-t border-white/6 bg-white/2">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-[12px] font-medium text-sky-300 mb-5">
              <Sparkles size={12} />
              Simple pricing
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-white mb-3">
              Start free. Grow without limits.
            </h2>
            <p className="mx-auto max-w-md text-[16px] text-white/50">
              Every role on the platform is free during beta. No hidden fees, no credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRICING.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-6 flex flex-col transition-all duration-200 ${
                  plan.highlight
                    ? 'border border-indigo-500/50 bg-indigo-600/8 shadow-xl shadow-indigo-500/10'
                    : 'border border-white/8 bg-white/3 hover:bg-white/5'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white shadow-lg shadow-indigo-500/40">
                    <Star size={10} fill="currentColor" />
                    {plan.badge}
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-[13px] font-semibold text-white/50 uppercase tracking-wider mb-2">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[36px] font-bold text-white">{plan.price}</span>
                    <span className="text-[13px] text-white/40">/{plan.period}</span>
                  </div>
                  <p className="text-[14px] text-white/50 leading-relaxed">{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-[14px] text-white/65">
                      <div className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${plan.highlight ? 'bg-indigo-500/30' : 'bg-white/10'}`}>
                        <Check size={10} className={plan.highlight ? 'text-indigo-300' : 'text-white/60'} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.href}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] ${
                    plan.highlight
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white/8 hover:bg-white/12 text-white border border-white/12'
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  {plan.cta}
                  <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FINAL CTA ━━━ */}
      <section className="py-28 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/12 via-transparent to-violet-600/8" />
          <div className="orb-float-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/12 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 mb-7 shadow-xl shadow-indigo-500/40">
            <Zap size={26} className="text-white" />
          </div>
          <h2 className="text-[clamp(32px,5vw,56px)] font-bold tracking-tight text-white mb-5 leading-tight">
            Your community is waiting.<br />Join them today.
          </h2>
          <p className="text-[17px] text-white/50 mb-10 leading-relaxed">
            Thousands of developers are already learning together. Don't miss the next great workshop in your field.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-8 py-4 text-[15px] font-semibold text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ textDecoration: 'none' }}
            >
              Get started for free
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 px-8 py-4 text-[15px] font-medium text-white/70 hover:text-white transition-all duration-200"
              style={{ textDecoration: 'none' }}
            >
              I already have an account
            </Link>
          </div>
          <p className="mt-5 text-[13px] text-white/30">No credit card required. Free forever for attendees.</p>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="border-t border-white/6 px-6 py-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-[15px] font-semibold text-white">Workshop</span>
              <span className="text-[13px] text-white/30 ml-2">— Learn together, grow together.</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a key={l} href="#" className="text-[13px] text-white/40 hover:text-white/70 transition-colors" style={{ textDecoration: 'none' }}>{l}</a>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {[Code2, AtSign, Network].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 text-white/40 hover:text-white hover:bg-white/6 hover:border-white/16 transition-all" style={{ textDecoration: 'none' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/6 text-center text-[12px] text-white/25">
            © {new Date().getFullYear()} Community Workshop Organizer. Built with ❤️ for technical communities.
          </div>
        </div>
      </footer>
    </div>
  );
}
