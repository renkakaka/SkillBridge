import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getSessionFromRequest } from '@/lib/auth'

function assertAdmin(req: NextRequest) {
  const session = getSessionFromRequest(req)
  return !!session && session.userType === 'admin'
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'Մուտքը արգելված է' }, { status: 403 })
  const id = params.id
  const { newPassword } = await req.json()
  if (!newPassword || String(newPassword).length < 6) {
    return NextResponse.json({ error: 'Գաղտնաբառը պետք է լինի առնվազն 6 նիշ' }, { status: 400 })
  }
  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id }, data: { password: hashed } })
  return NextResponse.json({ ok: true })
}
