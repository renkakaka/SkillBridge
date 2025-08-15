import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

// GET /api/messages - Получить разговоры пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = session.userId
    const conversationId = searchParams.get('conversationId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (conversationId) {
      const msgs = await prisma.message.findMany({
        where: {
          conversationId,
          OR: [ { senderId: userId }, { recipientId: userId } ]
        },
        include: {
          sender: { select: { id: true, fullName: true, avatarUrl: true, email: true } },
          recipient: { select: { id: true, fullName: true, avatarUrl: true, email: true } }
        },
        orderBy: { createdAt: 'asc' }
      })

      const messages = msgs.map(m => ({
        id: m.id,
        conversationId: m.conversationId,
        content: m.content,
        type: m.type,
        isRead: m.isRead,
        createdAt: m.createdAt,
        sender: { id: m.sender.id, name: m.sender.fullName, avatar: m.sender.avatarUrl || '', email: m.sender.email },
        recipient: { id: m.recipient.id, name: m.recipient.fullName, avatar: m.recipient.avatarUrl || '', email: m.recipient.email }
      }))

      return NextResponse.json({ messages })
    }

    // Получаем все разговоры пользователя
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId }
        ]
      },
      include: {
        participant1: { select: { id: true, fullName: true, avatarUrl: true, email: true, lastSeen: true } },
        participant2: { select: { id: true, fullName: true, avatarUrl: true, email: true, lastSeen: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: {
          select: {
            messages: {
              where: {
                recipientId: userId,
                isRead: false
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    let formattedConversations = conversations.map(conv => {
      const isParticipant1 = conv.participant1Id === userId
      const p = isParticipant1 ? conv.participant2 : conv.participant1
      const unreadCount = conv._count.messages

      return {
        id: conv.id,
        participant: {
          id: p.id,
          name: p.fullName,
          avatar: p.avatarUrl || '',
          isOnline: p.lastSeen ? (Date.now() - p.lastSeen.getTime()) < 5 * 60 * 1000 : false,
          lastSeen: p.lastSeen
        },
        lastMessage: conv.messages[0] ? {
          content: conv.messages[0].content,
          timestamp: conv.messages[0].createdAt,
          isRead: conv.messages[0].isRead
        } : null,
        unreadCount,
        isActive: false
      }
    })

    // Если нет ни одного разговора, создаём приветственный от админа
    if (formattedConversations.length === 0) {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
        if (adminEmail) {
          const admin = await prisma.user.findUnique({ where: { email: adminEmail } })
          const user = await prisma.user.findUnique({ where: { id: userId } })
          if (admin && user) {
            // Проверяем, нет ли уже разговора
            const existing = await prisma.conversation.findFirst({
              where: {
                OR: [
                  { participant1Id: admin.id, participant2Id: userId },
                  { participant1Id: userId, participant2Id: admin.id }
                ]
              }
            })
            const conversationId = existing ? existing.id : (await prisma.conversation.create({
              data: { participant1Id: admin.id, participant2Id: userId }
            })).id

            await prisma.message.create({
              data: {
                conversationId,
                senderId: admin.id,
                recipientId: userId,
                content: 'Բարի գալուստ SkillBridge!\n\n1) Լրացրեք պրոֆիլը և հմտությունները\n2) Իջեք Marketplace և դիմեք նախագծերին\n3) Ծանուցումները և հաղորդագրությունները կհայտնվեն վերեւում\n\nԵթե հարցեր ունեք՝ գրել այստեղ։',
                type: 'text',
                isRead: false
              }
            })

            // Возвращаем созданный разговор
            formattedConversations = [
              {
                id: conversationId,
                participant: {
                  id: admin.id,
                  name: admin.fullName,
                  avatar: admin.avatarUrl || '',
                  isOnline: !!admin.lastSeen && (Date.now() - new Date(admin.lastSeen).getTime()) < 5 * 60 * 1000,
                  lastSeen: admin.lastSeen || null
                },
                lastMessage: { content: 'Բարի գալուստ SkillBridge!', timestamp: new Date(), isRead: false },
                unreadCount: 1,
                isActive: false
              }
            ]
          }
        }
      } catch (e) {
        console.warn('Failed to create welcome conversation:', e)
      }
    }

    return NextResponse.json({ conversations: formattedConversations })
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Создать новое сообщение или разговор
export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimit(request.headers, { id: 'messages:post', limit: 60, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const body = await request.json()
    const { type, data } = body
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = session.userId

    if (type === 'message') {
      const { conversationId, recipientId, content } = data

      let actualConversationId = conversationId

      // Если разговор не существует, создаем новый
      if (!conversationId) {
        const existingConversation = await prisma.conversation.findFirst({
          where: {
            OR: [
              {
                participant1Id: userId,
                participant2Id: recipientId
              },
              {
                participant1Id: recipientId,
                participant2Id: userId
              }
            ]
          }
        })

        if (existingConversation) {
          actualConversationId = existingConversation.id
        } else {
          const newConversation = await prisma.conversation.create({
            data: {
              participant1Id: userId,
              participant2Id: recipientId,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          actualConversationId = newConversation.id
        }
      }

      // Создаем сообщение
      const message = await prisma.message.create({
        data: {
          conversationId: actualConversationId,
          senderId: userId,
          recipientId: data.recipientId,
          content,
          type: 'text',
          isRead: false,
          createdAt: new Date()
        }
      })

      // Обновляем время последнего сообщения в разговоре
      await prisma.conversation.update({
        where: { id: actualConversationId },
        data: { updatedAt: new Date() }
      })

      return NextResponse.json({ 
        message, 
        conversationId: actualConversationId,
        message: 'Message sent successfully' 
      })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// PUT /api/messages - Отметить сообщения как прочитанные
export async function PUT(request: NextRequest) {
  try {
    const rl = await rateLimit(request.headers, { id: 'messages:put', limit: 60, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const body = await request.json()
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { conversationId } = body

    if (!session.userId || !conversationId) {
      return NextResponse.json({ error: 'User ID and conversation ID are required' }, { status: 400 })
    }

    // Отмечаем все непрочитанные сообщения как прочитанные
    await prisma.message.updateMany({
      where: {
        conversationId,
        recipientId: session.userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    // Дополнительно отметим как прочитанные уведомления типа 'message'
    await prisma.notification.updateMany({
      where: { userId: session.userId, type: 'message', isRead: false },
      data: { isRead: true, readAt: new Date() }
    })

    return NextResponse.json({ message: 'Messages marked as read' })
  } catch (error) {
    console.error('Message update error:', error)
    return NextResponse.json(
      { error: 'Failed to update messages' },
      { status: 500 }
    )
  }
}

// DELETE /api/messages - Удалить сообщение или разговор
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')
    const conversationId = searchParams.get('conversationId')
    const session = getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = session.userId

    if (messageId) {
      // Удаляем конкретное сообщение (только если пользователь является отправителем)
      await prisma.message.deleteMany({
        where: {
          id: messageId,
          senderId: userId
        }
      })
      return NextResponse.json({ message: 'Message deleted successfully' })
    }

    if (conversationId) {
      // Удаляем разговор (только если пользователь является участником)
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          OR: [
            { participant1Id: userId },
            { participant2Id: userId }
          ]
        }
      })

      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
      }

      // Удаляем все сообщения в разговоре
      await prisma.message.deleteMany({
        where: { conversationId }
      })

      // Удаляем сам разговор
      await prisma.conversation.delete({
        where: { id: conversationId }
      })

      return NextResponse.json({ message: 'Conversation deleted successfully' })
    }

    return NextResponse.json({ error: 'Message ID or conversation ID is required' }, { status: 400 })
  } catch (error) {
    console.error('Message deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
