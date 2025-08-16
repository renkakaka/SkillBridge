import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { setSessionCookie } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'
import { loginSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(req.headers, { id: 'auth:signin', limit: 10, windowMs: 60_000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }
    const { email, password } = parsed.data
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Проверяем, подтвержден ли email
    if (!user.emailVerified) {
      return NextResponse.json({ 
        error: 'Please verify your email before signing in',
        needsVerification: true,
        email: user.email
      }, { status: 403 })
    }

    // Устанавливаем защищенную сессию в cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      userType: user.userType as any,
      emailVerified: Boolean(user.emailVerified),
    })

    // Убираем пароль из ответа
    const { password: _, verificationToken: __, verificationTokenExpires: ___, ...userWithoutPassword } = user as any

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Sign in successful'
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
