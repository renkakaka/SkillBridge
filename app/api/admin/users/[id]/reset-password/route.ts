import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

function isAdmin(req: NextRequest) {
  const headerEmail = req.headers.get('x-admin-email') || ''
  const adminEmail = process.env.ADMIN_EMAIL || ''
  return adminEmail && headerEmail.toLowerCase() === adminEmail.toLowerCase()
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Մուտքը արգելված է' }, { status: 403 })
  const id = params.id
  const { newPassword } = await req.json()
  if (!newPassword || String(newPassword).length < 6) {
    return NextResponse.json({ error: 'Գաղտնաբառը պետք է լինի առնվազն 6 նիշ' }, { status: 400 })
  }
  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id }, data: { password: hashed } })
  return NextResponse.json({ ok: true })
}
