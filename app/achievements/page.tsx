'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, Award, Target, TrendingUp, Users, Briefcase, Clock, Zap, CheckCircle } from 'lucide-react'
import { useTranslations } from '@/lib/useTranslations'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: string
  points: number
  unlocked: boolean
  unlockedAt?: string
  progress: number
  maxProgress: number
}

interface Level {
  level: number
  title: string
  description: string
  minPoints: number
  maxPoints: number
  currentPoints: number
  rewards: string[]
  unlocked: boolean
}

export default function AchievementsPage() {
  const { t } = useTranslations()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [stats, setStats] = useState({
    totalPoints: 0,
    totalAchievements: 0,
    unlockedAchievements: 0,
    currentLevel: 1,
    nextLevelProgress: 0
  })

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`/api/achievements`)
        if (!r.ok) return
        const data = await r.json()
        // Map to UI state
        const ua = Array.isArray(data.achievements) ? data.achievements : []
        const all = Array.isArray(data.allAchievements) ? data.allAchievements : []
        setAchievements(all.map((a: any) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          icon: '🏆',
          category: a.category || 'Հմտություններ',
          points: a.points,
          unlocked: ua.some((x: any) => x.achievementId === a.id && x.unlockedAt),
          unlockedAt: (() => { const x = ua.find((x: any) => x.achievementId === a.id); return x?.unlockedAt || undefined })(),
          progress: (() => { const x = ua.find((x: any) => x.achievementId === a.id); return x?.progress || 0 })(),
          maxProgress: 100
        })))
        setStats({
          totalPoints: data.stats?.totalPoints || 0,
          totalAchievements: data.stats?.totalCount || all.length,
          unlockedAchievements: data.stats?.unlockedCount || ua.filter((x: any) => x.unlockedAt).length,
          currentLevel: data.stats?.currentLevel || 1,
          nextLevelProgress: Math.round((data.stats?.levelProgress || 0))
        })
        loadLevels()
      } catch {}
    }
    load()
  }, [])

  const loadAchievements = () => {
    // Симулируем загрузку достижений
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'Առաջին քայլ',
        description: 'Ավարտեք ձեր առաջին նախագիծը',
        icon: '🎯',
        category: 'Նախագծեր',
        points: 50,
        unlocked: true,
        unlockedAt: '2025-01-15',
        progress: 1,
        maxProgress: 1
      },
      {
        id: '2',
        title: 'Փորձառու մասնագետ',
        description: 'Ավարտեք 10 նախագիծ',
        icon: '🏆',
        category: 'Նախագծեր',
        points: 200,
        unlocked: false,
        progress: 3,
        maxProgress: 10
      },
      {
        id: '3',
        title: 'Բարձր վարկանիշ',
        description: 'Հասեք 4.5+ վարկանիշի',
        icon: '⭐',
        category: 'Վարկանիշ',
        points: 150,
        unlocked: true,
        unlockedAt: '2025-01-20',
        progress: 5,
        maxProgress: 5
      },
      {
        id: '4',
        title: 'Արագ աշխատանք',
        description: 'Ավարտեք նախագիծ 24 ժամվա ընթացքում',
        icon: '⚡',
        category: 'Արագություն',
        points: 100,
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: '5',
        title: 'Հաճախորդների սիրելին',
        description: 'Ստացեք 20 դրական ակնարկ',
        icon: '❤️',
        category: 'Հաճախորդներ',
        points: 300,
        unlocked: false,
        progress: 7,
        maxProgress: 20
      },
      {
        id: '6',
        title: 'Տեխնիկական գուրու',
        description: 'Տիրապետեք 5 տարբեր հմտությունների',
        icon: '🛠️',
        category: 'Հմտություններ',
        points: 250,
        unlocked: false,
        progress: 3,
        maxProgress: 5
      }
    ]
    
    setAchievements(mockAchievements)
    setStats({
      totalPoints: mockAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0),
      totalAchievements: mockAchievements.length,
      unlockedAchievements: mockAchievements.filter(a => a.unlocked).length,
      currentLevel: Math.floor(mockAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0) / 100) + 1,
      nextLevelProgress: mockAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0) % 100
    })
  }

  const loadLevels = () => {
    const mockLevels: Level[] = [
      {
        level: 1,
        title: 'Նորեկ',
        description: 'Սկսեք ձեր ճանապարհորդությունը',
        minPoints: 0,
        maxPoints: 99,
        currentPoints: stats.totalPoints,
        rewards: ['Հիմնական գործիքներ', 'Նախագծերի հասանելիություն'],
        unlocked: true
      },
      {
        level: 2,
        title: 'Փորձառու',
        description: 'Դուք արդեն ինչ-որ բան գիտեք',
        minPoints: 100,
        maxPoints: 299,
        currentPoints: stats.totalPoints,
        rewards: ['Բարձր վարկանիշի նախագծեր', 'Առաջնահերթ ցուցադրում'],
        unlocked: stats.totalPoints >= 100
      },
      {
        level: 3,
        title: 'Մասնագետ',
        description: 'Դուք փորձառու եք',
        minPoints: 300,
        maxPoints: 599,
        currentPoints: stats.totalPoints,
        rewards: ['VIP հաճախորդներ', 'Բարձր վարձատրություն'],
        unlocked: stats.totalPoints >= 300
      },
      {
        level: 4,
        title: 'Վարպետ',
        description: 'Դուք վարպետ եք',
        minPoints: 600,
        maxPoints: 999,
        currentPoints: stats.totalPoints,
        rewards: ['Մենթորինգ հնարավորություն', 'Մասնագիտական ճանաչում'],
        unlocked: stats.totalPoints >= 600
      },
      {
        level: 5,
        title: 'Լեգենդ',
        description: 'Դուք լեգենդ եք',
        minPoints: 1000,
        maxPoints: 9999,
        currentPoints: stats.totalPoints,
        rewards: ['Բացառիկ նախագծեր', 'Մշտական հաճախորդներ'],
        unlocked: stats.totalPoints >= 1000
      }
    ]
    
    setLevels(mockLevels)
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'Նախագծեր': Briefcase,
      'Վարկանիշ': Star,
      'Արագություն': Zap,
      'Հաճախորդներ': Users,
      'Հմտություններ': Target
    }
    return icons[category] || Award
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Նախագծեր': 'bg-blue-100 text-blue-800',
      'Վարկանիշ': 'bg-yellow-100 text-yellow-800',
      'Արագություն': 'bg-green-100 text-green-800',
      'Հաճախորդներ': 'bg-pink-100 text-pink-800',
      'Հմտություններ': 'bg-purple-100 text-purple-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">{t('achievements.title')}</h1>
        <p className="text-neutral-600">{t('achievements.subtitle')}</p>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{t('achievements.totalPoints')}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalPoints}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{t('achievements.currentLevel')}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.currentLevel}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{t('achievements.unlockedAchievements')}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.unlockedAchievements}/{stats.totalAchievements}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{t('achievements.nextLevel')}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.nextLevelProgress}%</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Прогресс до следующего уровня */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('achievements.levels')} {stats.currentLevel} → {stats.currentLevel + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{stats.totalPoints} {t('achievements.score')}</span>
              <span>{Math.ceil(stats.totalPoints / 100) * 100} {t('achievements.score')}</span>
            </div>
            <Progress value={stats.nextLevelProgress} className="h-3" />
            <p className="text-sm text-neutral-600">
              {Math.ceil(stats.totalPoints / 100) * 100 - stats.totalPoints} {t('achievements.score')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Достижения */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">{t('achievements.achievements')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const CategoryIcon = getCategoryIcon(achievement.category)
            return (
              <Card key={achievement.id} className={`transition-all duration-200 ${
                achievement.unlocked ? 'ring-2 ring-green-200 bg-green-50' : 'hover:shadow-lg'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <Badge className={`text-xs ${getCategoryColor(achievement.category)}`}>
                          {achievement.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{achievement.points}</div>
                      <div className="text-xs text-neutral-500">{t('achievements.score')}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-4">{achievement.description}</p>
                  
                  {achievement.unlocked ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{t('achievements.unlocked')}</span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        {t('achievements.openedAt')} {achievement.unlockedAt}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{t('achievements.inProgress')}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{t('achievements.progress')}</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Уровни */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">{t('achievements.levels')}</h2>
        <div className="space-y-4">
          {levels.map((level) => (
            <Card key={level.level} className={`transition-all duration-200 ${
              level.unlocked ? 'ring-2 ring-blue-200 bg-blue-50' : 'opacity-60'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                      level.unlocked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {level.level}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">{level.title}</h3>
                      <p className="text-neutral-600">{level.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {level.rewards.map((reward, index) => (
                          <Badge key={index} variant="outline" size="sm">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neutral-500">
                      {level.minPoints} - {level.maxPoints} {t('achievements.score')}
                    </div>
                    {level.unlocked && (
                      <div className="text-green-600 font-medium">{t('achievements.unlocked')}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
