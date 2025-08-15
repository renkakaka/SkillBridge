import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { client: true, applications: { include: { user: true } } }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    
    // Ensure only owner (clientId) or admin can update
    const existing = await prisma.project.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    if (session.userType !== 'admin' && existing.clientId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: body,
      include: { client: true }
    })

    return NextResponse.json(project)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const existing = await prisma.project.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    if (session.userType !== 'admin' && existing.clientId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    // Удаляем зависимые заявки перед удалением проекта
    await prisma.application.deleteMany({ where: { projectId: params.id } })
    // При необходимости можно удалить связанные уведомления/прочее тут
    await prisma.project.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
