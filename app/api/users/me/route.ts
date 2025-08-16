import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    // Получаем сессию из cookies
    const session = getSessionFromRequest(req)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Находим пользователя в базе данных
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        userType: true,
        avatarUrl: true,
        bio: true,
        experienceLevel: true,
        skills: true,
        emailVerified: true,
        lastSeen: true,
        createdAt: true,
        // Исключаем чувствительные данные
        password: false,
        verificationToken: false,
        verificationTokenExpires: false,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Обновляем время последнего посещения
    await prisma.user.update({
      where: { id: session.userId },
      data: { lastSeen: new Date() }
    })

    return NextResponse.json({ user })

  } catch (e: unknown) {
    console.error('Get user error:', e)
    const message = e instanceof Error ? e.message : 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Получаем сессию из cookies
    const session = getSessionFromRequest(req)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { fullName, bio, experienceLevel, skills } = body

    // Обновляем профиль пользователя
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        fullName: fullName || undefined,
        bio: bio || undefined,
        experienceLevel: experienceLevel || undefined,
        skills: skills ? JSON.stringify(skills) : undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        userType: true,
        avatarUrl: true,
        bio: true,
        experienceLevel: true,
        skills: true,
        emailVerified: true,
        lastSeen: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ user: updatedUser })

  } catch (e: unknown) {
    console.error('Update user error:', e)
    const message = e instanceof Error ? e.message : 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
