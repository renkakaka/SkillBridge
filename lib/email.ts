import nodemailer from 'nodemailer'
import { emailConfig } from './emailConfig'
import { emailTemplates } from './emailTemplates'

// Создаем транспортер для SMTP с оптимизацией для быстрой доставки
const createTransporter = () => {
  const config = {
    host: emailConfig.smtp.host,
    port: emailConfig.smtp.port,
    secure: emailConfig.smtp.secure,
    auth: {
      user: emailConfig.smtp.user,
      pass: emailConfig.smtp.pass,
    },
    // Дополнительные настройки для надежности и быстрой доставки
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 30000, // 30 секунд
    greetingTimeout: 15000,   // 15 секунд
    socketTimeout: 30000,     // 30 секунд
    // Настройки пула для быстрой доставки
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 14,
  }
  
  console.log('Creating optimized SMTP transporter with config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    pass: config.auth.pass ? '***' : 'undefined',
    pool: config.pool,
    maxConnections: config.maxConnections
  })
  
  return nodemailer.createTransport(config)
}

export async function sendVerificationEmail(email: string, token: string, name: string) {
  try {
    console.log(`🚀 Sending beautiful verification email to: ${email}`)
    console.log(`Using optimized email config:`, {
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      fromEmail: emailConfig.from.email,
      fromName: emailConfig.from.name
    })
    
    const verificationUrl = `${emailConfig.app.url}/auth/verify-email?token=${token}`
    console.log(`✨ Verification URL: ${verificationUrl}`)
    
    const transporter = createTransporter()
    
    // Проверяем соединение (быстро)
    console.log('🔍 Verifying SMTP connection...')
    try {
      await transporter.verify()
      console.log('✅ SMTP connection verified successfully')
    } catch (verifyError) {
      console.error('⚠️ SMTP verification failed:', verifyError)
      // Продолжаем попытку отправки даже если верификация не прошла
    }
    
    // Используем красивый HTML шаблон на армянском языке
    const htmlContent = emailTemplates.verificationEmail(
      name, 
      verificationUrl, 
      emailConfig.app.nameHy || emailConfig.app.name
    )
    
    const mailOptions = {
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: email,
      subject: `Հաստատեք ձեր ${emailConfig.app.nameHy || emailConfig.app.name} հաշիվը ✨`,
      html: htmlContent,
      // Дополнительные заголовки для быстрой доставки
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'SkillBridge Email System'
      }
    }
    
    console.log('📧 Sending beautiful email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    })
    
    const result = await transporter.sendMail(mailOptions)
    console.log('🎉 Beautiful verification email sent successfully:', result.messageId)
    
    return result
  } catch (error) {
    console.error('❌ Detailed error in sendVerificationEmail:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Возвращаем более детальную ошибку на армянском языке
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        throw new Error('Gmail-ի հավաստագրման սխալ: Ստուգեք ձեր email-ը և հավելվածի գաղտնաբառը')
      } else if (error.message.includes('Connection timeout')) {
        throw new Error('Gmail-ի կապի ժամանակահատվածը լրացել է: Ստուգեք ձեր ինտերնետ կապը')
      } else if (error.message.includes('Authentication failed')) {
        throw new Error('Gmail-ի հավաստագրման սխալ: Համոզվեք, որ 2FA-ն միացված է և հավելվածի գաղտնաբառը ճիշտ է')
      }
    }
    
    throw new Error(`Email հաստատման նամակ ուղարկելու սխալ: ${error instanceof Error ? error.message : 'Անհայտ սխալ'}`)
  }
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  try {
    console.log(`🔐 Sending beautiful password reset email to: ${email}`)
    
    const resetUrl = `${emailConfig.app.url}/auth/reset-password/confirm?token=${token}`
    console.log(`🔑 Reset URL: ${resetUrl}`)
    
    const transporter = createTransporter()
    
    // Проверяем соединение (быстро)
    try {
      await transporter.verify()
    } catch (verifyError) {
      console.error('⚠️ SMTP verification failed:', verifyError)
    }
    
    // Используем красивый HTML шаблон для сброса пароля на армянском языке
    const htmlContent = emailTemplates.passwordResetEmail(
      name, 
      resetUrl, 
      emailConfig.app.nameHy || emailConfig.app.name
    )
    
    const mailOptions = {
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: email,
      subject: `Վերակայեք ձեր ${emailConfig.app.nameHy || emailConfig.app.name} գաղտնաբառը 🔐`,
      html: htmlContent,
      // Дополнительные заголовки для быстрой доставки
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'SkillBridge Email System'
      }
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('🎉 Beautiful password reset email sent successfully:', result.messageId)
    
    return result
  } catch (error) {
    console.error('❌ Detailed error in sendPasswordResetEmail:', error)
    throw new Error(`Գաղտնաբառ վերակայելու email ուղարկելու սխալ: ${error instanceof Error ? error.message : 'Անհայտ սխալ'}`)
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    console.log(`🎉 Sending beautiful welcome email to: ${email}`)
    
    const transporter = createTransporter()
    
    // Используем красивый HTML шаблон для приветствия на армянском языке
    const htmlContent = emailTemplates.welcomeEmail(
      name, 
      emailConfig.app.nameHy || emailConfig.app.name
    )
    
    const mailOptions = {
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: email,
      subject: `Բարի գալուստ ${emailConfig.app.nameHy || emailConfig.app.name}! 🎉`,
      html: htmlContent,
      // Дополнительные заголовки для быстрой доставки
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'SkillBridge Email System'
      }
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('🎉 Beautiful welcome email sent successfully:', result.messageId)
    
    return result
  } catch (error) {
    console.error('❌ Detailed error in sendWelcomeEmail:', error)
    throw new Error(`Բարի գալուստ email ուղարկելու սխալ: ${error instanceof Error ? error.message : 'Անհայտ սխալ'}`)
  }
}
