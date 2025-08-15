import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  isActive: z.boolean(),
  unsubscribedAt: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { isActive, unsubscribedAt } = updateSchema.parse(body)

    const subscription = await prisma.newsletterSubscription.update({
      where: { id },
      data: {
        isActive,
        unsubscribedAt: unsubscribedAt ? new Date(unsubscribedAt) : undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Սխալ տվյալներ', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Ներքին սերվերի սխալ' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.newsletterSubscription.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Բաժանորդագրությունը հաջողությամբ ջնջված է' })
  } catch (error) {
    console.error('Delete newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Ներքին սերվերի սխալ' },
      { status: 500 }
    )
  }
}
