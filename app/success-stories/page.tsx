"use client"

export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
// import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { MOCK_SUCCESS_STORIES } from '@/lib/constants'
import { useTranslations } from '@/lib/useTranslations'
import { 
  Filter, 
  ChevronDown,
  ArrowRight,
  Play,
  TrendingUp,
  Clock,
  DollarSign,
  Briefcase,
  Star
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function SuccessStoriesPage() {
  const { t } = useTranslations()
  const [selectedField, setSelectedField] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredStories = MOCK_SUCCESS_STORIES.filter(story => {
    const matchesField = !selectedField || story.skillsGained.includes(selectedField)
    const matchesTimeframe = !selectedTimeframe || story.timeline.includes(selectedTimeframe)
    
    return matchesField && matchesTimeframe
  })

  const allFields = Array.from(new Set(MOCK_SUCCESS_STORIES.flatMap(story => story.skillsGained)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('successStories.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('successStories.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="text-sm text-gray-600">
              {filteredStories.length} {t('successStories.title').toLowerCase()} գտնվել է
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Զտիչներ</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Field Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Դաշտ
                  </label>
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
                  >
                    <option value="">Բոլոր դաշտերը</option>
                    {allFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timeframe Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ժամանակահատված
                  </label>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
                  >
                    <option value="">Բոլոր ժամանակահատվածները</option>
                    <option value="3">3 ամիս</option>
                    <option value="4">4 ամիս</option>
                    <option value="6">6 ամիս</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Video Testimonials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Առանձնահատուկ վիդեո վկայություններ
            </h2>
            <p className="text-gray-600">
              Դիտեք իրական մարդկանց, ովքեր կիսվում են իրենց ճանապարհով սկսնակից մինչև մասնագետ
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-video bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="h-8 w-8 text-primary-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    3:24
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Դիտեք {i === 1 ? 'Ջոնի' : i === 2 ? 'Սարայի' : 'Մայքի'} ճանապարհը
                  </h3>
                  <p className="text-sm text-gray-600">
                    Bootcamp-ից մինչև ${i === 1 ? '70k' : i === 2 ? '65k' : '75k'} մշակող
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <TrendingUp className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Հաջողության պատմություններ չեն գտնվել
              </h3>
              <p className="text-gray-600">
                Փորձեք փոխել ձեր զտիչները:
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {filteredStories.map((story) => (
                <Card key={story.id} className="transition-transform hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-lg font-semibold">
                          {story.userId === 'user1' ? 'JD' : 'EW'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl mb-2">
                          {story.title}
                        </CardTitle>
                        
                        {/* Before/After */}
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm font-medium text-gray-500">
                            {story.beforeTitle}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-900">
                            {story.afterTitle}
                          </span>
                        </div>

                        {/* Timeline and Salary */}
                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{story.timeline}</span>
                          </div>
                          {story.salaryIncrease && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>+{formatCurrency(story.salaryIncrease)}/տարի</span>
                            </div>
                          )}
                        </div>

                        {/* Quote */}
                        <blockquote className="text-gray-700 italic mb-4 text-sm">
                          &quot;{story.quote}&quot;
                        </blockquote>

                        {/* Stats */}
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Briefcase className="h-4 w-4" />
                            <span>{story.projectsCompleted} նախագիծ</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <TrendingUp className="h-4 w-4" />
                            <span>{story.skillsGained.length} հմտություն ձեռք բերվեց</span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {story.skillsGained.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="secondary" size="sm">
                                {skill}
                              </Badge>
                            ))}
                            {story.skillsGained.length > 4 && (
                              <Badge variant="secondary" size="sm">
                                +{story.skillsGained.length - 4} ավելին
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">5.0 վարկանիշ</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredStories.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                {t('successStories.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Պատրա՞ստ եք գրել ձեր հաջողության պատմությունը:
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Միացեք հազարավոր այլ մարդկանց, ովքեր փոխակերպեցին իրենց կարիերան SkillBridge-ի հետ
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Սկսել ձեր ճանապարհը
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
                Զննել նախագծերը
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
