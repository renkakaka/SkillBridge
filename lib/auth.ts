import crypto from 'crypto'
import { cookies, headers } from 'next/headers'
import { NextRequest } from 'next/server'

type JwtHeader = {
  alg: 'HS256'
  typ: 'JWT'
}

export type SessionPayload = {
  userId: string
  email: string
  userType: 'newcomer' | 'mentor' | 'client' | 'admin'
  emailVerified: boolean
  iat?: number
  exp?: number
}

function base64url(input: Buffer | string): string {
  return (typeof input === 'string' ? Buffer.from(input) : input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || ''
  if (!secret) {
    // Fallback to a static dev secret to avoid build-time errors; strongly recommend setting AUTH_SECRET in prod
    return 'dev-insecure-secret-change-me'
  }
  return secret
}

export function signJwt(payload: Omit<SessionPayload, 'iat' | 'exp'>, expiresInSeconds: number): string {
  const header: JwtHeader = { alg: 'HS256', typ: 'JWT' }
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + expiresInSeconds
  const fullPayload: SessionPayload = { ...payload, iat, exp }

  const encodedHeader = base64url(Buffer.from(JSON.stringify(header)))
  const encodedPayload = base64url(Buffer.from(JSON.stringify(fullPayload)))
  const data = `${encodedHeader}.${encodedPayload}`
  const signature = crypto
    .createHmac('sha256', getAuthSecret())
    .update(data)
    .digest()
  const encodedSignature = base64url(signature)
  return `${data}.${encodedSignature}`
}

export function verifyJwt(token: string): SessionPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [encodedHeader, encodedPayload, signature] = parts
    const data = `${encodedHeader}.${encodedPayload}`
    const expectedSig = base64url(
      crypto.createHmac('sha256', getAuthSecret()).update(data).digest()
    )
    if (expectedSig !== signature) return null
    const payload = JSON.parse(Buffer.from(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()) as SessionPayload
    if (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export async function setSessionCookie(session: SessionPayload, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const token = signJwt(session, maxAgeSeconds)
  const cookieStore = await cookies()
  cookieStore.set('sb_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeSeconds,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set('sb_session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('sb_session')?.value
  if (!token) return null
  return verifyJwt(token)
}

export function getSessionFromRequest(req: NextRequest): SessionPayload | null {
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.split(/;\s*/).find(c => c.startsWith('sb_session='))
  if (!match) return null
  const token = decodeURIComponent(match.substring('sb_session='.length))
  return verifyJwt(token)
}

export async function getAuthHeadersSession(): Promise<SessionPayload | null> {
  // fallback helper for places where we only have headers()
  const headersStore = await headers()
  const cookieHeader = headersStore.get('cookie') || ''
  const match = cookieHeader.split(/;\s*/).find((c: string) => c.startsWith('sb_session='))
  if (!match) return null
  const token = decodeURIComponent(match.substring('sb_session='.length))
  return verifyJwt(token)
}


