import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { rateLimit } from '@/lib/rateLimit'

const prisma = new PrismaClient()

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendVerificationEmail({ to, fullName, code }: { to: string; fullName: string; code: string }) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'SkillBridge'
  const fromName = process.env.MAIL_FROM_NAME || appName
  const fromEmail = process.env.MAIL_FROM_EMAIL || 'no-reply@skillbridge.local'
  const subject = 'Հաստատեք ձեր email հասցեն'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366F1;">${appName} - Email հաստատում</h2>
      <p>Բարև ${fullName}!</p>
      <p>Ձեր հաշիվը հաստատելու համար օգտագործեք այս կոդը:</p>
      <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #6366F1; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
      </div>
      <p>Այս կոդը վավեր է 10 րոպե:</p>
      <p>Եթե դուք չեք ստեղծել այս հաշիվը, կարող եք անտեսել այս նամակը:</p>
      <p>Հարգանքներով,<br>${appName} թիմը</p>
    </div>
  `

  // 1) Resend
  const resendKey = process.env.RESEND_API_KEY
  const resendFrom = process.env.RESEND_FROM || `${fromName} <onboarding@resend.dev>`
  if (resendKey) {
    const resend = new Resend(resendKey)
    await resend.emails.send({ from: resendFrom, to, subject, html })
    return
  }

  // 2) SMTP via Nodemailer
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (host && port && user && pass) {
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
    await transporter.sendMail({ from: `${fromName} <${fromEmail}>`, to, subject, html })
    return
  }

  // 3) Supabase SMTP relay (treated as SMTP)
  const supaHost = process.env.SUPABASE_SMTP_HOST
  const supaPort = process.env.SUPABASE_SMTP_PORT ? parseInt(process.env.SUPABASE_SMTP_PORT, 10) : undefined
  const supaUser = process.env.SUPABASE_SMTP_USER
  const supaPass = process.env.SUPABASE_SMTP_PASS
  if (supaHost && supaPort && supaUser && supaPass) {
    const transporter = nodemailer.createTransport({ host: supaHost, port: supaPort, secure: supaPort === 465, auth: { user: supaUser, pass: supaPass } })
    await transporter.sendMail({ from: `${fromName} <${fromEmail}>`, to, subject, html })
    return
  }

  throw new Error('No email provider configured')
}

export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimit(request.headers, { id: 'auth:verify-email-post', limit: 5, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email պահանջվում է' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) return NextResponse.json({ error: 'Օգտատեր չի գտնվել' }, { status: 404 })
    if (user.emailVerified) return NextResponse.json({ error: 'Email արդեն հաստատված է' }, { status: 400 })

    const verificationCode = generateVerificationCode()
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { verificationToken: verificationCode, verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000) },
    })

    try {
      await sendVerificationEmail({ to: email, fullName: user.fullName, code: verificationCode })
      return NextResponse.json({ message: 'Հաստատման նամակը ուղարկվել է ձեր email հասցեին', success: true })
    } catch (e) {
      console.warn('Email not configured; returning code in response for dev', e)
      return NextResponse.json({ message: 'Հաստատման նամակը (DEV)', code: verificationCode })
    }
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Սխալ է տեղի ունեցել' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const rl = await rateLimit(request.headers, { id: 'auth:verify-email-put', limit: 10, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const { email, code } = await request.json()
    if (!email || !code) return NextResponse.json({ error: 'Email և կոդ պահանջվում են' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) return NextResponse.json({ error: 'Օգտատեր չի գտնվել' }, { status: 404 })
    if (user.emailVerified) return NextResponse.json({ error: 'Email արդեն հաստատված է' }, { status: 400 })
    if (user.verificationToken !== code) return NextResponse.json({ error: 'Սխալ հաստատման կոդ' }, { status: 400 })
    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) return NextResponse.json({ error: 'Հաստատման կոդը ժամկետանց է' }, { status: 400 })

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: true, verificationToken: null, verificationTokenExpires: null },
    })

    return NextResponse.json({ message: 'Email հաջողությամբ հաստատվել է', success: true })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Սխալ է տեղի ունեցել' }, { status: 500 })
  }
}
