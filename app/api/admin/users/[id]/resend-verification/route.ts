import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { Resend } from 'resend'
import { getSessionFromRequest } from '@/lib/auth'

function assertAdmin(req: NextRequest) {
  const session = getSessionFromRequest(req)
  return !!session && session.userType === 'admin'
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'Մուտքը արգելված է' }, { status: 403 })
  const id = params.id
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: 'Չգտնվեց' }, { status: 404 })

  const verificationToken = crypto.randomBytes(32).toString('hex')
  await prisma.user.update({ where: { id }, data: { verificationToken, emailVerified: false } })

  const resendKey = process.env.RESEND_API_KEY || ''
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5174'
  if (resendKey) {
    const resend = new Resend(resendKey)
    const verifyLink = `${appUrl}/auth/verify-email?email=${encodeURIComponent(user.email)}&token=${verificationToken}`
    await resend.emails.send({
      from: process.env.RESEND_FROM || 'SkillBridge <onboarding@resend.dev>',
      to: user.email,
      subject: 'Հաստատեք ձեր email-ը',
      html: `<p>Սեղմեք հղումը՝ հաստատելու համար: <a href="${verifyLink}">Հաստատել email-ը</a></p><p>Կոդը: ${verificationToken}</p>`
    })
  }

  return NextResponse.json({ ok: true })
}
