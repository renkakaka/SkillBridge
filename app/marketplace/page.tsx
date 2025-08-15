'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MapPin, Clock, DollarSign, Star, Users, Briefcase, X } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  budget: { min: number; max: number }
  duration: string
  skills: string[]
  client: { name: string; rating: number }
  location: string
  type: string
  status: string
  createdAt: string
}

export default function MarketplacePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBudget, setSelectedBudget] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [applyProjectId, setApplyProjectId] = useState<string | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const categories = [
    { id: 'all', label: 'Բոլորը' },
    { id: 'web', label: 'Վեբ Զարգացում' },
    { id: 'mobile', label: 'Մոբայլ Զարգացում' },
    { id: 'design', label: 'Դիզայն' },
    { id: 'marketing', label: 'Մարքեթինգ' },
    { id: 'writing', label: 'Գրագրություն' },
    { id: 'translation', label: 'Թարգմանություն' },
  ]

  const budgetRanges = [
    { id: 'all', label: 'Բոլոր բյուջեները' },
    { id: '0-100', label: '$0 - $100' },
    { id: '100-500', label: '$100 - $500' },
    { id: '500-1000', label: '$500 - $1000' },
    { id: '1000+', label: '$1000+' },
  ]

  const durations = [
    { id: 'all', label: 'Բոլոր ժամկետները' },
    { id: '1-7', label: '1-7 օր' },
    { id: '1-4', label: '1-4 շաբաթ' },
    { id: '1-3', label: '1-3 ամիս' },
    { id: '3+', label: '3+ ամիս' },
  ]

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        // Преобразуем данные в нужный формат
        const formattedProjects = (Array.isArray(data) ? data : data.projects || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          budget: { min: p.budgetMin || 0, max: p.budgetMax || 0 },
          duration: p.durationWeeks ? `${p.durationWeeks} շաբաթ` : 'Կարճաժամկետ',
          skills: p.requiredSkills ? JSON.parse(p.requiredSkills) : [],
          client: { name: p.client?.fullName || 'Անհայտ', rating: 4.5 },
          location: 'Հեռակա',
          type: p.projectType || 'Ընդհանուր',
          status: p.status || 'ակտիվ',
          createdAt: p.createdAt || new Date().toISOString()
        }))
        setProjects(formattedProjects)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || project.type.toLowerCase().includes(selectedCategory)
    const matchesBudget = selectedBudget === 'all' || 
      (selectedBudget === '0-100' && project.budget.max <= 100) ||
      (selectedBudget === '100-500' && project.budget.min >= 100 && project.budget.max <= 500) ||
      (selectedBudget === '500-1000' && project.budget.min >= 500 && project.budget.max <= 1000) ||
      (selectedBudget === '1000+' && project.budget.min >= 1000)
    const matchesDuration = selectedDuration === 'all' || 
      project.duration.includes(selectedDuration.split('-')[0])

    return matchesSearch && matchesCategory && matchesBudget && matchesDuration
  })

  const handleApply = async (projectId: string) => {
    setApplyProjectId(projectId)
    setCoverLetter('')
  }

  const submitApplication = async () => {
    if (!applyProjectId || !coverLetter.trim()) return
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: applyProjectId,
          userEmail: localStorage.getItem('userEmail'),
          coverLetter,
          proposedTimeline: '1'
        })
      })
      if (response.ok) {
        setApplyProjectId(null)
        setCoverLetter('')
        setToast({ message: 'Դիմումը հաջողությամբ ուղարկվել է!', type: 'success' })
        setTimeout(() => setToast(null), 3000)
      } else {
        setToast({ message: 'Սխալ է տեղի ունեցել դիմում ուղարկելիս', type: 'error' })
        setTimeout(() => setToast(null), 3000)
      }
    } catch (error) {
      setToast({ message: 'Սխալ է տեղի ունեցել', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Բորսա Առաջադրանքների</h1>
        <p className="text-neutral-600">Գտեք ձեր հաջորդ նախագիծը կամ հաճախորդին</p>
      </div>

      {/* Фильтры и поиск */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Որոնել նախագծեր..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Ֆիլտրեր
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>

          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            {budgetRanges.map(budget => (
              <option key={budget.id} value={budget.id}>{budget.label}</option>
            ))}
          </select>

          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            {durations.map(duration => (
              <option key={duration.id} value={duration.id}>{duration.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Список проектов */}
      <div className="grid gap-6">
        {filteredProjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">Նախագծեր չեն գտնվել</p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                    <p className="text-neutral-600 mb-4">{project.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    {project.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      ${project.budget.min} - ${project.budget.max}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{project.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">{project.client.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {project.skills.length > 5 && (
                    <Badge variant="outline" size="sm">
                      +{project.skills.length - 5} ավելին
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm text-neutral-600">
                      Հաճախորդ: {project.client.name}
                    </span>
                  </div>
                  <Button onClick={() => handleApply(project.id)}>
                    Դիմել
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {applyProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Դիմում նախագծին</h3>
              <button onClick={() => setApplyProjectId(null)} className="p-2 rounded hover:bg-neutral-100"><X className="h-5 w-5"/></button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-neutral-600">Նկարագրեք հակիրճ՝ ինչու եք դուք ճիշտ մասնագետը․</p>
              <textarea value={coverLetter} onChange={(e)=>setCoverLetter(e.target.value)} className="w-full border rounded-lg p-3 h-40 focus:outline-none focus:ring-2 focus:ring-primary-500/30" placeholder={`— Ում համար է դիմումը\n— Ի՞նչ արժեք եք ստեղծում նախագծի համար\n— Կարճ պլան (քայլերով)\n— Ժամկետ/գումար (եթե առաջարկում եք)`}/>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setApplyProjectId(null)}>Փակել</Button>
              <Button onClick={submitApplication} disabled={!coverLetter.trim()}>Ուղարկել</Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
