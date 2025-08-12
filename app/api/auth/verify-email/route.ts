import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Генерируем 6-значный код верификации
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email պահանջվում է' }, { status: 400 })
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json({ error: 'Օգտատեր չի գտնվել' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email արդեն հաստատված է' }, { status: 400 })
    }

    // Генерируем 6-значный код
    const verificationCode = generateVerificationCode()
    
    // Сохраняем код в базе данных
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { 
        verificationToken: verificationCode,
        verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 минут
      }
    })

    // Отправляем email через Resend (если настроен API ключ)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = require('resend')
        const resendClient = new resend(process.env.RESEND_API_KEY)
        
        await resendClient.emails.send({
          from: 'SkillBridge <noreply@skillbridge.com>',
          to: email,
          subject: 'Հաստատեք ձեր email հասցեն - SkillBridge',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6366F1;">SkillBridge - Email հաստատում</h2>
              <p>Բարև ${user.fullName}!</p>
              <p>Ձեր հաշիվը հաստատելու համար օգտագործեք այս կոդը:</p>
              <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #6366F1; font-size: 32px; margin: 0; letter-spacing: 5px;">${verificationCode}</h1>
              </div>
              <p>Այս կոդը վավեր է 10 րոպե:</p>
              <p>Եթե դուք չեք ստեղծել այս հաշիվը, կարող եք անտեսել այս նամակը:</p>
              <p>Հարգանքներով,<br>SkillBridge թիմը</p>
            </div>
          `
        })
        
        return NextResponse.json({ 
          message: 'Հաստատման նամակը ուղարկվել է ձեր email հասցեին',
          success: true
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Если отправка email не удалась, возвращаем код для разработки
        return NextResponse.json({ 
          message: 'Հաստատման նամակը ուղարկվել է',
          code: verificationCode,
          note: 'Նշում: Email-ի ուղարկումը ձախողվել է, բայց կոդը ստեղծվել է'
        })
      }
    } else {
      // Если RESEND_API_KEY не настроен, возвращаем код для разработки
      return NextResponse.json({ 
        message: 'Հաստատման նամակը ուղարկվել է',
        code: verificationCode,
        note: 'Նշում: RESEND_API_KEY չի կարգավորված, կոդը ցուցադրվում է միայն զարգացման համար'
      })
    }
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Սխալ է տեղի ունեցել' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, code } = await request.json()
    
    if (!email || !code) {
      return NextResponse.json({ error: 'Email և կոդ պահանջվում են' }, { status: 400 })
    }

    // Проверяем код верификации
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json({ error: 'Օգտատեր չի գտնվել' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email արդեն հաստատված է' }, { status: 400 })
    }

    if (user.verificationToken !== code) {
      return NextResponse.json({ error: 'Սխալ հաստատման կոդ' }, { status: 400 })
    }

    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
      return NextResponse.json({ error: 'Հաստատման կոդը ժամկետանց է' }, { status: 400 })
    }

    // Подтверждаем email
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { 
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      }
    })

    return NextResponse.json({ 
      message: 'Email հաջողությամբ հաստատվել է',
      success: true
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Սխալ է տեղի ունեցել' }, { status: 500 })
  }
}
