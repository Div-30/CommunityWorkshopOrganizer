export const mockUsers = [
  { id: 1, name: 'Alice Attendee', role: 'Attendee', email: 'alice@example.com' },
  { id: 2, name: 'Oliver Organizer', role: 'Organizer', email: 'oliver@example.com' },
];

export const mockWorkshops = [
  {
    workshopId: "w-1",
    title: "Intro to React Hooks",
    speaker: "Sarah Jenkins",
    date: "2026-04-10T14:00:00Z",
    capacity: 25,
    registeredCount: 12,
    resourceLinks: [
      { title: "React Docs", url: "https://react.dev" },
      { title: "Hooks Cheatsheet", url: "#" }
    ],
    description: "Learn the fundamentals of state and effect hooks in modern React applications.",
    tags: ["React", "Frontend", "Beginner"]
  },
  {
    workshopId: "w-2",
    title: "Advanced Tailwind CSS Architecture",
    speaker: "Oliver Organizer",
    date: "2026-04-15T10:00:00Z",
    capacity: 50,
    registeredCount: 50,
    resourceLinks: [
      { title: "Tailwind API", url: "https://tailwindcss.com" }
    ],
    description: "Deep dive into building scalable design systems using utility-first CSS.",
    tags: ["CSS", "Design", "Advanced"]
  },
  {
    workshopId: "w-3",
    title: "Full-Stack Deployment with Google IDX",
    speaker: "Divin Paul",
    date: "2026-04-20T16:00:00Z",
    capacity: 100,
    registeredCount: 8,
    resourceLinks: [
      { title: "Project IDX Documentation", url: "https://idx.dev" }
    ],
    description: "Learn how to scaffold, build, and deploy full-stack apps effortlessly.",
    tags: ["DevOps", "Cloud", "Intermediate"]
  }
];
