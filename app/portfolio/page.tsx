'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Calendar, 
  DollarSign, 
  Users, 
  Award,
  TrendingUp,
  Filter,
  Search,
  Download,
  Share2,
  Heart,
  MessageCircle
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  image: string
  category: string
  skills: string[]
  budget: number
  duration: string
  rating: number
  reviews: number
  views: number
  likes: number
  status: 'completed' | 'in-progress' | 'planned'
  client: string
  completionDate?: Date
  tags: string[]
}

interface Skill {
  name: string
  level: number
  experience: string
  projects: number
  category: 'frontend' | 'backend' | 'design' | 'mobile' | 'other'
}

interface PortfolioStats {
  totalProjects: number
  totalEarnings: number
  averageRating: number
  totalViews: number
  totalLikes: number
  completedProjects: number
  activeProjects: number
  skillsCount: number
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [stats, setStats] = useState<PortfolioStats>({
    totalProjects: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalViews: 0,
    totalLikes: 0,
    completedProjects: 0,
    activeProjects: 0,
    skillsCount: 0
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortfolioData()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [projects, skills])

  const loadPortfolioData = () => {
    // Симулируем загрузку проектов
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Էլեկտրոնային առևտրի կայք',
        description: 'Ժամանակակից էլեկտրոնային առևտրի կայք React.js և Node.js-ով',
        image: '/api/placeholder/400/300?text=E-commerce',
        category: 'frontend',
        skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
        budget: 2500,
        duration: '3 ամիս',
        rating: 4.8,
        reviews: 12,
        views: 1450,
        likes: 89,
        status: 'completed',
        client: 'TechCorp',
        completionDate: new Date('2024-12-15'),
        tags: ['E-commerce', 'React', 'Node.js', 'Responsive']
      },
      {
        id: '2',
        title: 'Մոբայլ հավելված iOS-ի համար',
        description: 'iOS հավելված Swift-ով սոցիալական ցանցի համար',
        image: '/api/placeholder/400/300?text=iOS App',
        category: 'mobile',
        skills: ['Swift', 'iOS', 'UIKit', 'Core Data'],
        budget: 1800,
        duration: '2 ամիս',
        rating: 4.9,
        reviews: 8,
        views: 980,
        likes: 67,
        status: 'completed',
        client: 'SocialApp Inc',
        completionDate: new Date('2024-11-20'),
        tags: ['iOS', 'Swift', 'Social Network', 'Mobile']
      },
      {
        id: '3',
        title: 'Լոգո և բրենդինգ',
        description: 'Բրենդի ինքնության ստեղծում և լոգոյի դիզայն',
        image: '/api/placeholder/400/300?text=Logo Design',
        category: 'design',
        skills: ['Adobe Illustrator', 'Branding', 'Typography', 'Color Theory'],
        budget: 800,
        duration: '2 շաբաթ',
        rating: 4.7,
        reviews: 15,
        views: 720,
        likes: 45,
        status: 'completed',
        client: 'StartupXYZ',
        completionDate: new Date('2024-10-10'),
        tags: ['Logo', 'Branding', 'Design', 'Identity']
      },
      {
        id: '4',
        title: 'Վեբ կայքի վերանորոգում',
        description: 'Հին վեբ կայքի վերանորոգում և արդիականացում',
        image: '/api/placeholder/400/300?text=Website Redesign',
        category: 'frontend',
        skills: ['HTML5', 'CSS3', 'JavaScript', 'WordPress'],
        budget: 1200,
        duration: '1 ամիս',
        rating: 4.6,
        reviews: 6,
        views: 650,
        likes: 38,
        status: 'in-progress',
        client: 'BusinessCorp',
        tags: ['Redesign', 'WordPress', 'Responsive', 'SEO']
      },
      {
        id: '5',
        title: 'Մարքեթինգային արշավ',
        description: 'Դիջիթալ մարքեթինգային արշավ սոցիալական ցանցերում',
        image: '/api/placeholder/400/300?text=Marketing',
        category: 'other',
        skills: ['Social Media', 'Google Ads', 'Analytics', 'Content Creation'],
        budget: 600,
        duration: '1 ամիս',
        rating: 4.5,
        reviews: 4,
        views: 420,
        likes: 23,
        status: 'in-progress',
        client: 'MarketingPro',
        tags: ['Marketing', 'Social Media', 'Ads', 'Analytics']
      }
    ]

    // Симулируем загрузку навыков
    const mockSkills: Skill[] = [
      {
        name: 'React.js',
        level: 90,
        experience: '3 տարի',
        projects: 15,
        category: 'frontend'
      },
      {
        name: 'Node.js',
        level: 85,
        experience: '2.5 տարի',
        projects: 12,
        category: 'backend'
      },
      {
        name: 'TypeScript',
        level: 80,
        experience: '2 տարի',
        projects: 10,
        category: 'frontend'
      },
      {
        name: 'Swift',
        level: 75,
        experience: '1.5 տարի',
        projects: 8,
        category: 'mobile'
      },
      {
        name: 'Adobe Illustrator',
        level: 85,
        experience: '4 տարի',
        projects: 20,
        category: 'design'
      },
      {
        name: 'Python',
        level: 70,
        experience: '2 տարի',
        projects: 6,
        category: 'backend'
      }
    ]

    setProjects(mockProjects)
    setSkills(mockSkills)
    setLoading(false)
  }

  const calculateStats = () => {
    const totalProjects = projects.length
    const totalEarnings = projects.reduce((sum, p) => sum + p.budget, 0)
    const averageRating = projects.length > 0 
      ? projects.reduce((sum, p) => sum + p.rating, 0) / projects.length 
      : 0
    const totalViews = projects.reduce((sum, p) => sum + p.views, 0)
    const totalLikes = projects.reduce((sum, p) => sum + p.likes, 0)
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const activeProjects = projects.filter(p => p.status === 'in-progress').length
    const skillsCount = skills.length

    setStats({
      totalProjects,
      totalEarnings,
      averageRating,
      totalViews,
      totalLikes,
      completedProjects,
      activeProjects,
      skillsCount
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'frontend':
        return 'bg-blue-100 text-blue-800'
      case 'backend':
        return 'bg-green-100 text-green-800'
      case 'mobile':
        return 'bg-purple-100 text-purple-800'
      case 'design':
        return 'bg-yellow-100 text-yellow-800'
      case 'other':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'planned':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSkillCategoryColor = (category: string) => {
    switch (category) {
      case 'frontend':
        return 'border-blue-200 bg-blue-50'
      case 'backend':
        return 'border-green-200 bg-green-50'
      case 'mobile':
        return 'border-purple-200 bg-purple-50'
      case 'design':
        return 'border-yellow-200 bg-yellow-50'
      case 'other':
        return 'border-gray-200 bg-gray-50'
      default:
        return 'border-neutral-200 bg-neutral-50'
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const categories = ['all', 'frontend', 'backend', 'mobile', 'design', 'other']

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
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
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Պորտֆոլիո</h1>
            <p className="text-neutral-600">Ցուցադրեք ձեր աշխատանքները և հմտությունները</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddSkill(!showAddSkill)}>
              <Plus className="h-4 w-4 mr-2" />
              Ավելացնել հմտություն
            </Button>
            <Button onClick={() => setShowAddProject(!showAddProject)}>
              <Plus className="h-4 w-4 mr-2" />
              Ավելացնել նախագիծ
            </Button>
          </div>
        </div>

        {/* Статистика портфолио */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Ընդհանուր նախագծեր</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalProjects}</p>
                  <p className="text-sm text-neutral-500">{stats.completedProjects} ավարտված</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Ընդհանուր եկամուտ</p>
                  <p className="text-2xl font-bold text-neutral-900">${stats.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-neutral-500">Բոլոր նախագծերից</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Միջին գնահատական</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.averageRating.toFixed(1)}</p>
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span>5-ից</span>
                  </div>
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
                  <p className="text-sm font-medium text-neutral-600">Ընդհանուր դիտումներ</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-sm text-neutral-500">{stats.totalLikes} հավանություն</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Фильтры и поиск */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Որոնել նախագծեր կամ հմտություններ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' && 'Բոլորը'}
                {category === 'frontend' && 'Frontend'}
                {category === 'backend' && 'Backend'}
                {category === 'mobile' && 'Mobile'}
                {category === 'design' && 'Design'}
                {category === 'other' && 'Այլ'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Проекты */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Նախագծեր</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-all duration-200">
              <div className="relative">
                <div className="aspect-video bg-neutral-200 rounded-t-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <span className="text-neutral-600 font-medium">{project.title}</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status === 'completed' && 'Ավարտված'}
                    {project.status === 'in-progress' && 'Ընթացքում'}
                    {project.status === 'planned' && 'Նախատեսված'}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className={getCategoryColor(project.category)}>
                    {project.category === 'frontend' && 'Frontend'}
                    {project.category === 'backend' && 'Backend'}
                    {project.category === 'mobile' && 'Mobile'}
                    {project.category === 'design' && 'Design'}
                    {project.category === 'other' && 'Այլ'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {project.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.skills.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {project.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${project.budget.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{project.rating}</span>
                    </div>
                    <span className="text-xs text-neutral-500">({project.reviews})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Award className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">Նախագծեր չեն գտնվել</p>
              <p className="text-sm text-neutral-500 mt-1">
                {searchQuery ? `"${searchQuery}" որոնման արդյունքում նախագծեր չեն գտնվել` : 'Դուք դեռ չունեք նախագծեր'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Навыки */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Հմտություններ</h2>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <Card key={skill.name} className={`border-2 ${getSkillCategoryColor(skill.category)}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-neutral-900">{skill.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {skill.category === 'frontend' && 'Frontend'}
                    {skill.category === 'backend' && 'Backend'}
                    {skill.category === 'mobile' && 'Mobile'}
                    {skill.category === 'design' && 'Design'}
                    {skill.category === 'other' && 'Այլ'}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-neutral-600 mb-1">
                    <span>Մակարդակ</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {skill.experience}
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {skill.projects} նախագիծ
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {skills.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">Հմտություններ չեն գտնվել</p>
              <p className="text-sm text-neutral-500 mt-1">Ավելացրեք ձեր հմտությունները պորտֆոլիոյում</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
