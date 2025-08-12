import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/messages - Получить разговоры пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (conversationId) {
      // Получаем сообщения конкретного разговора
      const messages = await prisma.message.findMany({
        where: {
          conversationId,
          OR: [
            { senderId: userId },
            { recipientId: userId }
          ]
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true
            }
          },
          recipient: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      })

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
        participant1: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            lastSeen: true
          }
        },
        participant2: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            lastSeen: true
          }
        },
        lastMessage: {
          select: {
            content: true,
            createdAt: true,
            isRead: true
          }
        },
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

    // Форматируем разговоры для фронтенда
    const formattedConversations = conversations.map(conv => {
      const isParticipant1 = conv.participant1Id === userId
      const otherParticipant = isParticipant1 ? conv.participant2 : conv.participant1
      const unreadCount = conv._count.messages

      return {
        id: conv.id,
        participant: {
          id: otherParticipant.id,
          name: otherParticipant.name,
          avatar: otherParticipant.avatar,
          isOnline: otherParticipant.lastSeen ? 
            (Date.now() - otherParticipant.lastSeen.getTime()) < 5 * 60 * 1000 : false,
          lastSeen: otherParticipant.lastSeen
        },
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content,
          timestamp: conv.lastMessage.createdAt,
          isRead: conv.lastMessage.isRead
        } : null,
        unreadCount,
        isActive: false
      }
    })

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
    const body = await request.json()
    const { type, data, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

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
    const body = await request.json()
    const { conversationId, userId } = body

    if (!userId || !conversationId) {
      return NextResponse.json({ error: 'User ID and conversation ID are required' }, { status: 400 })
    }

    // Отмечаем все непрочитанные сообщения как прочитанные
    await prisma.message.updateMany({
      where: {
        conversationId,
        recipientId: userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
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
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

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
