// Email Configuration
// Измените эти настройки для смены провайдера email

export const emailConfig = {
  // Gmail SMTP настройки
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true для 465, false для других портов
    user: process.env.SMTP_USER || 'qaramyanv210@gmail.com',
    pass: process.env.SMTP_PASS || 'zxok ytfx qudh pivv',
    // Дополнительные настройки для Gmail
    auth: {
      type: 'OAuth2',
      user: process.env.SMTP_USER || 'qaramyanv210@gmail.com',
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
    // Настройки TLS для быстрой доставки
    tls: {
      rejectUnauthorized: false
    },
    // Настройки соединения для быстрой доставки
    connectionTimeout: 30000, // 30 секунд
    greetingTimeout: 15000,   // 15 секунд
    socketTimeout: 30000,     // 30 секунд
    // Дополнительные настройки для быстрой доставки
    pool: true,               // Использовать пул соединений
    maxConnections: 5,        // Максимум соединений
    maxMessages: 100,         // Максимум сообщений на соединение
    rateLimit: 14,            // Лимит сообщений в секунду
  },
  
  // Настройки отправителя
  from: {
    email: process.env.MAIL_FROM_EMAIL || 'qaramyanv210@gmail.com',
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
1. Gmail SMTP (текущий):
   - SMTP_HOST=smtp.gmail.com
   - SMTP_PORT=587
   - SMTP_USER=your-email@gmail.com
   - SMTP_PASS=your-app-password

2. Outlook/Hotmail:
   - SMTP_HOST=smtp-mail.outlook.com
   - SMTP_PORT=587
   - SMTP_USER=your-email@outlook.com
   - SMTP_PASS=your-password

3. Yahoo Mail:
   - SMTP_HOST=smtp.mail.yahoo.com
   - SMTP_PORT=587
   - SMTP_USER=your-email@yahoo.com
   - SMTP_PASS=your-app-password

4. Resend (если вернетесь к нему):
   - RESEND_API_KEY=your-api-key
   - Удалите SMTP_* переменные

5. Собственный SMTP сервер:
   - SMTP_HOST=your-smtp-server.com
   - SMTP_PORT=587
   - SMTP_USER=your-username
   - SMTP_PASS=your-password
*/
