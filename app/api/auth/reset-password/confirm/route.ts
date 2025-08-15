import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, token, newPassword } = await req.json()
    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (String(newPassword).length < 8) {
      return NextResponse.json({ error: 'Password too short' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!user.verificationToken || user.verificationToken !== token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }
    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, verificationToken: null, verificationTokenExpires: null }
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


