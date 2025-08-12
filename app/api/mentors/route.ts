import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const experienceLevel = searchParams.get('experienceLevel')
    const skills = searchParams.get('skills')

    const where: any = { userType: 'mentor', emailVerified: true }
    
    if (experienceLevel) where.experienceLevel = experienceLevel
    if (skills) {
      // Поиск по навыкам (простейшая реализация)
      where.skills = { contains: skills }
    }

    const mentors = await prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        experienceLevel: true,
        skills: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Получаем рейтинги для каждого ментора
    const mentorsWithRatings = await Promise.all(
      mentors.map(async (mentor) => {
        const reviews = await prisma.review.findMany({
          where: { reviewedId: mentor.id },
          select: { rating: true }
        })

        const averageRating = reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0

        return {
          ...mentor,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: reviews.length
        }
      })
    )

    return NextResponse.json(mentorsWithRatings)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
