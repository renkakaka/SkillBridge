import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const mentorId = searchParams.get('mentorId')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (mentorId) where.mentorId = mentorId
    if (userId) where.userId = userId
    if (status) where.status = status

    const sessions = await prisma.session.findMany({
      where,
      include: { mentor: true, user: true },
      orderBy: { startTime: 'desc' }
    })

    return NextResponse.json(sessions)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { mentorId, userId, startTime, endTime, notes } = await req.json()
    
    if (!mentorId || !userId || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Проверяем, существует ли ментор
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId }
    })

    if (!mentor || mentor.userType !== 'mentor') {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Создаем сессию
    const session = await prisma.session.create({
      data: {
        mentorId,
        userId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes
      },
      include: { mentor: true, user: true }
    })

    return NextResponse.json(session)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
