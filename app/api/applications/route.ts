import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { projectId, coverLetter, proposedTimeline, userEmail } = await req.json()
    
    if (!projectId || !coverLetter || !proposedTimeline || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Проверяем, существует ли проект
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Создаем заявку
    const application = await prisma.application.create({
      data: {
        projectId,
        userId: user.id,
        coverLetter,
        proposedTimeline: parseInt(proposedTimeline)
      }
    })

    return NextResponse.json(application)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    if (projectId) {
      const applications = await prisma.application.findMany({
        where: { projectId, ...(status ? { status: status as any } : {}) },
        include: { user: true, project: true }
      })
      return NextResponse.json(applications)
    }

    if (userId) {
      const applications = await prisma.application.findMany({
        where: { userId },
        include: { project: true }
      })
      return NextResponse.json(applications)
    }

    return NextResponse.json({ error: 'Missing projectId or userId parameter' }, { status: 400 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
