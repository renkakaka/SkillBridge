import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Չստուգված մուտք' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) return NextResponse.json({ error: 'Չգտնվեց' }, { status: 404 })
  const { password: _pw, verificationToken: _vt, ...safe } = user as any
  return NextResponse.json(safe)
}

export async function PUT(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Չստուգված մուտք' }, { status: 401 })
  const body = await req.json()
  const { fullName, bio, avatarUrl, experienceLevel, skills } = body
  const updated = await prisma.user.update({ where: { id: session.userId }, data: {
    fullName,
    bio,
    avatarUrl,
    experienceLevel,
    skills: Array.isArray(skills) ? JSON.stringify(skills) : undefined
  }})
  const { password: _pw, verificationToken: _vt, ...safe } = updated as any
  return NextResponse.json(safe)
}
