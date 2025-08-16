import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'

export async function POST(req: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }
  const stripe = new Stripe(stripeSecret, { apiVersion: '2025-07-30.basil' })

  const headersStore = await headers()
  const sig = headersStore.get('stripe-signature') || ''
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    return new NextResponse(`Webhook Error: ${(err as any).message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        const amount = Math.round((pi.amount_received || pi.amount || 0) / 100)
        const description = pi.description || 'Payment'
        const userId = (pi.metadata && (pi.metadata.userId as string)) || ''
        if (userId) {
          await prisma.transaction.create({
            data: {
              userId,
              type: 'income',
              amount,
              description,
              status: 'completed',
              metadata: JSON.stringify({ paymentIntentId: pi.id })
            }
          })
        }
        try {
          const resendKey = process.env.RESEND_API_KEY
          if (resendKey && userId) {
            const resend = new Resend(resendKey)
            await resend.emails.send({
              from: process.env.RESEND_FROM || 'SkillBridge <onboarding@resend.dev>',
              to: process.env.ADMIN_EMAIL || 'admin@example.com',
              subject: 'Stripe payment succeeded',
              html: `<p>User: ${userId}</p><p>Amount: ${amount}</p><p>PI: ${pi.id}</p>`
            })
          }
        } catch {}
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        const userId = (pi.metadata && (pi.metadata.userId as string)) || ''
        if (userId) {
          await prisma.transaction.create({
            data: {
              userId,
              type: 'refund',
              amount: 0,
              description: 'Payment failed',
              status: 'failed',
              metadata: JSON.stringify({ paymentIntentId: pi.id })
            }
          })
        }
        try {
          const resendKey = process.env.RESEND_API_KEY
          if (resendKey && userId) {
            const resend = new Resend(resendKey)
            await resend.emails.send({
              from: process.env.RESEND_FROM || 'SkillBridge <onboarding@resend.dev>',
              to: process.env.ADMIN_EMAIL || 'admin@example.com',
              subject: 'Stripe payment failed',
              html: `<p>User: ${userId}</p><p>PI: ${pi.id}</p>`
            })
          }
        } catch {}
        break
      }
      default:
        break
    }
  } catch (e) {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}


