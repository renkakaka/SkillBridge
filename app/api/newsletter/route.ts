import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().email('Նշեք վավեր email հասցե'),
  consent: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, consent } = newsletterSchema.parse(body)

    // Проверяем, не подписан ли уже пользователь
    const existingSubscriber = await prisma.newsletterSubscription.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'Այս email հասցեն արդեն բաժանորդագրված է' },
        { status: 400 }
      )
    }

    // Создаем новую подписку
    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email,
        consent,
        subscribedAt: new Date(),
        isActive: true,
      },
    })

    return NextResponse.json(
      { 
        message: 'Հաջողությամբ բաժանորդագրվել եք նորություններին',
        subscription 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Սխալ տվյալներ', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Ներքին սերվերի սխալ' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const subscriptions = await prisma.newsletterSubscription.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: 'desc' },
    })

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('Get newsletter subscriptions error:', error)
    return NextResponse.json(
      { error: 'Ներքին սերվերի սխալ' },
      { status: 500 }
    )
  }
}


