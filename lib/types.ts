export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  userType: 'newcomer' | 'mentor' | 'client';
  createdAt: Date;
  updatedAt: Date;
}

export interface Newcomer extends User {
  userType: 'newcomer';
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  learningGoals: string[];
  experiencePoints: number;
  level: number;
  projectsCompleted: number;
  mentorshipHours: number;
  jobReadinessScore: number;
  achievements: Achievement[];
}

export interface Mentor extends User {
  userType: 'mentor';
  expertise: string[];
  experience: number;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  totalMentees: number;
  successRate: number;
  availability: 'available' | 'busy' | 'unavailable';
  specializations: string[];
  bio: string;
  monthlyEarnings: number;
  sessionsThisMonth: number;
}

export interface Client extends User {
  userType: 'client';
  companyName?: string;
  projectTypes: string[];
  activeProjects: number;
  applicationsReceived: number;
  budgetSpent: number;
  successRate: number;
}

export interface Project {
  id: string;
  title: string;
  type: 'bronze' | 'silver' | 'gold';
  category: string;
  budget: {
    min: number;
    max: number;
  };
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  client: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
  };
  applicants: number;
  skills: string[];
  featured: boolean;
  postedAt: Date;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  requirements: string[];
  timeline: string;
  rating: number;
  reviewCount: number;
  maxParticipants: number;
  location?: string;
}

export interface Application {
  id: string;
  projectId: string;
  newcomerId: string;
  coverLetter: string;
  proposedTimeline: string;
  portfolioLinks: string[];
  whyPerfect: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: Date;
  reviewedAt?: Date;
}

export interface Session {
  id: string;
  mentorId: string;
  menteeId: string;
  type: 'code-review' | 'strategy' | 'career-advice';
  duration: number; // minutes
  scheduledAt: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  rating?: number;
  review?: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewedId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  type: 'project' | 'mentorship' | 'client';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'project' | 'mentorship' | 'skill' | 'social';
}

export interface SuccessStory {
  id: string;
  userId: string;
  title: string;
  beforeTitle: string;
  afterTitle: string;
  timeline: string;
  salaryIncrease?: number;
  quote: string;
  projectsCompleted: number;
  skillsGained: string[];
  featured: boolean;
  createdAt: Date;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'annual';
  features: string[];
  popular?: boolean;
  cta: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'project' | 'mentorship' | 'application' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  level: number; // 1-5
  experience: number; // months
}

export interface Stats {
  totalProjects: number;
  successRate: number;
  averageTime: string;
  averageSalary: number;
  totalUsers: number;
  totalMentors: number;
  totalClients: number;
}

export interface SearchFilters {
  category?: string;
  level?: 'bronze' | 'silver' | 'gold';
  budgetRange?: [number, number];
  skills?: string[];
  rating?: number;
  availability?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
