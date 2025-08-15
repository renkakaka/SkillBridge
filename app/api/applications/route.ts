import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'
import { getSessionFromRequest } from '@/lib/auth'
import { applicationSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const rl = await rateLimit(req.headers, { id: 'applications:create', limit: 20, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const body = await req.json()
    const parsed = applicationSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    const { projectId, coverLetter, proposedTimeline } = parsed.data
    
    if (!projectId || !coverLetter || !proposedTimeline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Проверяем, существует ли проект
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Используем пользователя из сессии
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
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

    // Notify admin about new application
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'qaramyanv210@gmail.com'
      const admin = await prisma.user.findUnique({ where: { email: adminEmail } })
      if (admin) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            type: 'project',
            title: 'Նոր դիմում նախագծին',
            message: `${user.fullName} դիմել է նախագծին: ${project.title}`,
            isImportant: true,
            metadata: JSON.stringify({ projectId, applicationId: application.id, applicantEmail: user.email })
          }
        })
      }

      // Optional: email to admin via Resend if configured
      const resendKey = process.env.RESEND_API_KEY
      const resendFrom = process.env.RESEND_FROM || 'SkillBridge <onboarding@resend.dev>'
      if (resendKey) {
        const resend = new Resend(resendKey)
        await resend.emails.send({
          from: resendFrom,
          to: adminEmail,
          subject: 'New Project Application',
         html: `<p>Applicant: ${user.fullName} (${user.email})</p><p>Project: ${project.title}</p><p>Cover letter:</p><pre>${coverLetter}</pre>`
        })
      }
    } catch (notifyErr) {
      console.warn('Admin notification failed:', notifyErr)
    }

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
