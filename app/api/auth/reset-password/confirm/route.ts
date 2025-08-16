import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { rateLimit } from '@/lib/rateLimit'
import { newPasswordSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(req.headers, { id: 'auth:reset-password-confirm', limit: 5, windowMs: 300_000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json({ 
        error: 'Token and new password are required' 
      }, { status: 400 })
    }

    // Валидируем новый пароль
    const parsed = newPasswordSchema.safeParse({ password, confirmPassword: password })
    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 })
    }

    // Находим пользователя по токену
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid or expired reset token' 
      }, { status: 400 })
    }

    // Проверяем, не истек ли токен
    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
      return NextResponse.json({ 
        error: 'Reset token has expired' 
      }, { status: 400 })
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(password, 12)

    // Обновляем пароль и очищаем токен
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        verificationToken: null, 
        verificationTokenExpires: null 
      },
    })

    return NextResponse.json({
      message: 'Password has been reset successfully'
    })

  } catch (e: unknown) {
    console.error('Password reset confirm error:', e)
    const message = e instanceof Error ? e.message : 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


