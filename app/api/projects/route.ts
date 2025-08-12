import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const projectType = searchParams.get('projectType')
    const difficultyLevel = searchParams.get('difficultyLevel')

    const where: any = {}
    
    if (status) where.status = status
    if (projectType) where.projectType = projectType
    if (difficultyLevel) where.difficultyLevel = difficultyLevel

    const projects = await prisma.project.findMany({
      where,
      include: { client: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { 
      title, 
      description, 
      projectType, 
      requiredSkills, 
      budgetMin, 
      budgetMax, 
      durationWeeks, 
      difficultyLevel,
      clientId 
    } = await req.json()
    
    if (!title || !description || !projectType || budgetMin === undefined || budgetMax === undefined || !durationWeeks || !difficultyLevel || !clientId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Проверяем, существует ли клиент
    const client = await prisma.user.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Преобразуем requiredSkills в JSON строку
    const requiredSkillsString = Array.isArray(requiredSkills) ? JSON.stringify(requiredSkills) : '[]'

    // Создаем проект
    const project = await prisma.project.create({
      data: {
        title,
        description,
        projectType,
        requiredSkills: requiredSkillsString,
        budgetMin: parseInt(budgetMin),
        budgetMax: parseInt(budgetMax),
        durationWeeks: parseInt(durationWeeks),
        difficultyLevel,
        clientId
      },
      include: { client: true }
    })

    return NextResponse.json(project)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
