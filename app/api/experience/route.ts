import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const experienceLevel = searchParams.get('experienceLevel')

    if (experienceLevel) {
      const users = await prisma.user.findMany({
        where: { experienceLevel },
        select: { id: true, fullName: true, experienceLevel: true, skills: true }
      })
      return NextResponse.json(users)
    }

    if (userId) {
      const session = getSessionFromRequest(req)
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      if (session.userType !== 'admin' && session.userId !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { experienceLevel: true, skills: true }
      })
      return NextResponse.json(user)
    }

    return NextResponse.json({ error: 'Missing userId or experienceLevel parameter' }, { status: 400 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const rl = await rateLimit(req.headers, { id: 'experience:update', limit: 60, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const { experienceLevel, skills } = await req.json()
    
    if (!experienceLevel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Преобразуем skills в JSON строку
    const skillsString = Array.isArray(skills) ? JSON.stringify(skills) : user.skills

    // Обновляем опыт пользователя
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        experienceLevel,
        skills: skillsString
      }
    })

    return NextResponse.json(updatedUser)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
