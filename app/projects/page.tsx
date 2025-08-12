"use client"

export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MOCK_PROJECTS } from '@/lib/constants'
import { useTranslations } from '@/lib/useTranslations'
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  DollarSign,
  ChevronDown,
  Target,
  MapPin,
  Star
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ProjectsPage() {
  const { t } = useTranslations()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Until admin adds items in DB, show empty list (no filtering yet)
  const filteredProjects: any[] = []

  const allCategories = Array.from(new Set(MOCK_PROJECTS.map(project => project.category)))
  const allDifficulties = ['Beginner', 'Intermediate', 'Advanced']

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success'
      case 'Intermediate': return 'warning'
      case 'Advanced': return 'destructive'
      default: return 'secondary'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return t('projects.filters.beginner')
      case 'Intermediate': return t('projects.filters.intermediate')
      case 'Advanced': return t('projects.filters.advanced')
      default: return difficulty
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              {t('projects.title')}
            </h1>
            <p className="text-xl text-neutral-600">
              {t('projects.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-white border-b border-neutral-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder={t('projects.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>{t('projects.search.filters')}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              <div className="text-sm text-neutral-600">
                {t('projects.search.found').replace('{count}', filteredProjects.length.toString())}
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('projects.filters.category')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
                  >
                    <option value="">{t('projects.filters.allCategories')}</option>
                    {allCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('projects.filters.difficulty')}
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
                  >
                    <option value="">{t('projects.filters.allDifficulties')}</option>
                    {allDifficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {getDifficultyLabel(difficulty)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('projects.filters.duration')}
                  </label>
                  <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2">
                    <option value="">{t('projects.filters.allDurations')}</option>
                    <option value="1-2">1-2 շաբաթ</option>
                    <option value="3-4">3-4 շաբաթ</option>
                    <option value="1-2-months">1-2 ամիս</option>
                    <option value="3+">3+ ամիս</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <Target className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {t('projects.project.notFound.title')}
              </h3>
              <p className="text-neutral-600">
                {t('projects.project.notFound.description')}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                
                return (
                  <Card key={project.id} className="transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight mb-2">
                            <Link 
                              href={`/projects/${project.id}`}
                              className="hover:text-primary-600 transition-colors"
                            >
                              {project.title}
                            </Link>
                          </CardTitle>
                          <p className="text-sm text-neutral-600 mb-3">
                            {project.category}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={getDifficultyColor(project.difficulty) as "default" | "secondary" | "destructive" | "outline"}
                              size="sm"
                            >
                              {getDifficultyLabel(project.difficulty)}
                            </Badge>
                            <div className="flex items-center space-x-1 text-sm text-neutral-600">
                              <Star className="h-3 w-3" />
                              <span>{project.rating}</span>
                              <span className="text-neutral-400">({project.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Project Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-neutral-600">
                            <Clock className="h-4 w-4" />
                            <span>{t('projects.project.duration')}</span>
                          </div>
                          <span className="font-medium">{project.duration}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-neutral-600">
                            <Users className="h-4 w-4" />
                            <span>Մասնակիցներ</span>
                          </div>
                          <span className="font-medium">{project.maxParticipants}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-neutral-600">
                            <DollarSign className="h-4 w-4" />
                            <span>Բյուջե</span>
                          </div>
                          <span className="font-medium">
                            {project.budget ? `${formatCurrency(project.budget.min)} - ${formatCurrency(project.budget.max)}` : 'Անվճար'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-neutral-600">
                            <MapPin className="h-4 w-4" />
                            <span>Լոկացիա</span>
                          </div>
                          <span className="font-medium">
                            {project.location || 'Հեռակա'}
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {project.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" size="sm">
                              {skill}
                            </Badge>
                          ))}
                          {project.skills.length > 4 && (
                            <Badge variant="secondary" size="sm">
                              +{project.skills.length - 4} ավելին
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="pt-4 border-t border-neutral-100">
                        <Link href={`/projects/${project.id}`}>
                          <Button variant="gradient" className="w-full">
                            Միանալ նախագծին
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Load More */}
          {filteredProjects.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                {t('projects.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
