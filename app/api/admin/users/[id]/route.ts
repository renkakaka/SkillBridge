import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

function isAdmin(req: NextRequest) {
  const headerEmail = req.headers.get('x-admin-email') || ''
  const adminEmail = process.env.ADMIN_EMAIL || ''
  return adminEmail && headerEmail.toLowerCase() === adminEmail.toLowerCase()
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Մուտքը արգելված է' }, { status: 403 })
  const id = params.id
  const u = await prisma.user.findUnique({ where: { id } })
  if (!u) return NextResponse.json({ error: 'Չգտնվեց' }, { status: 404 })
  const { password: _pw, verificationToken: _vt, ...safe } = u as any
  return NextResponse.json(safe)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Մուտքը արգելված է' }, { status: 403 })
  const id = params.id
  const body = await req.json()
  const { emailVerified, fullName, userType, bio, experienceLevel, skills, avatarUrl } = body
  const updated = await prisma.user.update({ where: { id }, data: {
    emailVerified,
    fullName,
    userType,
    bio,
    experienceLevel,
    skills: Array.isArray(skills) ? JSON.stringify(skills) : undefined,
    avatarUrl
  }})
  return NextResponse.json({ id: updated.id, emailVerified: updated.emailVerified })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Մուտքը արկելված է' }, { status: 403 })
  const id = params.id
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
