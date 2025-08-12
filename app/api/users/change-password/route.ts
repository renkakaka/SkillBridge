import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  try {
    const email = req.headers.get('x-user-email') || ''
    if (!email) return NextResponse.json({ error: 'Չկա email' }, { status: 401 })
    const { currentPassword, newPassword } = await req.json()
    if (!newPassword || String(newPassword).length < 6) {
      return NextResponse.json({ error: 'Գաղտնաբառը պետք է լինի առնվազն 6 նիշ' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Չգտնվեց' }, { status: 404 })
    const ok = await bcrypt.compare(currentPassword || '', user.password)
    if (!ok) return NextResponse.json({ error: 'Սխալ ընթացիկ գաղտնաբառ' }, { status: 400 })
    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { email }, data: { password: hashed } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Սխալ' }, { status: 400 })
  }
}
