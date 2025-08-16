'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardInteractive, CardStats } from '@/components/ui/card'
import { useTranslations } from '@/lib/useTranslations'
import { 
  ArrowRight, 
  Star, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Play,
  BookOpen,
  Target,
  Award,
  Globe,
  Zap,
  Shield,
  Sparkles,
  Rocket,
  Heart,
  Code,
  Palette,
  Smartphone,
  Database,
  Cloud,
  Lock,
  Clock,
  MapPin,
  MessageCircle,
  Calendar,
  BarChart3,
  Trophy
} from 'lucide-react'

export default function HomePage() {
  const { t } = useTranslations()
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionMessage, setSubscriptionMessage] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    setSubscriptionMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, consent: true }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscriptionMessage('Հաջողությամբ բաժանորդագրվել եք նորություններին!')
        setEmail('')
      } else {
        setSubscriptionMessage(data.error || 'Սխալ է տեղի ունեցել')
      }
    } catch (error) {
      setSubscriptionMessage('Ցանցային սխալ է տեղի ունեցել')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Անցնել հիմնական բովանդակությանը
      </a>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-primary-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-secondary-50/30"></div>
        
        {/* Enhanced floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary-200/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent-200/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-primary-200/30 to-secondary-200/30 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="gradient" className="mb-6 px-4 py-2 text-sm font-medium border-0 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              {t('home.hero.badge')}
            </Badge>
            
            <h1 className="text-responsive-5xl font-bold text-neutral-900 mb-6 leading-tight">
              Զարգացրեք ձեր հմտությունները{' '}
              <span className="text-gradient-primary text-shadow-sm">
                փորձագետների հետ
              </span>{' '}
              իրական ծրագրերի վրա
            </h1>
            
            <p className="text-xl lg:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Կարիերայի զարգացման հարթակ, որը միավորում է նորեկներին փորձառու մասնագետների հետ: Ստացեք գործնական փորձ՝ աշխատելով իրական ծրագրերի վրա:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/auth/signup">
                <Button 
                  size="xl" 
                  className="btn-primary group transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  leftIcon={<Rocket className="h-5 w-5" />}
                  rightIcon={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                >
                  Սկսել Անվճար
                </Button>
              </Link>
              
              <Link href="/projects">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="btn-secondary group transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  leftIcon={<Play className="h-5 w-5" />}
                >
                  Դիտել Ծրագրերը
                </Button>
              </Link>
            </div>

            {/* Enhanced Stats - Заменяем на более интересный контент */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              {/* Биржа заданий */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 sm:p-8 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant="gradient" className="px-3 py-1 text-xs">
                    Նոր
                  </Badge>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
                  Բիժա Զադաչ
                </h3>
                <p className="text-neutral-600 mb-4 leading-relaxed text-sm sm:text-base">
                  Ստացեք վճարովի առաջադրանքներ և կառուցեք ձեր պորտֆոլիոն: Աշխատեք իրական նախագծերի վրա և վաստակեք փող:
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>50+ հաճախորդ</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>100+ ավարտված</span>
                    </div>
                  </div>
                  <div className="w-full">
                    <Link href="/marketplace" className="block w-full">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto group transition-all duration-200 hover:scale-105">
                        <span className="truncate">Դիտել առաջադրանքներ</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Система достижений */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-6 sm:p-8 border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant="gradient" className="px-3 py-1 text-xs">
                    Հանրաճանաչ
                  </Badge>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
                  Հաջողությունների Համակարգ
                </h3>
                <p className="text-neutral-600 mb-4 leading-relaxed text-sm sm:text-base">
                  Վաստակեք բեջեր, բարձրացրեք ձեր մակարդակը և բացեք նոր հնարավորություններ: Հետևեք ձեր առաջընթացին:
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>25+ բեջեր</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>5 մակարդակ</span>
                    </div>
                  </div>
                  <div className="w-full">
                    <Link href="/achievements" className="block w-full">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto group transition-all duration-200 hover:scale-105">
                        <span className="truncate">Դիտել բեջեր</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white" id="main-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-responsive-3xl font-bold text-neutral-900 mb-4">
              Ինչպես է աշխատում
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Պարզ քայլեր՝ ձեր կարիերան հաջորդ մակարդակի հասցնելու համար
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover-lift">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Ընտրեք Ծրագիր</h3>
              <p className="text-neutral-600 leading-relaxed">
                Ընտրեք ձեզ հետաքրքրող ծրագիր կամ ստեղծեք նոր մեկը
              </p>
            </div>

            <div className="text-center group hover-lift">
              <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Միացեք Մենթորին</h3>
              <p className="text-neutral-600 leading-relaxed">
                Ստացեք աջակցություն փորձառու մասնագետներից
              </p>
            </div>

            <div className="text-center group hover-lift">
              <div className="w-20 h-20 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Ստացեք Փորձ</h3>
              <p className="text-neutral-600 leading-relaxed">
                Ավարտեք ծրագիրը և ստացեք գործնական փորձ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-responsive-3xl font-bold text-neutral-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardInteractive variant="elevated" className="group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">{t('home.features.items.practicalExperience.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed">
                  {t('home.features.items.practicalExperience.description')}
                </p>
              </CardContent>
            </CardInteractive>

            <CardInteractive variant="elevated" className="group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">{t('home.features.items.expertMentors.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed">
                  {t('home.features.items.expertMentors.description')}
                </p>
              </CardContent>
            </CardInteractive>

            <CardInteractive variant="elevated" className="group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">{t('home.features.items.careerGrowth.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed">
                  {t('home.features.items.careerGrowth.description')}
                </p>
              </CardContent>
            </CardInteractive>

            <CardInteractive variant="elevated" className="group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">{t('home.features.items.globalCommunity.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed">
                  {t('home.features.items.globalCommunity.description')}
                </p>
              </CardContent>
            </CardInteractive>

            <CardInteractive variant="elevated" className="group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">{t('home.features.items.quickStart.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed">
                  {t('home.features.items.quickStart.description')}
                </p>
              </CardContent>
            </CardInteractive>

            <CardInteractive variant="elevated" className="group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">{t('home.features.items.security.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed">
                  {t('home.features.items.security.description')}
                </p>
              </CardContent>
            </CardInteractive>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-responsive-3xl font-bold text-neutral-900 mb-4">
              {t('home.categories.title')}
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              {t('home.categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <CardInteractive variant="glass" className="text-center p-6 group">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900">Frontend</h3>
            </CardInteractive>

            <CardInteractive variant="glass" className="text-center p-6 group">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900">Backend</h3>
            </CardInteractive>

            <CardInteractive variant="glass" className="text-center p-6 group">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900">Mobile</h3>
            </CardInteractive>

            <CardInteractive variant="glass" className="text-center p-6 group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900">Design</h3>
            </CardInteractive>

            <CardInteractive variant="glass" className="text-center p-6 group">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900">DevOps</h3>
            </CardInteractive>

            <CardInteractive variant="glass" className="text-center p-6 group">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900">Security</h3>
            </CardInteractive>
          </div>
        </div>
      </section>

      {/* Success Stories - Заменяем на более интересный контент */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-responsive-3xl font-bold text-neutral-900 mb-4">
              Զարգացրեք ձեր կարիերան
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Բացահայտեք նոր հնարավորություններ և կառուցեք ձեր ապագան
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Биржа заданий */}
            <CardInteractive variant="elevated" className="group bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/50">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">Բիժա Զադաչ</h4>
                    <p className="text-sm text-neutral-600">Վճարովի առաջադրանքներ</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Ստացեք վճարովի առաջադրանքներ հաճախորդներից: Կառուցեք ձեր պորտֆոլիոն և վաստակեք փող՝ աշխատելով իրական նախագծերի վրա:
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-neutral-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Ակտիվ 24/7</span>
                  </div>
                  <Link href="/marketplace">
                    <Button variant="outline" size="sm" className="group">
                      Սկսել
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </CardInteractive>

            {/* Система менторства */}
            <CardInteractive variant="elevated" className="group bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200/50">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">Մենթորություն</h4>
                    <p className="text-sm text-neutral-600">Փորձառու մասնագետներ</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Միացեք փորձառու մասնագետներին, ովքեր կօգնեն ձեզ հասնել հաջողության: Ստացեք անձնական ուղղորդում և աջակցություն:
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-neutral-500">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span>Անմիջական հաղորդակցություն</span>
                  </div>
                  <Link href="/mentors">
                    <Button variant="outline" size="sm" className="group">
                      Գտնել մենթոր
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </CardInteractive>

            {/* Портфолио и проекты */}
            <CardInteractive variant="elevated" className="group bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200/50">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Code className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">Պորտֆոլիո</h4>
                    <p className="text-sm text-neutral-600">Նախագծեր և հմտություններ</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Կառուցեք ձեր պորտֆոլիոն՝ ցուցադրելով ձեր աշխատանքը: Մասնակցեք նախագծերին և զարգացրեք ձեր հմտությունները:
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-neutral-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Ամեն օր նոր նախագծեր</span>
                  </div>
                  <Link href="/projects">
                    <Button variant="outline" size="sm" className="group">
                      Դիտել նախագծեր
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </CardInteractive>
          </div>
        </div>
      </section>

      {/* CTA Section - Заменяем на более интересный контент */}
      <section className="py-20 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
        {/* Фоновые элементы */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        
        {/* Анимированные элементы */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="glass" className="mb-6 px-4 py-2 text-sm font-medium border-white/20 text-white/90">
              <Sparkles className="w-4 h-4 mr-2" />
              Հատուկ առաջարկ
            </Badge>
            
            <h2 className="text-responsive-4xl font-bold text-white mb-6 leading-tight">
              Պատրա՞ստ եք սկսել ձեր{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                հաջողության ճանապարհը
              </span>
            </h2>
            
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Միացեք հազարավոր հաջողակ մասնագետներին, ովքեր արդեն զարգացնում են իրենց հմտությունները SkillBridge-ում: 
              Սկսեք անվճար և բացահայտեք ձեր ներուժը:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Անվճար ուսուցում</h3>
                <p className="text-white/80 text-sm">Սկսեք անմիջապես՝ առանց որևէ վճարի</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Վճարովի առաջադրանքներ</h3>
                <p className="text-white/80 text-sm">Վաստակեք փող՝ աշխատելով նախագծերի վրա</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button 
                  size="xl" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-2xl group transform hover:scale-105 transition-all duration-200"
                  leftIcon={<Rocket className="h-5 w-5" />}
                  rightIcon={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                >
                  Սկսել ուսուցումը
                </Button>
              </Link>
              
              <Link href="/projects">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm group transform hover:scale-105 transition-all duration-200 bg-transparent"
                  leftIcon={<Play className="h-5 w-5" />}
                >
                  Ուսումնասիրել նախագծերը
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-white/70 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                <span>Անվճար գրանցում</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                <span>Անմիջական մուտք</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                <span>24/7 աջակցություն</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-responsive-3xl font-bold text-neutral-900 mb-4">
              Բաժանորդագրվել նորություններին
            </h2>
            
            <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
              Ստացեք վերջին թարմացումները և նոր հնարավորությունները: Միացեք մեր համայնքին և լինեք առաջինը, ով կիմանա նորությունների մասին:
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ձեր email-ը"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-200"
                required
                disabled={isSubscribing}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                disabled={isSubscribing}
              >
                {isSubscribing ? 'Գործողություն...' : 'Բաժանորդագրվել'}
              </button>
            </form>
            
            {subscriptionMessage && (
              <p className={`text-sm mt-4 ${subscriptionMessage.includes('Հաջողությամբ') ? 'text-green-500' : 'text-red-500'}`}>
                {subscriptionMessage}
              </p>
            )}

            <p className="text-sm text-neutral-500 mt-4">
              Բաժանորդագրվելով՝ դուք համաձայնում եք ստանալ նորություններ և հատուկ առաջարկներ:
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
