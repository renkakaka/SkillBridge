import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getSessionFromRequest } from '@/lib/auth'

function assertAdmin(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session || session.userType !== 'admin') {
    return false
  }
  return true
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'Մուտքը արգելված է' }, { status: 403 })
  const id = params.id
  const u = await prisma.user.findUnique({ where: { id } })
  if (!u) return NextResponse.json({ error: 'Չգտնվեց' }, { status: 404 })
  const { password: _pw, verificationToken: _vt, ...safe } = u as any
  return NextResponse.json(safe)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'Մուտքը արգելված է' }, { status: 403 })
  const id = params.id
  const body = await req.json()
  const { emailVerified, fullName, userType, bio, experienceLevel, skills, avatarUrl } = body
  const updated = await prisma.user.update({ where: { id }, data: {
    emailVerified,
    fullName,
    userType,
    bio,
    experienceLevel,
    skills: Array.isArray(skills) ? JSON.stringify(skills) : undefined,
    avatarUrl
  }})
  return NextResponse.json({ id: updated.id, emailVerified: updated.emailVerified })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'Մուտքը արկելված է' }, { status: 403 })
  const id = params.id
  // Каскадное удаление зависимых записей
  // Сообщения
  await prisma.message.deleteMany({ where: { OR: [{ senderId: id }, { recipientId: id }] } })
  // Разговоры
  await prisma.conversation.deleteMany({ where: { OR: [{ participant1Id: id }, { participant2Id: id }] } })
  // Уведомления и настройки
  await prisma.notification.deleteMany({ where: { userId: id } })
  await prisma.userNotificationSettings.deleteMany({ where: { userId: id } })
  // Портфолио
  await prisma.portfolioProject.deleteMany({ where: { userId: id } })
  await prisma.portfolioSkill.deleteMany({ where: { userId: id } })
  // Транзакции
  await prisma.transaction.deleteMany({ where: { userId: id } })
  // Достижения и уровни
  await prisma.userAchievement.deleteMany({ where: { userId: id } })
  await prisma.userLevel.deleteMany({ where: { userId: id } })
  // Сессии и отзывы
  await prisma.session.deleteMany({ where: { OR: [{ mentorId: id }, { userId: id }] } })
  await prisma.review.deleteMany({ where: { OR: [{ reviewerId: id }, { reviewedId: id }] } })
  // Заявки
  await prisma.application.deleteMany({ where: { userId: id } })
  // Проекты пользователя (как клиента) + связанные заявки
  const projects = await prisma.project.findMany({ where: { clientId: id }, select: { id: true } })
  const projectIds = projects.map(p => p.id)
  if (projectIds.length > 0) {
    await prisma.application.deleteMany({ where: { projectId: { in: projectIds } } })
    await prisma.project.deleteMany({ where: { id: { in: projectIds } } })
  }
  // Наконец удаляем пользователя
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
