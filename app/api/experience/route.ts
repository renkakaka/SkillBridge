import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const experienceLevel = searchParams.get('experienceLevel')

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { experienceLevel: true, skills: true }
      })
      return NextResponse.json(user)
    }

    if (experienceLevel) {
      const users = await prisma.user.findMany({
        where: { experienceLevel },
        select: { id: true, fullName: true, experienceLevel: true, skills: true }
      })
      return NextResponse.json(users)
    }

    return NextResponse.json({ error: 'Missing userId or experienceLevel parameter' }, { status: 400 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, experienceLevel, skills } = await req.json()
    
    if (!userId || !experienceLevel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Преобразуем skills в JSON строку
    const skillsString = Array.isArray(skills) ? JSON.stringify(skills) : user.skills

    // Обновляем опыт пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
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
