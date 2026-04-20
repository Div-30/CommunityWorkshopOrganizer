export const APP_NAME = 'Workshop';

export const WORKSHOP_TAGS = [
  'React', 'TypeScript', 'CSS', 'Node.js', 'Python',
  'DevOps', 'Cloud', 'Docker', 'Design', 'AI/ML',
  'GraphQL', 'Testing', 'Security', 'Mobile', 'Database',
];

export const NAV_LINKS = {
  attendee: [
    { label: 'Discover', to: '/dashboard', icon: 'Compass' },
    { label: 'My Schedule', to: '/my-schedule', icon: 'CalendarDays' },
    { label: 'Notifications', to: '/notifications', icon: 'Bell' },
  ],
  organizer: [
    { label: 'Dashboard', to: '/organizer', icon: 'LayoutDashboard', section: 'OVERVIEW' },
    { label: 'Create Workshop', to: '/workshops/create', icon: 'PlusCircle', section: 'WORKSHOPS' },
  ],
  manager: [
    { label: 'Dashboard', to: '/manager', icon: 'LayoutDashboard', section: 'OVERVIEW' },
    { label: 'Review Queue', to: '/manager/reviews', icon: 'ClipboardCheck', section: 'MANAGEMENT' },
    { label: 'All Workshops', to: '/manager/workshops', icon: 'BookOpen', section: 'MANAGEMENT' },
    { label: 'Users', to: '/manager/users', icon: 'Users', section: 'MANAGEMENT' },
  ],
};

export const ROLE_OPTIONS = [
  {
    label: 'Attendee',
    value: 'Attendee',
    description: 'Discover workshops and save your spot.',
    emoji: '📚',
  },
  {
    label: 'Organizer',
    value: 'Organizer',
    description: 'Create sessions and share your knowledge.',
    emoji: '✨',
  },
];

export const getDefaultRouteForRole = (role) => {
  const r = String(role || '').toLowerCase();
  if (r === 'manager') return '/manager';
  if (r === 'organizer') return '/organizer';
  return '/dashboard';
};
