# 📧 Настройка Email для SkillBridge

## 🎯 Текущая конфигурация: Gmail SMTP

Ваш email настроен для работы через Gmail SMTP:
- **Email**: qaramyanv210@gmail.com
- **Пароль приложения**: zxok ytfx qudh pivv
- **SMTP сервер**: smtp.gmail.com:587

## 🔧 Как изменить email провайдера

### 1. **Gmail SMTP** (текущий - бесплатно)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM_EMAIL=your-email@gmail.com
MAIL_FROM_NAME=SkillBridge
```

### 2. **Outlook/Hotmail** (бесплатно)
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
MAIL_FROM_EMAIL=your-email@outlook.com
MAIL_FROM_NAME=SkillBridge
```

### 3. **Yahoo Mail** (бесплатно)
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
MAIL_FROM_EMAIL=your-email@yahoo.com
MAIL_FROM_NAME=SkillBridge
```

### 4. **Resend** (100 email/день бесплатно)
```env
RESEND_API_KEY=your-api-key
# Удалите все SMTP_* переменные
```

### 5. **Собственный SMTP сервер**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
MAIL_FROM_EMAIL=your-email@domain.com
MAIL_FROM_NAME=SkillBridge
```

## 📝 Пошаговая инструкция по смене

### Шаг 1: Выберите новый провайдер
Выберите один из вариантов выше

### Шаг 2: Обновите .env файл
Замените соответствующие переменные в файле `.env`

### Шаг 3: Перезапустите сервер
```bash
npm run dev
```

### Шаг 4: Протестируйте
Зарегистрируйте нового пользователя для проверки

## 🚨 Важные моменты

### Для Gmail:
- Включите 2FA в настройках Google
- Создайте "Пароль приложения" для SkillBridge
- Используйте пароль приложения, а не обычный пароль

### Для Outlook:
- Включите 2FA в настройках Microsoft
- Создайте "Пароль приложения"

### Для Yahoo:
- Включите 2FA в настройках Yahoo
- Создайте "Пароль приложения"

## 🔍 Проверка работы

1. Откройте http://localhost:3000/auth/signup
2. Зарегистрируйте пользователя
3. Проверьте email (включая спам)
4. Проверьте консоль сервера на наличие ошибок

## 📊 Лимиты провайдеров

| Провайдер | Бесплатный лимит | Платный |
|-----------|------------------|---------|
| Gmail | 500 email/день | Да |
| Outlook | 300 email/день | Да |
| Yahoo | 500 email/день | Да |
| Resend | 100 email/день | Да |

## 🆘 Решение проблем

### Email не отправляется:
1. Проверьте правильность SMTP настроек
2. Убедитесь, что включена 2FA
3. Проверьте пароль приложения
4. Посмотрите логи в консоли сервера

### Email попадает в спам:
1. Добавьте SPF, DKIM записи в DNS
2. Используйте проверенный email адрес
3. Настройте правильный заголовок From

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте консоль сервера
2. Проверьте настройки провайдера
3. Убедитесь в правильности переменных окружения
