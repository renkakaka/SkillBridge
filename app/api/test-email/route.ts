import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    console.log(`Testing email configuration for: ${email}`)
    
    // Генерируем тестовый токен
    const testToken = 'test-token-' + Date.now()
    
    // Отправляем тестовый email
    const result = await sendVerificationEmail(email, testToken, 'Test User')
    
    return NextResponse.json({ 
      message: 'Test email sent successfully',
      messageId: result.messageId,
      email: email
    })
    
  } catch (error) {
    console.error('Test email error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
