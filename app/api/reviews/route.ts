import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reviewedId = searchParams.get('reviewedId')
    const reviewerId = searchParams.get('reviewerId')

    const where: any = {}
    
    if (reviewedId) where.reviewedId = reviewedId
    if (reviewerId) where.reviewerId = reviewerId

    const reviews = await prisma.review.findMany({
      where,
      include: { reviewer: true, reviewed: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reviews)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const rl = await rateLimit(req.headers, { id: 'reviews:create', limit: 60, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const { reviewedId, rating, comment } = await req.json()
    
    if (!reviewedId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Проверяем, существует ли рецензент
    const reviewer = await prisma.user.findUnique({
      where: { id: session.userId }
    })

    if (!reviewer) {
      return NextResponse.json({ error: 'Reviewer not found' }, { status: 404 })
    }

    // Проверяем, существует ли рецензируемый пользователь
    const reviewed = await prisma.user.findUnique({
      where: { id: reviewedId }
    })

    if (!reviewed) {
      return NextResponse.json({ error: 'Reviewed user not found' }, { status: 404 })
    }

    // Проверяем, не оставлял ли уже рецензент отзыв этому пользователю
    const existingReview = await prisma.review.findFirst({
      where: { reviewerId: session.userId, reviewedId }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this user' }, { status: 409 })
    }

    // Создаем отзыв
    const review = await prisma.review.create({
      data: { reviewerId: session.userId, reviewedId, rating, comment },
      include: { reviewer: true, reviewed: true }
    })

    return NextResponse.json(review)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
