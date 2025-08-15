import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// GET /api/portfolio - Получить портфолио пользователя
export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(request.url)
    const userId = session.userId
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Получаем портфолио проекты пользователя
    const projects = await prisma.portfolioProject.findMany({
      where: {
        userId,
        ...(category !== 'all' ? { category } : {}),
        ...(search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { tags: { contains: search, mode: 'insensitive' } },
          ]
        } : {})
      },
      orderBy: { createdAt: 'desc' }
    })

    // Получаем навыки пользователя для портфолио
    const skills = await prisma.portfolioSkill.findMany({
      where: { userId },
      orderBy: { level: 'desc' }
    })

    // Рассчитываем статистику
    const totalProjects = projects.length
    const totalEarnings = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
    const averageRating = projects.length > 0 
      ? projects.reduce((sum, p) => sum + (p.rating || 0), 0) / projects.length 
      : 0
    const completedProjects = projects.filter((p: any) => p.status === 'completed').length
    const activeProjects = projects.filter((p: any) => p.status === 'in-progress').length

    const stats = {
      totalProjects,
      totalEarnings,
      averageRating: Math.round(averageRating * 10) / 10,
      completedProjects,
      activeProjects,
      skillsCount: skills.length
    }

    return NextResponse.json({
      projects,
      skills,
      stats
    })
  } catch (error) {
    console.error('Portfolio API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

// POST /api/portfolio - Создать новый проект или навык
export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const { type, data } = body
    const userId = session.userId

    if (type === 'project') {
      const project = await prisma.portfolioProject.create({
        data: {
          ...data,
          userId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      return NextResponse.json({ project, message: 'Project created successfully' })
    }

    if (type === 'skill') {
      const skill = await prisma.portfolioSkill.create({
        data: {
          ...data,
          userId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      return NextResponse.json({ skill, message: 'Skill created successfully' })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Portfolio creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    )
  }
}

// PUT /api/portfolio - Обновить проект или навык
export async function PUT(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const { type, id, data } = body
    const userId = session.userId

    if (type === 'project') {
      const project = await prisma.portfolioProject.update({
        where: { id, userId },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      return NextResponse.json({ project, message: 'Project updated successfully' })
    }

    if (type === 'skill') {
      const skill = await prisma.portfolioSkill.update({
        where: { id, userId },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      return NextResponse.json({ skill, message: 'Skill updated successfully' })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Portfolio update error:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
      { status: 500 }
    )
  }
}

// DELETE /api/portfolio - Удалить проект или навык
export async function DELETE(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')
    const userId = session.userId

    if (!userId || !id || !type) {
      return NextResponse.json({ error: 'Type, ID and User ID are required' }, { status: 400 })
    }

    if (type === 'project') {
      await prisma.portfolioProject.delete({
        where: { id, userId }
      })
      return NextResponse.json({ message: 'Project deleted successfully' })
    }

    if (type === 'skill') {
      await prisma.portfolioSkill.delete({
        where: { id, userId }
      })
      return NextResponse.json({ message: 'Skill deleted successfully' })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Portfolio deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    )
  }
}
