# Netlify Deployment Guide for SkillBridge

## 1. Настройка базы данных PostgreSQL

### Вариант A: Supabase (Рекомендуется)
1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. В разделе Settings > Database найдите Connection string
4. Скопируйте DATABASE_URL

### Вариант B: Railway
1. Зайдите на [railway.app](https://railway.app)
2. Создайте PostgreSQL базу данных
3. Скопируйте DATABASE_URL

### Вариант C: Neon
1. Зайдите на [neon.tech](https://neon.tech)
2. Создайте PostgreSQL базу данных
3. Скопируйте DATABASE_URL

## 2. Настройка переменных окружения на Netlify

В Netlify Dashboard > Site settings > Environment variables добавьте:

```env
# База данных
DATABASE_URL=postgresql://username:password@host:port/database

# Аутентификация
AUTH_SECRET=your-super-secret-key-here-min-32-chars

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# Next.js
NEXTAUTH_URL=https://your-app-name.netlify.app
NEXTAUTH_SECRET=your-nextauth-secret

# Prisma
PRISMA_CLIENT_ENGINE_TYPE=binary
```

## 3. Обновление базы данных

После настройки DATABASE_URL:

1. В Netlify Dashboard > Functions > Deploy logs проверьте, что Prisma сгенерировал клиент
2. Если нужно, выполните миграцию базы данных

## 4. Проверка деплоя

1. Убедитесь, что все переменные окружения настроены
2. Проверьте логи сборки в Netlify
3. Протестируйте аутентификацию

## 5. Возможные проблемы

### Ошибка "prisma:// protocol"
- Убедитесь, что DATABASE_URL начинается с `postgresql://`
- Проверьте, что Prisma schema использует `provider = "postgresql"`

### Ошибка подключения к базе данных
- Проверьте правильность DATABASE_URL
- Убедитесь, что база данных доступна из интернета
- Проверьте настройки firewall

## 6. Локальная разработка

Для локальной разработки создайте `.env.local`:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET=dev-secret-key
RESEND_API_KEY=your-resend-api-key
```

## 7. Команды для обновления

```bash
# Обновить Prisma клиент
npx prisma generate

# Выполнить миграцию (если нужно)
npx prisma db push

# Проверить подключение
npx prisma db pull
```
