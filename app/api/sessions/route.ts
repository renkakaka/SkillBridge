import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(req.url)
    const mentorId = searchParams.get('mentorId')
    const status = searchParams.get('status')

    const where: any = {}
    if (mentorId) {
      if (session.userType !== 'admin' && session.userId !== mentorId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      where.mentorId = mentorId
    } else {
      where.userId = session.userId
    }
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
    const session = getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const rl = await rateLimit(req.headers, { id: 'sessions:create', limit: 60, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const { mentorId, startTime, endTime, notes } = await req.json()
    
    if (!mentorId || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Проверяем, существует ли ментор
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId }
    })

    if (!mentor || mentor.userType !== 'mentor') {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    // Создаем сессию
            const newSession = await prisma.session.create({
      data: {
        mentorId,
        userId: session.userId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes
      },
      include: { mentor: true, user: true }
    })

            return NextResponse.json(newSession)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
