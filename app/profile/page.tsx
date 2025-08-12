'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Briefcase, 
  Star, 
  Trophy, 
  Edit3, 
  Save, 
  X,
  Camera,
  Shield,
  Bell,
  Settings,
  Award,
  Target,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react'

interface UserProfile {
  id: string
  fullName: string
  email: string
  userType: string
  avatarUrl?: string
  bio: string
  location: string
  website: string
  skills: string[]
  experience: string
  rating: number
  totalProjects: number
  completedProjects: number
  totalEarnings: number
  level: number
  achievements: number
  joinDate: string
  lastSeen: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    fullName: 'Վազգեն Կարամյան',
    email: 'vazgen@example.com',
    userType: 'mentor',
    bio: 'Full Stack Developer with 5+ years of experience in React, Node.js, and TypeScript. Passionate about teaching and helping newcomers grow in their careers.',
    location: 'Երևան, Հայաստան',
    website: 'https://vazgen.dev',
    skills: ['React', 'Node.js', 'TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
    experience: '5+ տարի',
    rating: 4.9,
    totalProjects: 15,
    completedProjects: 14,
    totalEarnings: 2500,
    level: 5,
    achievements: 8,
    joinDate: '2023-01-15',
    lastSeen: '2024-01-20'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<UserProfile>(profile)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = () => {
    // Здесь будет API вызов для загрузки профиля
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Симулируем сохранение
    await new Promise(resolve => setTimeout(resolve, 1000))
    setProfile(editData)
    setIsEditing(false)
    setIsLoading(false)
  }

  const handleCancel = () => {
    setEditData(profile)
    setIsEditing(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Здесь будет логика загрузки аватара
      console.log('Avatar file selected:', file)
    }
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Պրոֆիլ</h1>
            <p className="text-neutral-600">Կառավարեք ձեր անձնական տվյալները և կարգավորումները</p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Խմբագրել
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Չեղարկել
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Պահպանվում է...' : 'Պահպանել'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка - Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Անձնական տվյալներ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Аватар и основная информация */}
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                      {profile.fullName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Camera className="h-4 w-4 text-gray-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Ամբողջական անուն</Label>
                      {isEditing ? (
                        <Input
                          id="fullName"
                          value={editData.fullName}
                          onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                        />
                      ) : (
                        <p className="text-lg font-medium text-neutral-900">{profile.fullName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                        />
                      ) : (
                        <p className="text-lg text-neutral-600">{profile.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <Badge className={getUserTypeColor(profile.userType)}>
                      {getUserTypeLabel(profile.userType)}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{profile.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Био */}
              <div>
                <Label htmlFor="bio">Կենսագրություն</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    rows={3}
                  />
                ) : (
                  <p className="text-neutral-600 mt-1">{profile.bio}</p>
                )}
              </div>

              {/* Местоположение и веб-сайт */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Տեղադրություն</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="website">Կայք</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      value={editData.website}
                      onChange={(e) => setEditData({...editData, website: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-600 mt-1">
                      <Globe className="h-4 w-4" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Навыки */}
              <div>
                <Label>Հմտություններ</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Статистика */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Վիճակագրություն
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile.totalProjects}</div>
                  <div className="text-sm text-neutral-600">Ընդհանուր նախագծեր</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{profile.completedProjects}</div>
                  <div className="text-sm text-neutral-600">Ավարտված</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.level}</div>
                  <div className="text-sm text-neutral-600">Մակարդակ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{profile.achievements}</div>
                  <div className="text-sm text-neutral-600">Հաջողություններ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - Дополнительная информация */}
        <div className="space-y-6">
          {/* Действия */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Գործողություններ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Անվտանգություն
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Ծանուցումներ
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Համայնք
              </Button>
            </CardContent>
          </Card>

          {/* Информация об аккаунте */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Հաշվի տվյալներ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Միացման ամսաթիվ</span>
                <span className="text-sm font-medium">{profile.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Վերջին այց</span>
                <span className="text-sm font-medium">{profile.lastSeen}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Փորձ</span>
                <span className="text-sm font-medium">{profile.experience}</span>
              </div>
              {profile.totalEarnings > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Ընդհանուր վաստակ</span>
                  <span className="text-sm font-medium text-green-600">${profile.totalEarnings}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Достижения */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Վերջին հաջողություններ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-sm font-medium">Առաջին նախագիծ</div>
                  <div className="text-xs text-neutral-600">Ավարտվել է 2 օր առաջ</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium">Մակարդակ 5</div>
                  <div className="text-xs text-neutral-600">Հասել եք 1 շաբաթ առաջ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
