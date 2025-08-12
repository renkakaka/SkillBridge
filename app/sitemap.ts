import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5174'
  const now = new Date()
  const routes = [
    '', 
    '/projects', 
    '/mentors', 
    '/success-stories', 
    '/pricing', 
    '/auth/signin', 
    '/auth/signup', 
    '/dashboard', 
    '/profile',
    '/achievements',
    '/admin',
    '/admin/users',
    '/admin/stats',
    '/admin/settings'
  ]
  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))
}
