"use client"

export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MOCK_MENTORS } from '@/lib/constants'
import { useTranslations } from '@/lib/useTranslations'
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  DollarSign,
  ChevronDown,
  TrendingUp
} from 'lucide-react'
import { formatCurrency, calculateRatingStars } from '@/lib/utils'

export default function MentorsPage() {
  const { t } = useTranslations()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExpertise, setSelectedExpertise] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredMentors = MOCK_MENTORS.filter(mentor => {
    const matchesSearch = mentor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         mentor.bio.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesExpertise = !selectedExpertise || mentor.expertise.includes(selectedExpertise)
    const matchesAvailability = !selectedAvailability || mentor.availability === selectedAvailability
    
    return matchesSearch && matchesExpertise && matchesAvailability
  })

  const allExpertise = Array.from(new Set(MOCK_MENTORS.flatMap(mentor => mentor.expertise)))

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case 'available': return t('mentors.filters.available')
      case 'busy': return t('mentors.filters.busy')
      case 'unavailable': return t('mentors.filters.unavailable')
      default: return availability
    }
  }

  const getAvailabilityVariant = (availability: string) => {
    switch (availability) {
      case 'available': return 'success'
      case 'busy': return 'warning'
      case 'unavailable': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Ուսուցիչներ</h1>
            <p className="text-xl text-neutral-600">
              {t('mentors.subtitle')}
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
                placeholder={t('mentors.search.placeholder')}
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
                 <span>Զտիչներ</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              <div className="text-sm text-neutral-600">
                 Գտնվել է {filteredMentors.length} ուսուցիչ
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Expertise Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('mentors.filters.expertise')}
                  </label>
                  <select
                    value={selectedExpertise}
                    onChange={(e) => setSelectedExpertise(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
                  >
                    <option value="">{t('mentors.filters.allExpertise')}</option>
                    {allExpertise.map((expertise) => (
                      <option key={expertise} value={expertise}>
                        {expertise}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('mentors.filters.availability')}
                  </label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
                  >
                    <option value="">{t('mentors.filters.allAvailability')}</option>
                    <option value="available">{t('mentors.filters.available')}</option>
                    <option value="busy">{t('mentors.filters.busy')}</option>
                    <option value="unavailable">{t('mentors.filters.unavailable')}</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('mentors.filters.priceRange')}
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder={t('mentors.filters.min')}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder={t('mentors.filters.max')}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMentors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <Users className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {t('mentors.mentor.notFound.title')}
              </h3>
              <p className="text-neutral-600">
                {t('mentors.mentor.notFound.description')}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMentors.map((mentor) => {
                const { full, half, empty } = calculateRatingStars(mentor.rating)
                
                return (
                  <Card key={mentor.id} className="transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-lg font-semibold">
                            {mentor.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg leading-tight">
                            <Link 
                              href={`/mentors/${mentor.id}`}
                              className="hover:text-primary-600 transition-colors"
                            >
                              {mentor.fullName}
                            </Link>
                          </CardTitle>
                          <p className="text-sm text-neutral-600 mt-1">
                            {mentor.expertise.join(', ')}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(full)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                              ))}
                              {[...Array(half)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                              ))}
                              {[...Array(empty)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-neutral-300" />
                              ))}
                            </div>
                            <span className="text-sm text-neutral-600">
                              {mentor.rating} ({mentor.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {mentor.bio}
                      </p>

                      {/* Mentor Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-neutral-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{t('mentors.mentor.rate')}</span>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(mentor.hourlyRate)}/{t('mentors.mentor.perHour')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-neutral-600">
                            <Users className="h-4 w-4" />
                            <span>{t('mentors.mentor.students')}</span>
                          </div>
                          <span className="font-medium">{mentor.totalMentees}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-neutral-600">
                            <TrendingUp className="h-4 w-4" />
                            <span>{t('mentors.mentor.success')}</span>
                          </div>
                          <span className="font-medium">{mentor.successRate}%</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-neutral-600">
                            <Clock className="h-4 w-4" />
                            <span>{t('mentors.mentor.experience')}</span>
                          </div>
                          <span className="font-medium">{mentor.experience} {t('mentors.mentor.years')}</span>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {mentor.specializations.slice(0, 3).map((spec) => (
                            <Badge key={spec} variant="secondary" size="sm">
                              {spec}
                            </Badge>
                          ))}
                          {mentor.specializations.length > 3 && (
                            <Badge variant="secondary" size="sm">
                              +{mentor.specializations.length - 3} {t('mentors.mentor.more')}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Availability & Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={getAvailabilityVariant(mentor.availability) as "default" | "secondary" | "destructive" | "outline"}
                            size="sm"
                          >
                            {getAvailabilityLabel(mentor.availability)}
                          </Badge>
                        </div>

                        <Link href={`/mentors/${mentor.id}`}>
                          <Button variant="gradient" size="sm">
                            {t('mentors.mentor.bookSession')}
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
          {filteredMentors.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                {t('mentors.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
