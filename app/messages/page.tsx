'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Send, MoreVertical, Phone, Video, Image, Paperclip, Smile, SendHorizontal } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
  }
  timestamp: Date
  isRead: boolean
  type: 'text' | 'image' | 'file'
}

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
    lastSeen?: Date
  }
  lastMessage: {
    content: string
    timestamp: Date
    isRead: boolean
  }
  unreadCount: number
  isActive: boolean
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = () => {
    // Симулируем загрузку разговоров
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participant: {
          id: 'user1',
          name: 'Արամ Սարգսյան',
          avatar: '/api/avatar?seed=aram',
          isOnline: true,
          lastSeen: new Date()
        },
        lastMessage: {
          content: 'Բարև! Ինչպե՞ս է գնում նախագիծը',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          isRead: false
        },
        unreadCount: 2,
        isActive: false
      },
      {
        id: '2',
        participant: {
          id: 'user2',
          name: 'Մարիա Հովհաննիսյան',
          avatar: '/api/avatar?seed=maria',
          isOnline: false,
          lastSeen: new Date(Date.now() - 1000 * 60 * 30)
        },
        lastMessage: {
          content: 'Շնորհակալություն աշխատանքի համար',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: true
        },
        unreadCount: 0,
        isActive: false
      },
      {
        id: '3',
        participant: {
          id: 'user3',
          name: 'Դավիթ Մարտիրոսյան',
          avatar: '/api/avatar?seed=david',
          isOnline: true,
          lastSeen: new Date()
        },
        lastMessage: {
          content: 'Կարո՞ղ եք օգնել այս հարցում',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          isRead: true
        },
        unreadCount: 0,
        isActive: false
      },
      {
        id: '4',
        participant: {
          id: 'user4',
          name: 'Անի Ավետիսյան',
          avatar: '/api/avatar?seed=ani',
          isOnline: false,
          lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3)
        },
        lastMessage: {
          content: 'Երբ կարող եք սկսել',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          isRead: true
        },
        unreadCount: 0,
        isActive: false
      }
    ]

    setConversations(mockConversations)
    setLoading(false)
  }

  const loadMessages = (conversationId: string) => {
    // Симулируем загрузку сообщений
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Բարև! Ինչպե՞ս է գնում նախագիծը',
        sender: {
          id: 'user1',
          name: 'Արամ Սարգսյան',
          avatar: '/api/avatar?seed=aram',
          isOnline: true
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isRead: true,
        type: 'text'
      },
      {
        id: '2',
        content: 'Բարև! Ամեն ինչ լավ է, շնորհակալություն հարցման համար',
        sender: {
          id: 'me',
          name: 'Դուք',
          avatar: '/api/avatar?seed=me',
          isOnline: true
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        isRead: true,
        type: 'text'
      },
      {
        id: '3',
        content: 'Երբ կարող եք ավարտել առաջին փուլը',
        sender: {
          id: 'user1',
          name: 'Արամ Սարգսյան',
          avatar: '/api/avatar?seed=aram',
          isOnline: true
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
        isRead: false,
        type: 'text'
      }
    ]

    setMessages(mockMessages)
    
    // Обновляем активный разговор
    setConversations(prev => prev.map(conv => ({
      ...conv,
      isActive: conv.id === conversationId
    })))
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: 'me',
        name: 'Դուք',
        avatar: '/api/avatar?seed=me',
        isOnline: true
      },
      timestamp: new Date(),
      isRead: false,
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Обновляем последнее сообщение в разговоре
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? {
            ...conv,
            lastMessage: {
              content: newMessage,
              timestamp: new Date(),
              isRead: false
            }
          }
        : conv
    ))
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Հիմա'
    if (minutes < 60) return `${minutes} ր`
    if (hours < 24) return `${hours} ժ`
    if (days < 7) return `${days} օր`
    return date.toLocaleDateString('hy-AM')
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Հաղորդագրություններ</h1>
        <p className="text-neutral-600">Կապվեք ձեր հաճախորդների և գործընկերների հետ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Список разговоров */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Զրույցներ</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input
                  placeholder="Որոնել զրույցներ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-neutral-50 transition-colors ${
                      conversation.isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conversation.participant.avatar} />
                          <AvatarFallback>
                            {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.participant.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-neutral-900 truncate">
                            {conversation.participant.name}
                          </h3>
                          <span className="text-xs text-neutral-500">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 truncate">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Область сообщений */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedConversation ? (
              <>
                {/* Заголовок разговора */}
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.participant.avatar} />
                        <AvatarFallback>
                          {selectedConversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          {selectedConversation.participant.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            selectedConversation.participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <span className="text-sm text-neutral-500">
                            {selectedConversation.participant.isOnline ? 'Առցանց' : 'Անցանց'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Сообщения */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender.id === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${message.sender.id === 'me' ? 'order-2' : 'order-1'}`}>
                            {message.sender.id !== 'me' && (
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={message.sender.avatar} />
                                  <AvatarFallback>
                                    {message.sender.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-neutral-500">{message.sender.name}</span>
                              </div>
                            )}
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                message.sender.id === 'me'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-neutral-100 text-neutral-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className={`text-xs text-neutral-500 mt-1 ${
                              message.sender.id === 'me' ? 'text-right' : 'text-left'
                            }`}>
                              {formatTime(message.timestamp)}
                              {message.sender.id === 'me' && (
                                <span className="ml-2">
                                  {message.isRead ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Поле ввода */}
                    <div className="p-4 border-t bg-neutral-50">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                          <Input
                            placeholder="Գրեք հաղորդագրություն..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="border-0 focus:ring-0"
                          />
                        </div>
                        <Button onClick={sendMessage} size="sm" disabled={!newMessage.trim()}>
                          <SendHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">Ընտրեք զրույց</h2>
                  <p className="text-neutral-600">Ընտրեք զրույցը ձախ կողմից հաղորդագրություններ ուղարկելու համար</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
