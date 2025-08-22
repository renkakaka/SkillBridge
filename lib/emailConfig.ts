// Email Configuration
// Измените эти настройки для смены провайдера email

export const emailConfig = {
  // Провайдер по умолчанию: если есть RESEND_API_KEY, используем Resend. Иначе SMTP.
  provider: process.env.RESEND_API_KEY ? 'resend' : 'smtp',
  // SMTP настройки (используются, если RESEND_API_KEY не задан)
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    // Настройки TLS
    tls: {
      rejectUnauthorized: false
    },
    // Настройки соединения
    connectionTimeout: 30000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 14,
  },
  
  // Настройки отправителя
  from: {
    email: process.env.MAIL_FROM_EMAIL || 'no-reply@skillbridge.dev',
    name: process.env.MAIL_FROM_NAME || 'SkillBridge',
  },
  
  // Настройки приложения
  app: {
    name: 'SkillBridge',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    // Армянские названия
    nameHy: 'ՍկիլԲրիջ',
    descriptionHy: 'Զարգացրեք հմտությունները փորձագետների հետ',
  },
  
  // Настройки токенов
  tokens: {
    verificationExpiry: 24 * 60 * 60 * 1000, // 24 часа в миллисекундах
    passwordResetExpiry: 60 * 60 * 1000, // 1 час в миллисекундах
  }
}

// Инструкции по смене провайдера:
/*
1. Resend (рекомендуется, бесплатно на старте):
   - RESEND_API_KEY=your-api-key
   - MAIL_FROM_EMAIL=your-verified-domain-email@example.com
   - MAIL_FROM_NAME=SkillBridge

2. SMTP (любой провайдер):
   - SMTP_HOST=smtp.example.com
   - SMTP_PORT=587
   - SMTP_USER=username
   - SMTP_PASS=password
   - MAIL_FROM_EMAIL=from@example.com
   - MAIL_FROM_NAME=SkillBridge

3. Outlook/Hotmail:
   - SMTP_HOST=smtp-mail.outlook.com
   - SMTP_PORT=587
   - SMTP_USER=your-email@outlook.com
   - SMTP_PASS=your-password

4. Yahoo Mail:
   - SMTP_HOST=smtp.mail.yahoo.com
   - SMTP_PORT=587
   - SMTP_USER=your-email@yahoo.com
   - SMTP_PASS=your-app-password

5. Собственный SMTP сервер:
   - SMTP_HOST=your-smtp-server.com
   - SMTP_PORT=587
   - SMTP_USER=your-username
   - SMTP_PASS=your-password
*/
