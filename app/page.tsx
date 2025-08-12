'use client'

import Link from 'next/link'
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
  BarChart3
} from 'lucide-react'

export default function HomePage() {
  const { t } = useTranslations()
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
                  className="btn-primary group"
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
                  className="btn-secondary group"
                  leftIcon={<Play className="h-5 w-5" />}
                >
                  Դիտել Ծրագրերը
                </Button>
              </Link>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group hover-lift">
                <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-200">500+</div>
                <div className="text-neutral-600 font-medium">Ակտիվ Ծրագրեր</div>
              </div>
              <div className="text-center group hover-lift">
                <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-200">200+</div>
                <div className="text-neutral-600 font-medium">Փորձառու Մենթորներ</div>
              </div>
              <div className="text-center group hover-lift">
                <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-200">10K+</div>
                <div className="text-neutral-600 font-medium">Հաջողակ Ուսանողներ</div>
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

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-responsive-3xl font-bold text-neutral-900 mb-4">
              {t('home.successStories.title')}
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              {t('home.successStories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardInteractive variant="elevated" className="group">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">А</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{t('home.successStories.stories.alexey.name')}</h4>
                    <p className="text-sm text-neutral-600">{t('home.successStories.stories.alexey.position')}</p>
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
                  {t('home.successStories.stories.alexey.story')}
                </p>
                <div className="flex items-center text-sm text-neutral-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{t('home.successStories.stories.alexey.duration')}</span>
                </div>
              </CardContent>
            </CardInteractive>

            <CardInteractive variant="elevated" className="group">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">М</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{t('home.successStories.stories.maria.name')}</h4>
                    <p className="text-sm text-neutral-600">{t('home.successStories.stories.maria.position')}</p>
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
                  {t('home.successStories.stories.maria.story')}
                </p>
                <div className="flex items-center text-sm text-neutral-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{t('home.successStories.stories.maria.duration')}</span>
                </div>
              </CardContent>
            </CardInteractive>

            <CardInteractive variant="elevated" className="group">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Д</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{t('home.successStories.stories.dmitry.name')}</h4>
                    <p className="text-sm text-neutral-600">{t('home.successStories.stories.dmitry.position')}</p>
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
                  {t('home.successStories.stories.dmitry.story')}
                </p>
                <div className="flex items-center text-sm text-neutral-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{t('home.successStories.stories.dmitry.duration')}</span>
                </div>
              </CardContent>
            </CardInteractive>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-responsive-3xl font-bold text-white mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button 
                variant="glass" 
                size="xl" 
                className="group"
                leftIcon={<Rocket className="h-5 w-5" />}
                rightIcon={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              >
                {t('home.cta.startLearning')}
              </Button>
            </Link>
            <Link href="/projects">
              <Button 
                variant="outline" 
                size="xl" 
                className="border-white/30 text-white hover:bg-white/10"
                leftIcon={<Play className="h-5 w-5" />}
              >
                {t('home.cta.exploreProjects')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
