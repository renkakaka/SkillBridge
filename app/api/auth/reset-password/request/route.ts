import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) return NextResponse.json({ ok: true })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000)
    await prisma.user.update({ where: { id: user.id }, data: { verificationToken: token, verificationTokenExpires: expires } })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5174'
    const resetLink = `${appUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`
    const subject = 'Reset your password'
    const html = `<p>Hello ${user.fullName},</p><p>Reset your password: <a href="${resetLink}">Reset</a></p><p>This link expires in 1 hour.</p>`

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)
      await resend.emails.send({ from: process.env.RESEND_FROM || 'SkillBridge <onboarding@resend.dev>', to: email, subject, html })
    } else {
      const host = process.env.SMTP_HOST
      const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
      const userName = process.env.SMTP_USER
      const pass = process.env.SMTP_PASS
      if (host && port && userName && pass) {
        const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user: userName, pass } })
        await transporter.sendMail({ from: process.env.MAIL_FROM_EMAIL || 'no-reply@skillbridge.local', to: email, subject, html })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


