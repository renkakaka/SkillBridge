import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { rateLimit } from '@/lib/rateLimit'
import { signupSchema } from '@/lib/validations'
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(req.headers, { id: 'auth:signup', limit: 5, windowMs: 300_000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = signupSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Invalid data', 
        details: parsed.error.errors 
      }, { status: 400 })
    }

    const { email, password, fullName, userType } = parsed.data

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12)

    // Генерируем токен для верификации email
    const verificationToken = crypto.randomUUID()
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 часа

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        userType,
        verificationToken,
        verificationTokenExpires,
        emailVerified: false,
        skills: '[]',
        lastSeen: new Date(),
      }
    })

    // Создаем настройки уведомлений по умолчанию
    await prisma.userNotificationSettings.create({
      data: {
        userId: user.id,
      }
    })

    // Создаем уровень пользователя
    await prisma.userLevel.create({
      data: {
        userId: user.id,
        level: 1,
        totalPoints: 0,
      }
    })

    // Отправляем email для верификации
    try {
      console.log('📧 Sending verification email...')
      await sendVerificationEmail(email, verificationToken, fullName)
      console.log('✅ Verification email sent successfully')
      
      // Отправляем приветственный email
      console.log('🎉 Sending welcome email...')
      await sendWelcomeEmail(email, fullName)
      console.log('✅ Welcome email sent successfully')
      
    } catch (emailError) {
      console.error('❌ Failed to send emails:', emailError)
      // Не прерываем регистрацию, если email не отправился
    }

    // Убираем чувствительные данные из ответа
    const { password: _, verificationToken: __, verificationTokenExpires: ___, ...userWithoutSensitiveData } = user as any

    return NextResponse.json({
      user: userWithoutSensitiveData,
      message: 'User registered successfully. Please check your email to verify your account.'
    }, { status: 201 })

  } catch (e: unknown) {
    console.error('Signup error:', e)
    const message = e instanceof Error ? e.message : 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
