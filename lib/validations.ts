import { z } from 'zod'

// User registration schema - simplified version
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  userType: z.enum(['newcomer', 'mentor', 'client']),
})

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

// Project creation schema
export const projectSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['bronze', 'silver', 'gold']),
  budget: z.object({
    min: z.number().min(0, 'Minimum budget must be positive'),
    max: z.number().min(0, 'Maximum budget must be positive'),
  }).refine((data) => data.max >= data.min, {
    message: "Maximum budget must be greater than minimum budget",
    path: ["max"],
  }),
  duration: z.string().min(1, 'Duration is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  timeline: z.string().min(1, 'Timeline is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
})

// Application schema
export const applicationSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  coverLetter: z.string().min(100, 'Cover letter must be at least 100 characters'),
  proposedTimeline: z.string().min(1, 'Proposed timeline is required'),
  portfolioLinks: z.array(z.string().url('Invalid URL')).optional(),
  whyPerfect: z.string().min(50, 'Please explain why you are perfect for this project'),
})

// Session booking schema
export const sessionBookingSchema = z.object({
  mentorId: z.string().min(1, 'Mentor is required'),
  type: z.enum(['code-review', 'strategy', 'career-advice']),
  duration: z.number().min(30).max(180),
  scheduledAt: z.date().min(new Date(), 'Session must be scheduled in the future'),
  notes: z.string().optional(),
})

// Review schema
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
})

// Profile update schema
export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().url('Invalid LinkedIn URL').optional(),
    github: z.string().url('Invalid GitHub URL').optional(),
    portfolio: z.string().url('Invalid portfolio URL').optional(),
  }).optional(),
})

// Search filters schema
export const searchFiltersSchema = z.object({
  category: z.string().optional(),
  level: z.enum(['bronze', 'silver', 'gold']).optional(),
  budgetRange: z.tuple([z.number(), z.number()]).optional(),
  skills: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  availability: z.string().optional(),
  search: z.string().optional(),
})

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferences: z.array(z.string()).optional(),
})

// Password reset schema
export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// New password schema
export const newPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Mentor profile schema
export const mentorProfileSchema = z.object({
  expertise: z.array(z.string()).min(1, 'At least one expertise area is required'),
  experience: z.number().min(0, 'Experience must be positive'),
  hourlyRate: z.number().min(10, 'Hourly rate must be at least $10'),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  specializations: z.array(z.string()).min(1, 'At least one specialization is required'),
  availability: z.enum(['available', 'busy', 'unavailable']),
})

// Newcomer profile schema
export const newcomerProfileSchema = z.object({
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  learningGoals: z.array(z.string()).min(1, 'At least one learning goal is required'),
  portfolio: z.object({
    github: z.string().url('Invalid GitHub URL').optional(),
    linkedin: z.string().url('Invalid LinkedIn URL').optional(),
    website: z.string().url('Invalid website URL').optional(),
  }).optional(),
})

// Client profile schema
export const clientProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  projectTypes: z.array(z.string()).min(1, 'At least one project type is required'),
  industry: z.string().optional(),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional(),
})

// Settings schema
export const settingsSchema = z.object({
  emailNotifications: z.object({
    newProjects: z.boolean(),
    applications: z.boolean(),
    messages: z.boolean(),
    newsletters: z.boolean(),
  }),
  pushNotifications: z.object({
    newProjects: z.boolean(),
    applications: z.boolean(),
    messages: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'connections']),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
  }),
})

export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type ApplicationFormData = z.infer<typeof applicationSchema>
export type SessionBookingFormData = z.infer<typeof sessionBookingSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
export type SearchFiltersFormData = z.infer<typeof searchFiltersSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type NewsletterFormData = z.infer<typeof newsletterSchema>
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>
export type MentorProfileFormData = z.infer<typeof mentorProfileSchema>
export type NewcomerProfileFormData = z.infer<typeof newcomerProfileSchema>
export type ClientProfileFormData = z.infer<typeof clientProfileSchema>
export type SettingsFormData = z.infer<typeof settingsSchema>
