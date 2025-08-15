import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { getSessionFromRequest } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'
import { signupSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req)
    if (!session || session.userType !== 'admin') {
      return NextResponse.json({ error: 'Մուտքը արգելված է' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })

    const safe = users.map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      userType: u.userType,
      emailVerified: u.emailVerified,
      createdAt: u.createdAt,
      experienceLevel: u.experienceLevel || null,
      skills: (() => { try { return JSON.parse(u.skills || '[]') } catch { return [] } })()
    }))

    return NextResponse.json({ count: safe.length, users: safe })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Անհայտ սխալ'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(req.headers, { id: 'auth:signup', limit: 10, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const body = await req.json()
    const parsed = signupSchema.safeParse({ ...body, confirmPassword: body.password })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Պահանջվող դաշտերը բացակայում են' }, { status: 400 })
    }
    const { email, password, fullName, userType, avatarUrl, bio, experienceLevel, skills } = body
    
    if (!email || !password || !fullName || !userType) {
      return NextResponse.json({ error: 'Պահանջվող դաշտերը բացակայում են' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Այս email-ով հաշիվ արդեն գոյություն ունի' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const skillsString = Array.isArray(skills) ? JSON.stringify(skills) : '[]'
    const verificationToken = crypto.randomBytes(32).toString('hex')

    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword,
        fullName, 
        userType, 
        avatarUrl, 
        bio, 
        experienceLevel, 
        skills: skillsString,
        emailVerified: false,
        verificationToken
      },
    })

    const { password: _, verificationToken: __, ...userWithoutSensitiveData } = user

    // Create welcome message conversation from admin to the new user
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'qaramyanv210@gmail.com'
      const admin = await prisma.user.findUnique({ where: { email: adminEmail } })
      if (admin) {
        const conversation = await prisma.conversation.create({
          data: {
            participant1Id: admin.id,
            participant2Id: user.id,
          }
        })
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: admin.id,
            recipientId: user.id,
            content: 'Բարի գալուստ SkillBridge! Ես ադմինն եմ։ Ահա կարճ հրահանգներ՝ լրացրեք պրոֆիլը, ավելացրեք ձեր հմտությունները և այցելեք Marketplace, որպեսզի դիմեք նախագծերին։ Եթե հարցեր ունեք, գրեք ինձ այստեղ։',
            type: 'text',
            isRead: false,
          }
        })
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'message',
            title: 'Բարի գալուստ հաղորդագրություն',
            message: 'Դուք ստացել եք ողջույնի նամակ ադմինից',
            isImportant: true,
            senderId: admin.id,
          }
        })
      }
    } catch (welcomeErr) {
      console.warn('Welcome message creation failed:', welcomeErr)
    }

    return NextResponse.json({
      ...userWithoutSensitiveData,
      message: 'Հաշիվը ստեղծվեց։ Խնդրում ենք հաստատել ձեր email հասցեն՝ շարունակելու համար'
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Անհայտ սխալ'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
