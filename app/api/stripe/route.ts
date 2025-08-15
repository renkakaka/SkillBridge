import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSessionFromRequest } from '@/lib/auth'

// During static build, avoid initializing Stripe if key is missing to prevent build-time errors
const stripeKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2023-10-16' })
  : null as unknown as Stripe

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { amount, currency = 'usd', description, customerEmail } = await req.json()
    
    if (!amount || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Создаем платежное намерение
    if (!stripeKey || !stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe использует центы
      currency,
      description,
      customer_email: customerEmail,
      metadata: { userId: session.userId },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentIntentId = searchParams.get('paymentIntentId')

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing paymentIntentId parameter' }, { status: 400 })
    }

    if (!stripeKey || !stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return NextResponse.json(paymentIntent)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
