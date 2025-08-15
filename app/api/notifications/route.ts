import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

// GET /api/notifications - Получить уведомления пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = session.userId
    const filter = searchParams.get('filter') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const countOnly = searchParams.get('countOnly') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Формируем условия фильтрации
    let whereClause: any = { userId }

    switch (filter) {
      case 'unread':
        whereClause.isRead = false
        break
      case 'important':
        whereClause.isImportant = true
        break
      case 'project':
        whereClause.type = 'project'
        break
      case 'payment':
        whereClause.type = 'payment'
        break
      case 'achievement':
        whereClause.type = 'achievement'
        break
      case 'message':
        whereClause.type = 'message'
        break
      case 'reminder':
        whereClause.type = 'reminder'
        break
      case 'system':
        whereClause.type = 'system'
        break
      // 'all' - без дополнительных фильтров
    }

    // Получаем общую статистику (используется и для countOnly)
    const totalCountPromise = prisma.notification.count({ where: { userId } })
    const unreadCountPromise = prisma.notification.count({ where: { userId, isRead: false } })
    const importantCountPromise = prisma.notification.count({ where: { userId, isImportant: true } })

    if (countOnly) {
      const [totalCount, unreadCount, importantCount] = await Promise.all([
        totalCountPromise,
        unreadCountPromise,
        importantCountPromise,
      ])
      return NextResponse.json({
        notifications: [],
        stats: { total: totalCount, unread: unreadCount, important: importantCount },
        pagination: { limit: 0, offset: 0, total: totalCount, hasMore: false }
      })
    }

    // Получаем уведомления
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const [totalCount, unreadCount, importantCount] = await Promise.all([
      totalCountPromise,
      unreadCountPromise,
      importantCountPromise,
    ])

    return NextResponse.json({
      notifications,
      stats: { total: totalCount, unread: unreadCount, important: importantCount },
      pagination: {
        limit,
        offset,
        total: totalCount,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Создать новое уведомление
export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimit(request.headers, { id: 'notifications:post', limit: 60, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const body = await request.json()
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { userId = session.userId, type, title, message, isImportant = false, metadata = {}, senderId = session.userId } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ 
        error: 'User ID, type, title and message are required' 
      }, { status: 400 })
    }

    // Проверяем настройки уведомлений пользователя
    const userSettings = await prisma.userNotificationSettings.findUnique({
      where: { userId }
    })

    // Если настройки не найдены, создаем по умолчанию
    if (!userSettings) {
      await prisma.userNotificationSettings.create({
        data: {
          userId,
          email: true,
          push: true,
          sms: false,
          project: true,
          payment: true,
          achievement: true,
          message: true,
          reminder: true,
          system: true
        }
      })
    }

    // Создаем уведомление
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        isImportant,
        metadata,
        senderId,
        isRead: false,
        createdAt: new Date()
      }
    })

    // Здесь можно добавить логику отправки push-уведомлений
    // и email уведомлений в зависимости от настроек пользователя

    return NextResponse.json({ 
      notification, 
      message: 'Notification created successfully' 
    })
  } catch (error) {
    console.error('Notification creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// PUT /api/notifications - Обновить уведомления
export async function PUT(request: NextRequest) {
  try {
    const rl = await rateLimit(request.headers, { id: 'notifications:put', limit: 60, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const body = await request.json()
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { action, notificationIds, conversationId, settings } = body
    const userId = session.userId

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    switch (action) {
      case 'markAsRead':
        if (notificationIds && Array.isArray(notificationIds)) {
          // Отмечаем конкретные уведомления как прочитанные
          await prisma.notification.updateMany({
            where: {
              id: { in: notificationIds },
              userId
            },
            data: {
              isRead: true,
              readAt: new Date()
            }
          })
        } else {
          // Отмечаем все уведомления как прочитанные
          await prisma.notification.updateMany({
            where: {
              userId,
              isRead: false
            },
            data: {
              isRead: true,
              readAt: new Date()
            }
          })
        }
        return NextResponse.json({ message: 'Notifications marked as read' })

      case 'markAsImportant':
        if (!notificationIds || !Array.isArray(notificationIds)) {
          return NextResponse.json({ error: 'Notification IDs are required' }, { status: 400 })
        }
        
        await prisma.notification.updateMany({
          where: {
            id: { in: notificationIds },
            userId
          },
          data: {
            isImportant: true
          }
        })
        return NextResponse.json({ message: 'Notifications marked as important' })

      case 'markAsUnimportant':
        if (!notificationIds || !Array.isArray(notificationIds)) {
          return NextResponse.json({ error: 'Notification IDs are required' }, { status: 400 })
        }
        
        await prisma.notification.updateMany({
          where: {
            id: { in: notificationIds },
            userId
          },
          data: {
            isImportant: false
          }
        })
        return NextResponse.json({ message: 'Notifications marked as unimportant' })

      case 'updateSettings':
        if (!settings || typeof settings !== 'object') {
          return NextResponse.json({ error: 'Settings object is required' }, { status: 400 })
        }
        await prisma.userNotificationSettings.upsert({
          where: { userId },
          update: { ...settings, updatedAt: new Date() },
          create: { userId, ...settings, createdAt: new Date(), updatedAt: new Date() }
        })
        return NextResponse.json({ message: 'Notification settings updated' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications - Удалить уведомления
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = session.userId
    const notificationIds = searchParams.get('notificationIds')
    const deleteAll = searchParams.get('deleteAll') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (deleteAll) {
      // Удаляем все уведомления пользователя
      await prisma.notification.deleteMany({
        where: { userId }
      })
      return NextResponse.json({ message: 'All notifications deleted' })
    }

    if (notificationIds) {
      // Удаляем конкретные уведомления
      const ids = notificationIds.split(',').filter(id => id.trim())
      await prisma.notification.deleteMany({
        where: {
          id: { in: ids },
          userId
        }
      })
      return NextResponse.json({ message: 'Selected notifications deleted' })
    }

    return NextResponse.json({ error: 'No notifications specified for deletion' }, { status: 400 })
  } catch (error) {
    console.error('Notification deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    )
  }
}
