import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimit(request.headers, { id: 'auth:verify-email', limit: 5, windowMs: 60_000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await request.json()
    const { token, email, resend } = body

    // If we have a token, verify it
    if (token) {
      const user = await prisma.user.findUnique({
        where: { verificationToken: token }
      })

      if (!user) {
        return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 })
      }

      if (user.emailVerified) {
        return NextResponse.json({ error: 'Email is already verified' }, { status: 400 })
      }

      if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
        return NextResponse.json({ error: 'Verification token has expired' }, { status: 400 })
      }

      // Mark email as verified
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          emailVerified: true, 
          verificationToken: null, 
          verificationTokenExpires: null 
        },
      })

      return NextResponse.json({ 
        message: 'Email verified successfully',
        success: true 
      })
    }

    // If we have an email and resend flag, send new verification email
    if (email && resend) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      if (user.emailVerified) {
        return NextResponse.json({ error: 'Email is already verified' }, { status: 400 })
      }

      // Generate new verification token
      const verificationToken = crypto.randomUUID()
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          verificationToken, 
          verificationTokenExpires 
        },
      })

      try {
        await sendVerificationEmail(email, verificationToken, user.fullName)
        return NextResponse.json({ 
          message: 'Verification email sent successfully',
          success: true 
        })
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError)
        return NextResponse.json({ 
          error: 'Failed to send verification email' 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
