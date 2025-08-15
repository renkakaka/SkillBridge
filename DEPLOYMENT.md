# 🚀 Деплой SkillBridge на Netlify

## 📋 Подготовка к деплою

### 1. GitHub репозиторий готов ✅
- Все изменения закоммичены и отправлены на GitHub
- Репозиторий: https://github.com/renkakaka/SkillBridge.git

### 2. Файл netlify.toml создан ✅
- Конфигурация для Next.js приложения
- Настройки сборки и редиректов

## 🌐 Деплой на Netlify

### Шаг 1: Подключение к GitHub
1. Перейдите на [app.netlify.com](https://app.netlify.com)
2. Нажмите "New site from Git"
3. Выберите GitHub
4. Авторизуйтесь и выберите репозиторий `renkakaka/SkillBridge`

### Шаг 2: Настройка сборки
```
Build command: npm run build
Publish directory: .next
```

### Шаг 3: Переменные окружения
Добавьте следующие переменные в настройках сайта:

#### База данных (PostgreSQL)
```
DATABASE_URL=postgresql://username:password@host:port/database
```

#### Next.js
```
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app-name.netlify.app
```

#### Email (Resend)
```
RESEND_API_KEY=your-resend-api-key
```

#### Stripe (опционально)
```
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### Шаг 4: Деплой
1. Нажмите "Deploy site"
2. Дождитесь завершения сборки
3. Проверьте работу сайта

## ⚠️ Важные моменты

### База данных
- Для продакшена используйте PostgreSQL (например, Supabase, Neon, или Railway)
- Не используйте SQLite в продакшене
- Обновите `DATABASE_URL` в переменных окружения

### API роуты
- Все API роуты будут работать на Netlify
- Убедитесь, что база данных доступна из интернета

### Статические файлы
- Next.js автоматически оптимизирует статические файлы
- Изображения и другие ресурсы будут кешироваться

## 🔧 Возможные проблемы

### Ошибка сборки
- Проверьте логи сборки в Netlify
- Убедитесь, что все зависимости установлены
- Проверьте синтаксис TypeScript

### Ошибки базы данных
- Проверьте доступность базы данных
- Убедитесь, что `DATABASE_URL` правильный
- Проверьте права доступа к базе данных

### Проблемы с API
- Проверьте переменные окружения
- Убедитесь, что все API ключи правильные
- Проверьте логи в Netlify Functions

## 📞 Поддержка

Если возникнут проблемы:
1. Проверьте логи в Netlify
2. Убедитесь, что все переменные окружения настроены
3. Проверьте доступность базы данных
4. Обратитесь к документации Next.js и Netlify
