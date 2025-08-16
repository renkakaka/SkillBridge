import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function hasSessionCookie(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || ''
  return cookieHeader.split(/;\s*/).some(c => c.startsWith('sb_session='))
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const method = req.method.toUpperCase()

  // Public endpoints: auth, verify-email, newsletter, mentors, projects GET, test-email
  const isPublic = (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/newsletter') ||
    pathname.startsWith('/api/mentors') ||
    pathname.startsWith('/api/test-email') ||
    (pathname.startsWith('/api/projects') && method === 'GET') ||
    pathname.startsWith('/api/stripe/webhook')
  )
  
  if (isPublic) {
    console.log(`Public endpoint accessed: ${pathname}`)
    return NextResponse.next()
  }

  // Require auth for all other API routes
  if (pathname.startsWith('/api/')) {
    if (!hasSessionCookie(req)) {
      console.log(`Unauthorized access attempt to: ${pathname}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin-only routes
    if (pathname.startsWith('/api/admin')) {
      // Defer exact admin validation to the route handler (cookie presence checked here)
      console.log(`Admin endpoint accessed: ${pathname}`)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}


