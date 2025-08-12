'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Star, 
  Clock, 
  Target,
  Calendar,
  Award,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalProjects: number
  completedProjects: number
  activeMentorships: number
  totalEarnings: number
  skillLevel: number
  nextMilestone: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>('')
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    completedProjects: 0,
    activeMentorships: 0,
    totalEarnings: 0,
    skillLevel: 1,
    nextMilestone: 'Complete your first project'
  })

  useEffect(() => {
    // Простая проверка аутентификации через localStorage
    const userEmail = localStorage.getItem('userEmail')
    const userFullName = localStorage.getItem('userFullName')
    const userType = localStorage.getItem('userType')
    
    if (userEmail && userFullName && userType) {
      setUserName(userFullName)
      setUser({ email: userEmail, fullName: userFullName, userType, skills: '[]' })
      
      // Загружаем реальную статистику пользователя
      loadUserStats(userEmail, userType)
      // Загружаем недавние активности
      loadRecentActivities(userEmail, userType)
    } else {
      // Если пользователь не аутентифицирован, перенаправляем на страницу входа
      router.push('/auth/signin')
    }
  }, [router])

  const loadUserStats = async (userEmail: string, userType: string) => {
    try {
      // Загружаем статистику в зависимости от типа пользователя
      if (userType === 'newcomer') {
        // Для новичков загружаем заявки и сессии
        const [applicationsResponse, sessionsResponse] = await Promise.all([
          fetch(`/api/applications?userId=${userEmail}`),
          fetch(`/api/sessions?userId=${userEmail}`)
        ])
        
        if (applicationsResponse.ok && sessionsResponse.ok) {
          const applications = await applicationsResponse.json()
          const sessions = await sessionsResponse.json()
          
          setStats({
            totalProjects: applications.length,
            completedProjects: applications.filter((app: any) => app.status === 'accepted').length,
            activeMentorships: sessions.filter((session: any) => session.status === 'scheduled').length,
            totalEarnings: 0, // Новички не зарабатывают
            skillLevel: Math.min(Math.floor(applications.length / 2) + 1, 5),
            nextMilestone: getNextMilestone(applications.length)
          })
        }
      } else if (userType === 'mentor') {
        // Для менторов загружаем сессии и отзывы
        const [sessionsResponse, reviewsResponse] = await Promise.all([
          fetch(`/api/sessions?mentorId=${userEmail}`),
          fetch(`/api/reviews?reviewedId=${userEmail}`)
        ])
        
        if (sessionsResponse.ok && reviewsResponse.ok) {
          const sessions = await sessionsResponse.json()
          const reviews = await reviewsResponse.json()
          
          const totalEarnings = sessions
            .filter((session: any) => session.status === 'completed')
            .reduce((sum: number) => sum + 50, 0) // Примерная ставка за сессию
          
          setStats({
            totalProjects: sessions.length,
            completedProjects: sessions.filter((session: any) => session.status === 'completed').length,
            activeMentorships: sessions.filter((session: any) => session.status === 'scheduled').length,
            totalEarnings,
            skillLevel: Math.min(Math.floor(reviews.length / 3) + 3, 5),
            nextMilestone: getNextMilestone(sessions.length)
          })
        }
      } else if (userType === 'client') {
        // Для клиентов загружаем проекты
        const projectsResponse = await fetch(`/api/projects?clientId=${userEmail}`)
        
        if (projectsResponse.ok) {
          const projects = await projectsResponse.json()
          
          setStats({
            totalProjects: projects.length,
            completedProjects: projects.filter((project: any) => project.status === 'completed').length,
            activeMentorships: 0, // Клиенты не участвуют в менторстве
            totalEarnings: 0, // Клиенты не зарабатывают
            skillLevel: 1, // Клиенты всегда на уровне 1
            nextMilestone: 'Հրապարակեք առաջին ծրագիրը'
          })
        }
      }
    } catch (error) {
      console.error('Error loading user stats:', error)
      // Устанавливаем базовую статистику при ошибке
      setStats({
        totalProjects: 0,
        completedProjects: 0,
        activeMentorships: 0,
        totalEarnings: 0,
        skillLevel: 1,
        nextMilestone: 'Սկսեք ձեր ճանապարհորդությունը'
      })
    }
  }

  const getNextMilestone = (count: number): string => {
    if (count === 0) return 'Սկսեք ձեր առաջին ծրագիրը'
    if (count < 3) return 'Ավարտեք 3 ծրագիր'
    if (count < 5) return 'Ավարտեք 5 ծրագիր'
    if (count < 10) return 'Ավարտեք 10 ծրագիր'
    return 'Դուք փորձառու մասնագետ եք!'
  }

  const handleSignOut = async () => {
    // Очищаем localStorage
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userFullName')
    localStorage.removeItem('userType')
    router.push('/')
  }

  const [recentActivities, setRecentActivities] = useState<any[]>([])

  // Определяем, является ли пользователь админом
  const isAdmin = user?.email === 'qaramyanv210@gmail.com'

  const loadRecentActivities = async (userEmail: string, userType: string) => {
    try {
      let activities: any[] = []
      
      if (userType === 'newcomer') {
        // Загружаем заявки и сессии для новичков
        const [applicationsResponse, sessionsResponse] = await Promise.all([
          fetch(`/api/applications?userId=${userEmail}`),
          fetch(`/api/sessions?userId=${userEmail}`)
        ])
        
        if (applicationsResponse.ok && sessionsResponse.ok) {
          const applications = await applicationsResponse.json()
          const sessions = await sessionsResponse.json()
          
          activities = [
            ...applications.map((app: any) => ({
              id: app.id,
              type: 'project',
              title: app.project?.title || 'Ծրագիր',
              description: `Դիմում ${app.status === 'accepted' ? 'ընդունվել է' : 'դիտարկվում է'}`,
              time: new Date(app.createdAt).toLocaleDateString('hy-AM'),
              status: app.status === 'accepted' ? 'completed' : 'in-progress'
            })),
            ...sessions.map((session: any) => ({
              id: session.id,
              type: 'mentorship',
              title: `Սեսիա ${session.mentor?.fullName || 'մենթորի հետ'}`,
              description: session.notes || 'Մենթորինգ սեսիա',
              time: new Date(session.startTime).toLocaleDateString('hy-AM'),
              status: session.status === 'completed' ? 'completed' : 'in-progress'
            }))
          ]
        }
      } else if (userType === 'mentor') {
        // Загружаем сессии для менторов
        const sessionsResponse = await fetch(`/api/sessions?mentorId=${userEmail}`)
        
        if (sessionsResponse.ok) {
          const sessions = await sessionsResponse.json()
          
          activities = sessions.map((session: any) => ({
            id: session.id,
            type: 'mentorship',
            title: `Սեսիա ${session.user?.fullName || 'օգտագործողի հետ'}`,
            description: session.notes || 'Մենթորինգ սեսիա',
            time: new Date(session.startTime).toLocaleDateString('hy-AM'),
            status: session.status === 'completed' ? 'completed' : 'in-progress'
          }))
        }
      } else if (userType === 'client') {
        // Загружаем проекты для клиентов
        const projectsResponse = await fetch(`/api/projects?clientId=${userEmail}`)
        
        if (projectsResponse.ok) {
          const projects = await projectsResponse.json()
          
          activities = projects.map((project: any) => ({
            id: project.id,
            type: 'project',
            title: project.title,
            description: `Ծրագիր ${project.status === 'completed' ? 'ավարտվել է' : 'կատարվում է'}`,
            time: new Date(project.createdAt).toLocaleDateString('hy-AM'),
            status: project.status === 'completed' ? 'completed' : 'in-progress'
          }))
        }
      }
      
      // Сортируем по дате и берем последние 5
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setRecentActivities(activities.slice(0, 5))
    } catch (error) {
      console.error('Error loading recent activities:', error)
      setRecentActivities([])
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {isAdmin ? 'Ադմին վահանակ' : `Բարի վերադարձ, ${userName}! 👋`}
            </h1>
            <p className="text-neutral-600">
              {isAdmin ? 'Կառավարեք օգտատերերին, նախագծերը և համակարգը' : 'Ահա թե ինչ է կատարվում ձեր նախագծերի և ուսումնական ճանապարհի հետ'}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Կարգավորումներ
              </Button>
            </Link>
            {/* <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button> */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Ընդհանուր նախագծեր</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalProjects}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Ավարտված</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.completedProjects}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Ակտիվ մենթորինգ</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.activeMentorships}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Ընդհանուր վաստակ</p>
                  <p className="text-2xl font-bold text-neutral-900">${stats.totalEarnings}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Վերջին ակտիվությունները
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        {activity.type === 'project' ? (
                          <Briefcase className="h-5 w-5 text-primary-600" />
                        ) : (
                          <Users className="h-5 w-5 text-primary-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900">{activity.title}</h4>
                        <p className="text-sm text-neutral-600">{activity.description}</p>
                        <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                      </div>
                      <Badge 
                        variant={activity.status === 'completed' ? 'success' : 'secondary'}
                        size="sm"
                      >
                        {activity.status === 'completed' ? 'Ավարտված' : 'Ընթացքում'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ձեր առաջընթացը
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    Մակարդակ {stats.skillLevel}
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stats.skillLevel / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-neutral-600 mt-2">
                    {stats.nextMilestone}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Առաջիկա սեսիաներ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600 mb-4">Չկան նախատեսված սեսիաներ</p>
                  <Link href="/mentors">
                    <Button size="sm" className="bg-gradient-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Ամրագրել
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Ձեր հմտությունները
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user?.skills ? (
                    JSON.parse(user.skills).map((skill: string, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-neutral-700">{skill}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${
                                i < Math.min(index + 2, 5) ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <BookOpen className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm text-neutral-500">Դեռ հմտություններ չկան</p>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Ավելացնել հմտություն
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
