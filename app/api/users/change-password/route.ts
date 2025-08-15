import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getSessionFromRequest } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Չստուգված մուտք' }, { status: 401 })
    const rl = await rateLimit(req.headers, { id: 'user:change-password', limit: 5, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const { currentPassword, newPassword } = await req.json()
    if (!newPassword || String(newPassword).length < 6) {
      return NextResponse.json({ error: 'Գաղտնաբառը պետք է լինի առնվազն 6 նիշ' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user) return NextResponse.json({ error: 'Չգտնվեց' }, { status: 404 })
    const ok = await bcrypt.compare(currentPassword || '', user.password)
    if (!ok) return NextResponse.json({ error: 'Սխալ ընթացիկ գաղտնաբառ' }, { status: 400 })
    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: session.userId }, data: { password: hashed } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Սխալ' }, { status: 400 })
  }
}
