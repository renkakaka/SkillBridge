import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function hasSessionCookie(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || ''
  return cookieHeader.split(/;\s*/).some(c => c.startsWith('sb_session='))
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const method = req.method.toUpperCase()

  // Public endpoints: auth, verify-email, newsletter, mentors, projects GET
  const isPublic = (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/newsletter') ||
    pathname.startsWith('/api/mentors') ||
    (pathname.startsWith('/api/projects') && method === 'GET') ||
    pathname.startsWith('/api/stripe/webhook')
  )
  if (isPublic) return NextResponse.next()

  // Require auth for all other API routes
  if (pathname.startsWith('/api/')) {
    if (!hasSessionCookie(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Admin-only routes
    if (pathname.startsWith('/api/admin')) {
      // Defer exact admin validation to the route handler (cookie presence checked here)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}


