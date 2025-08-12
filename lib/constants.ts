import { Project, Mentor, SuccessStory, PricingPlan, Stats } from './types';

export const APP_NAME = 'SkillBridge';
export const APP_DESCRIPTION = 'Turn Your Skills Into Real Experience';

export const USER_TYPES = {
  NEWCOMER: 'newcomer',
  MENTOR: 'mentor',
  CLIENT: 'client',
} as const;

export const PROJECT_TYPES = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
} as const;

export const PROJECT_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Science',
  'DevOps',
  'Marketing',
  'Content Writing',
  'Graphic Design',
  'Video Editing',
  'SEO',
] as const;

export const SKILLS = [
  'React',
  'Node.js',
  'Python',
  'JavaScript',
  'TypeScript',
  'HTML/CSS',
  'Figma',
  'Adobe Photoshop',
  'Docker',
  'AWS',
  'MongoDB',
  'PostgreSQL',
  'Git',
  'Agile',
  'Scrum',
] as const;

export const SESSION_TYPES = [
  { value: 'code-review', label: 'Code Review' },
  { value: 'strategy', label: 'Strategy Session' },
  { value: 'career-advice', label: 'Career Advice' },
] as const;

export const SESSION_DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
] as const;

// Mock Data
export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Logo Design for Local Coffee Shop",
    type: "bronze",
    category: "Graphic Design",
    budget: { min: 150, max: 300 },
    duration: "1-2 weeks",
    difficulty: "beginner",
    description: "Create a modern, cozy logo for a new coffee shop in downtown. Need something that reflects warmth and community.",
    client: {
      id: "client1",
      name: "CoffeeCorp",
      rating: 4.8,
      avatar: undefined
    },
    applicants: 12,
    skills: ["Logo Design", "Adobe Illustrator", "Brand Identity"],
    featured: true,
    postedAt: new Date("2024-01-15"),
    status: "open",
    requirements: ["Modern design", "Warm color palette", "Scalable vector format"],
    timeline: "2 weeks",
    rating: 4.8,
    reviewCount: 15,
    maxParticipants: 3,
    location: "Удаленно"
  },
  {
    id: "2",
    title: "React E-commerce Website",
    type: "silver",
    category: "Web Development",
    budget: { min: 800, max: 1500 },
    duration: "3-4 weeks",
    difficulty: "intermediate",
    description: "Build a modern e-commerce website using React and Node.js. Include product catalog, shopping cart, and payment integration.",
    client: {
      id: "client2",
      name: "TechStart",
      rating: 4.9,
      avatar: undefined
    },
    applicants: 8,
    skills: ["React", "Node.js", "MongoDB", "Stripe"],
    featured: true,
    postedAt: new Date("2024-01-14"),
    status: "open",
    requirements: ["Responsive design", "Payment integration", "Admin panel"],
    timeline: "4 weeks",
    rating: 4.9,
    reviewCount: 22,
    maxParticipants: 2,
    location: "Удаленно"
  },
  {
    id: "3",
    title: "Mobile App UI/UX Design",
    type: "gold",
    category: "UI/UX Design",
    budget: { min: 2000, max: 3500 },
    duration: "4-6 weeks",
    difficulty: "advanced",
    description: "Design a complete mobile app interface for a fitness tracking application. Include user flows, wireframes, and high-fidelity mockups.",
    client: {
      id: "client3",
      name: "FitTech",
      rating: 4.7,
      avatar: undefined
    },
    applicants: 5,
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    featured: false,
    postedAt: new Date("2024-01-13"),
    status: "open",
    requirements: ["User research", "Wireframes", "High-fidelity designs", "Prototype"],
    timeline: "6 weeks",
    rating: 4.7,
    reviewCount: 8,
    maxParticipants: 1,
    location: "Удаленно"
  }
];

export const MOCK_MENTORS: Mentor[] = [
  {
    id: "1",
    email: "sarah.chen@example.com",
    fullName: "Sarah Chen",
    userType: "mentor",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-01"),
    expertise: ["UI/UX Design", "Product Design"],
    experience: 8,
    hourlyRate: 75,
    rating: 4.9,
    reviewCount: 127,
    totalMentees: 47,
    successRate: 94,
    availability: "available",
    specializations: ["User Research", "Prototyping", "Design Systems"],
    bio: "Senior Product Designer at Meta with 8+ years of experience helping designers build their portfolios and land dream jobs.",
    monthlyEarnings: 3200,
    sessionsThisMonth: 15
  },
  {
    id: "2",
    email: "mike.johnson@example.com",
    fullName: "Mike Johnson",
    userType: "mentor",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2024-01-01"),
    expertise: ["Full Stack Development", "React", "Node.js"],
    experience: 6,
    hourlyRate: 65,
    rating: 4.8,
    reviewCount: 89,
    totalMentees: 32,
    successRate: 91,
    availability: "available",
    specializations: ["React", "Node.js", "Database Design", "API Development"],
    bio: "Full-stack developer with 6 years of experience. Helped 30+ developers transition from bootcamps to full-time roles.",
    monthlyEarnings: 2800,
    sessionsThisMonth: 12
  },
  {
    id: "3",
    email: "emma.wilson@example.com",
    fullName: "Emma Wilson",
    userType: "mentor",
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2024-01-01"),
    expertise: ["Data Science", "Machine Learning"],
    experience: 5,
    hourlyRate: 85,
    rating: 4.9,
    reviewCount: 156,
    totalMentees: 28,
    successRate: 96,
    availability: "busy",
    specializations: ["Python", "TensorFlow", "Data Analysis", "ML Models"],
    bio: "Data Scientist at Google with expertise in machine learning and data analysis. Passionate about teaching others.",
    monthlyEarnings: 4200,
    sessionsThisMonth: 18
  }
];

export const MOCK_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "1",
    userId: "user1",
    title: "From Bootcamp to $70k Developer",
    beforeTitle: "Unemployed Graduate",
    afterTitle: "Frontend Developer",
    timeline: "4 months",
    salaryIncrease: 70000,
    quote: "SkillBridge gave me the real-world experience I needed. My mentor helped me build confidence and the projects gave me a solid portfolio.",
    projectsCompleted: 5,
    skillsGained: ["React", "TypeScript", "Node.js", "Git"],
    featured: true,
    createdAt: new Date("2024-01-01")
  },
  {
    id: "2",
    userId: "user2",
    title: "Designer Lands Dream Job at Startup",
    beforeTitle: "Freelance Designer",
    afterTitle: "Senior UI/UX Designer",
    timeline: "3 months",
    salaryIncrease: 45000,
    quote: "The mentorship program was incredible. My mentor helped me understand what companies really look for in designers.",
    projectsCompleted: 3,
    skillsGained: ["Figma", "User Research", "Design Systems", "Prototyping"],
    featured: true,
    createdAt: new Date("2024-01-02")
  }
];

export const MOCK_PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    interval: "monthly",
    features: [
      "Access to Bronze projects",
      "Basic mentor matching",
      "Community access",
      "Portfolio builder",
      "Email support"
    ],
    cta: "Get Started Free"
  },
  {
    id: "accelerator",
    name: "Accelerator",
    price: 49,
    interval: "monthly",
    features: [
      "All Starter features",
      "Silver projects access",
      "Priority mentor matching",
      "2 mentor sessions/month included",
      "Advanced analytics",
      "Priority support"
    ],
    popular: true,
    cta: "Start Free Trial"
  },
  {
    id: "professional",
    name: "Professional",
    price: 149,
    interval: "monthly",
    features: [
      "All Accelerator features",
      "Gold projects access",
      "Unlimited mentor sessions",
      "Personal career coach",
      "Job guarantee (6 months)",
      "Priority support",
      "Resume review service"
    ],
    cta: "Start Free Trial"
  }
];

export const MOCK_STATS: Stats = {
  totalProjects: 2847,
  successRate: 94,
  averageTime: "3.2 months",
  averageSalary: 72000,
  totalUsers: 15420,
  totalMentors: 847,
  totalClients: 1234
};

export const NAVIGATION_ITEMS = [
  { name: 'Projects', href: '/projects' },
  { name: 'Mentors', href: '/mentors' },
  { name: 'Success Stories', href: '/success-stories' },
  { name: 'Pricing', href: '/pricing' },
];

export const FOOTER_LINKS = {
  product: [
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'How it Works', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
};
