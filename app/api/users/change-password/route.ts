import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getSessionFromRequest } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(req.headers, { id: 'auth:change-password', limit: 5, windowMs: 300_000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Получаем сессию из cookies
    const session = getSessionFromRequest(req)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        error: 'Current password and new password are required' 
      }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: 'New password must be at least 8 characters long' 
      }, { status: 400 })
    }

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Проверяем текущий пароль
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        error: 'Current password is incorrect' 
      }, { status: 400 })
    }

    // Хешируем новый пароль
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Обновляем пароль
    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({
      message: 'Password changed successfully'
    })

  } catch (e: unknown) {
    console.error('Change password error:', e)
    const message = e instanceof Error ? e.message : 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
