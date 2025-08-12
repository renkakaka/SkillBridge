'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Bell, 
  Check, 
  X, 
  Filter, 
  Settings, 
  Mail, 
  DollarSign, 
  Award, 
  AlertTriangle, 
  Info,
  Star,
  MessageSquare,
  Calendar,
  TrendingUp
} from 'lucide-react'

interface Notification {
  id: string
  type: 'project' | 'payment' | 'achievement' | 'message' | 'reminder' | 'system'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  isImportant: boolean
  sender?: {
    name: string
    avatar: string
  }
  actionUrl?: string
  metadata?: {
    amount?: number
    projectName?: string
    achievementName?: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'important' | 'project' | 'payment' | 'achievement'>('all')
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    // Симулируем загрузку уведомлений
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'project',
        title: 'Նոր նախագիծ ստացվել է',
        message: 'Ձեզ առաջարկվել է նոր նախագիծ "Էլեկտրոնային առևտրի կայք"',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isRead: false,
        isImportant: true,
        sender: {
          name: 'TechCorp',
          avatar: '/api/avatar?seed=techcorp'
        },
        actionUrl: '/projects/1',
        metadata: {
          projectName: 'Էլեկտրոնային առևտրի կայք'
        }
      },
      {
        id: '2',
        type: 'payment',
        title: 'Վճարում ստացվել է',
        message: 'Ձեր հաշվին մուտքագրվել է $2,500 նախագծի համար',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        isRead: false,
        isImportant: false,
        metadata: {
          amount: 2500,
          projectName: 'Մոբայլ հավելված iOS-ի համար'
        }
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Նոր հաջողություն բացահայտվել է',
        message: 'Դուք բացահայտել եք "Առաջին նախագիծ" հաջողությունը',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: true,
        isImportant: false,
        metadata: {
          achievementName: 'Առաջին նախագիծ'
        }
      },
      {
        id: '4',
        type: 'message',
        title: 'Նոր հաղորդագրություն',
        message: 'Արամ Սարգսյանը ուղարկել է հաղորդագրություն',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: false,
        isImportant: false,
        sender: {
          name: 'Արամ Սարգսյան',
          avatar: '/api/avatar?seed=aram'
        },
        actionUrl: '/messages'
      },
      {
        id: '5',
        type: 'reminder',
        title: 'Հիշեցում նախագծի մասին',
        message: 'Նախագիծ "Լոգո և բրենդինգ" պետք է ավարտվի վաղը',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: true,
        isImportant: true,
        metadata: {
          projectName: 'Լոգո և բրենդինգ'
        }
      },
      {
        id: '6',
        type: 'system',
        title: 'Համակարգի թարմացում',
        message: 'Համակարգը թարմացվել է նոր տարբերակի',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: true,
        isImportant: false
      },
      {
        id: '7',
        type: 'payment',
        title: 'Վճարում ստացվել է',
        message: 'Ձեր հաշվին մուտքագրվել է $800 նախագծի համար',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        isRead: true,
        isImportant: false,
        metadata: {
          amount: 800,
          projectName: 'Լոգո և բրենդինգ'
        }
      },
      {
        id: '8',
        type: 'achievement',
        title: 'Նոր մակարդակ հասել եք',
        message: 'Դուք հասել եք "Փորձառու" մակարդակին',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        isRead: true,
        isImportant: false,
        metadata: {
          achievementName: 'Փորձառու'
        }
      }
    ]

    setNotifications(mockNotifications)
    setLoading(false)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <TrendingUp className="h-5 w-5 text-blue-600" />
      case 'payment':
        return <DollarSign className="h-5 w-5 text-green-600" />
      case 'achievement':
        return <Award className="h-5 w-5 text-yellow-600" />
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-600" />
      case 'reminder':
        return <Calendar className="h-5 w-5 text-orange-600" />
      case 'system':
        return <Info className="h-5 w-5 text-gray-600" />
      default:
        return <Bell className="h-5 w-5 text-neutral-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-blue-50 border-blue-200'
      case 'payment':
        return 'bg-green-50 border-green-200'
      case 'achievement':
        return 'bg-yellow-50 border-yellow-200'
      case 'message':
        return 'bg-purple-50 border-purple-200'
      case 'reminder':
        return 'bg-orange-50 border-orange-200'
      case 'system':
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-neutral-50 border-neutral-200'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Հիմա'
    if (minutes < 60) return `${minutes} ր առաջ`
    if (hours < 24) return `${hours} ժ առաջ`
    if (days < 7) return `${days} օր առաջ`
    return date.toLocaleDateString('hy-AM')
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notif.isRead
    if (filter === 'important') return notif.isImportant
    return notif.type === filter
  })

  const unreadCount = notifications.filter(n => !n.isRead).length
  const importantCount = notifications.filter(n => n.isImportant).length

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Ծանուցումներ</h1>
            <p className="text-neutral-600">Հետևեք ձեր նախագծերի և գործունեության մասին տեղեկություններին</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4 mr-2" />
              Կարգավորումներ
            </Button>
            <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="h-4 w-4 mr-2" />
              Բոլորը կարդացված
            </Button>
          </div>
        </div>

        {/* Статистика уведомлений */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Ընդհանուր</p>
                  <p className="text-2xl font-bold text-neutral-900">{notifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Չկարդացված</p>
                  <p className="text-2xl font-bold text-neutral-900">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Կարևոր</p>
                  <p className="text-2xl font-bold text-neutral-900">{importantCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Կարդացված</p>
                  <p className="text-2xl font-bold text-neutral-900">{notifications.length - unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Фильтры */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'all', label: 'Բոլորը', count: notifications.length },
            { key: 'unread', label: 'Չկարդացված', count: unreadCount },
            { key: 'important', label: 'Կարևոր', count: importantCount },
            { key: 'project', label: 'Նախագծեր', count: notifications.filter(n => n.type === 'project').length },
            { key: 'payment', label: 'Վճարումներ', count: notifications.filter(n => n.type === 'payment').length },
            { key: 'achievement', label: 'Հաջողություններ', count: notifications.filter(n => n.type === 'achievement').length }
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.key as any)}
            >
              {filterOption.label}
              <Badge variant="secondary" className="ml-2">
                {filterOption.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Настройки */}
      {showSettings && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Ծանուցումների կարգավորումներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Ծանուցումների տեսակներ</h4>
                {['project', 'payment', 'achievement', 'message', 'reminder', 'system'].map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <input type="checkbox" id={type} defaultChecked className="rounded" />
                    <label htmlFor={type} className="text-sm">
                      {type === 'project' && 'Նախագծեր'}
                      {type === 'payment' && 'Վճարումներ'}
                      {type === 'achievement' && 'Հաջողություններ'}
                      {type === 'message' && 'Հաղորդագրություններ'}
                      {type === 'reminder' && 'Հիշեցումներ'}
                      {type === 'system' && 'Համակարգ'}
                    </label>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Ծանուցումների եղանակներ</h4>
                {['email', 'push', 'sms'].map((method) => (
                  <div key={method} className="flex items-center gap-2">
                    <input type="checkbox" id={method} defaultChecked={method !== 'sms'} className="rounded" />
                    <label htmlFor={method} className="text-sm">
                      {method === 'email' && 'Email'}
                      {method === 'push' && 'Push ծանուցումներ'}
                      {method === 'sms' && 'SMS'}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список уведомлений */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all duration-200 hover:shadow-md ${
              notification.isRead ? 'opacity-75' : 'border-l-4 border-l-blue-500'
            } ${getNotificationColor(notification.type)}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${notification.isRead ? 'text-neutral-600' : 'text-neutral-900'}`}>
                        {notification.title}
                      </h3>
                      {notification.isImportant && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">
                        {formatTime(notification.timestamp)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-3 ${notification.isRead ? 'text-neutral-500' : 'text-neutral-700'}`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    {notification.sender && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={notification.sender.avatar} />
                          <AvatarFallback>
                            {notification.sender.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-neutral-600">{notification.sender.name}</span>
                      </div>
                    )}
                    
                    {notification.metadata?.amount && (
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        ${notification.metadata.amount.toLocaleString()}
                      </Badge>
                    )}
                    
                    {notification.metadata?.projectName && (
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        {notification.metadata.projectName}
                      </Badge>
                    )}
                    
                    {notification.metadata?.achievementName && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                        {notification.metadata.achievementName}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredNotifications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">Ծանուցումներ չեն գտնվել</p>
              <p className="text-sm text-neutral-500 mt-1">
                {filter === 'all' 
                  ? 'Դուք դեռ չունեք ծանուցումներ'
                  : `Չկան ծանուցումներ "${filter}" ֆիլտրի համար`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
