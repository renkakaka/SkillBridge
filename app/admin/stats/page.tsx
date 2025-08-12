'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Star, TrendingUp, Users, Award, Target } from 'lucide-react'

interface UserStats {
  id: string
  fullName: string
  email: string
  userType: string
  avatarUrl?: string
  rating: number
  totalProjects: number
  completedProjects: number
  totalEarnings: number
  skills: string[]
  level: number
  achievements: number
}

export default function AdminStatsPage() {
  const [users, setUsers] = useState<UserStats[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageRating: 0,
    totalProjects: 0,
    totalEarnings: 0
  })

  useEffect(() => {
    loadUserStats()
  }, [])

  const loadUserStats = () => {
    // Симулируем загрузку статистики пользователей
    const mockUsers: UserStats[] = [
      {
        id: '1',
        fullName: 'Վազգեն Կարամյան',
        email: 'vazgen@example.com',
        userType: 'mentor',
        rating: 4.9,
        totalProjects: 15,
        completedProjects: 14,
        totalEarnings: 2500,
        skills: ['React', 'Node.js', 'TypeScript'],
        level: 5,
        achievements: 8
      },
      {
        id: '2',
        fullName: 'Աննա Սարգսյան',
        email: 'anna@example.com',
        userType: 'newcomer',
        rating: 4.7,
        totalProjects: 8,
        completedProjects: 7,
        totalEarnings: 1200,
        skills: ['JavaScript', 'HTML', 'CSS'],
        level: 3,
        achievements: 5
      },
      {
        id: '3',
        fullName: 'Դավիթ Հովհաննիսյան',
        email: 'david@example.com',
        userType: 'client',
        rating: 4.8,
        totalProjects: 12,
        completedProjects: 12,
        totalEarnings: 0,
        skills: ['Project Management'],
        level: 4,
        achievements: 6
      },
      {
        id: '4',
        fullName: 'Մարիա Պետրոսյան',
        email: 'maria@example.com',
        userType: 'mentor',
        rating: 4.6,
        totalProjects: 20,
        completedProjects: 18,
        totalEarnings: 3200,
        skills: ['UI/UX Design', 'Figma', 'Adobe XD'],
        level: 6,
        achievements: 12
      },
      {
        id: '5',
        fullName: 'Արմեն Գրիգորյան',
        email: 'armen@example.com',
        userType: 'newcomer',
        rating: 4.5,
        totalProjects: 5,
        completedProjects: 4,
        totalEarnings: 800,
        skills: ['Python', 'Django'],
        level: 2,
        achievements: 3
      }
    ]

    setUsers(mockUsers)
    
    const totalUsers = mockUsers.length
    const averageRating = mockUsers.reduce((sum, user) => sum + user.rating, 0) / totalUsers
    const totalProjects = mockUsers.reduce((sum, user) => sum + user.totalProjects, 0)
    const totalEarnings = mockUsers.reduce((sum, user) => sum + user.totalEarnings, 0)

    setStats({
      totalUsers,
      averageRating: Math.round(averageRating * 10) / 10,
      totalProjects,
      totalEarnings
    })
  }

  const getUserTypeColor = (userType: string) => {
    const colors: { [key: string]: string } = {
      mentor: 'bg-blue-100 text-blue-800',
      newcomer: 'bg-green-100 text-green-800',
      client: 'bg-purple-100 text-purple-800'
    }
    return colors[userType] || 'bg-gray-100 text-gray-800'
  }

  const getUserTypeLabel = (userType: string) => {
    const labels: { [key: string]: string } = {
      mentor: 'Մենթոր',
      newcomer: 'Նորեկ',
      client: 'Հաճախորդ'
    }
    return labels[userType] || userType
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Օգտատերերի վիճակագրություն</h1>
        <p className="text-neutral-600">Հետևեք օգտատերերի ակտիվությանը և կատարողականությանը</p>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Ընդհանուր օգտատերեր</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Միջին վարկանիշ</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.averageRating}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Ընդհանուր նախագծեր</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalProjects}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Ընդհանուր վաստակ</p>
                <p className="text-2xl font-bold text-neutral-900">${stats.totalEarnings}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Рейтинг пользователей */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Օգտատերերի վարկանիշ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users
              .sort((a, b) => b.rating - a.rating)
              .map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                        <span className="text-sm font-bold text-yellow-600">
                          {index + 1}
                        </span>
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {user.fullName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-900">{user.fullName}</h3>
                        <Badge className={getUserTypeColor(user.userType)}>
                          {getUserTypeLabel(user.userType)}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600">{user.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                        <span>Նախագծեր: {user.completedProjects}/{user.totalProjects}</span>
                        <span>Մակարդակ: {user.level}</span>
                        <span>Հաջողություններ: {user.achievements}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-neutral-900">{user.rating}</span>
                    </div>
                    {user.totalEarnings > 0 && (
                      <p className="text-sm text-green-600 font-medium">
                        ${user.totalEarnings}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
