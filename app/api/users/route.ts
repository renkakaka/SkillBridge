import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  try {
    const adminEmailHeader = req.headers.get('x-admin-email') || ''
    const adminEmailEnv = process.env.ADMIN_EMAIL || ''

    if (!adminEmailEnv || adminEmailHeader.toLowerCase() !== adminEmailEnv.toLowerCase()) {
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
    const { email, password, fullName, userType, avatarUrl, bio, experienceLevel, skills } = await req.json()
    
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

    return NextResponse.json({
      ...userWithoutSensitiveData,
      message: 'Հաշիվը ստեղծվեց։ Խնդրում ենք հաստատել ձեր email հասցեն՝ շարունակելու համար'
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Անհայտ սխալ'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
