import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'
import { sendPasswordResetEmail } from '@/lib/email'
import { passwordResetSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(req.headers, { id: 'auth:reset-password', limit: 3, windowMs: 300_000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = passwordResetSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Invalid email address' 
      }, { status: 400 })
    }

    const { email } = parsed.data

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      // Не раскрываем информацию о существовании пользователя
      return NextResponse.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      })
    }

    // Генерируем токен для сброса пароля
    const resetToken = crypto.randomUUID()
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 час

    // Сохраняем токен в базе данных
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        verificationToken: resetToken, 
        verificationTokenExpires: resetTokenExpires 
      },
    })

    // Отправляем email для сброса пароля
    try {
      await sendPasswordResetEmail(email, resetToken, user.fullName)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      return NextResponse.json({ 
        error: 'Failed to send password reset email' 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    })

  } catch (e: unknown) {
    console.error('Password reset request error:', e)
    const message = e instanceof Error ? e.message : 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


