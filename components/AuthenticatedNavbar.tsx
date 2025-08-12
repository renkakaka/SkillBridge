'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Sparkles, User, LogOut, Briefcase, Users, BarChart3, Settings, Award, TrendingUp, MessageSquare, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslations } from '@/lib/useTranslations'

export default function AuthenticatedNavbar() {
  const { t } = useTranslations()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [needsEmailVerify, setNeedsEmailVerify] = useState(false)

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail')
    const userFullName = localStorage.getItem('userFullName')
    const userType = localStorage.getItem('userType')
    const verified = localStorage.getItem('emailVerified')
    
    if (userEmail && userFullName && userType) {
      setUser({ email: userEmail, fullName: userFullName, userType })
      setNeedsEmailVerify(verified !== 'true')
    }
  }, [])

  const NEXT_PUBLIC_ADMIN_EMAIL = 'qaramyanv210@gmail.com' // Хардкод админского email
  const isAdmin = !!(user?.email && user.email.toLowerCase() === NEXT_PUBLIC_ADMIN_EMAIL.toLowerCase())

  const handleSignOut = () => {
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userFullName')
    localStorage.removeItem('userType')
    localStorage.removeItem('emailVerified')
    window.location.href = '/'
  }

  const getNavItems = () => {
    if (!user) return []
    if (isAdmin) {
      return [
        { href: '/admin', label: t('navigation.admin'), icon: BarChart3 },
        { href: '/admin/users', label: t('navigation.adminUsers'), icon: Users },
        { href: '/admin/tasks', label: t('navigation.adminTasks'), icon: Briefcase },
        { href: '/admin/stats', label: t('navigation.adminStats'), icon: BarChart3 },
        { href: '/admin/settings', label: t('navigation.adminSettings'), icon: Settings },
      ]
    }
    
    // Навбар для фрилансеров (newcomer, mentor)
    if (user.userType === 'newcomer' || user.userType === 'mentor') {
      return [
        { href: '/dashboard', label: t('navigation.dashboard'), icon: BarChart3 },
        { href: '/marketplace', label: t('navigation.marketplace'), icon: Briefcase },
        { href: '/portfolio', label: t('navigation.portfolio'), icon: Briefcase },
        { href: '/achievements', label: t('navigation.achievements'), icon: Award },
        { href: '/earnings', label: t('navigation.earnings'), icon: TrendingUp },
        { href: '/messages', label: t('navigation.messages'), icon: MessageSquare },
        { href: '/notifications', label: t('navigation.notifications'), icon: Bell },
      ]
    }
    
    // Навбар для клиентов
    if (user.userType === 'client') {
      return [
        { href: '/dashboard', label: t('navigation.dashboard'), icon: BarChart3 },
        { href: '/projects', label: t('navigation.projects'), icon: Briefcase },
        { href: '/my-projects', label: t('navigation.myProjects'), icon: Briefcase },
        { href: '/mentors', label: t('navigation.mentors'), icon: Users },
        { href: '/messages', label: t('navigation.messages'), icon: MessageSquare },
        { href: '/notifications', label: t('navigation.notifications'), icon: Bell },
      ]
    }
    
    // Базовый навбар (fallback)
    return [
      { href: '/dashboard', label: t('navigation.dashboard'), icon: BarChart3 },
      { href: '/projects', label: t('navigation.projects'), icon: Briefcase },
      { href: '/mentors', label: t('navigation.mentors'), icon: Users },
    ]
  }

  const navItems = getNavItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-9 w-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">SkillBridge</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 text-sm md:text-base font-medium transition-all duration-200 hover:text-primary-600 relative group whitespace-nowrap ${
                    pathname.startsWith(item.href) 
                      ? 'text-primary-600' 
                      : 'text-neutral-600'
                  }`}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{item.label}</span>
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-200 group-hover:w-full ${
                    pathname === item.href || pathname.startsWith(item.href) ? 'w-full' : ''
                  }`}></span>
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <div className="relative">
              <Link href="/profile" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.fullName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-xs">
                  <div className="font-medium text-neutral-900 flex items-center gap-2">
                    {user?.fullName}
                    {isAdmin && <span className="text-xs text-neutral-500">{t('roles.admin')}</span>}
                    {needsEmailVerify && (
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500" title={t('auth.verifyEmail.required')} />
                    )}
                  </div>
                  <div className="text-xs text-neutral-500 capitalize">{isAdmin ? t('roles.admin') : user?.userType}</div>
                </div>
              </Link>
              {needsEmailVerify && (
                <Link href={`/auth/verify-email?email=${encodeURIComponent(user?.email || '')}`} className="absolute -right-2 -top-2">
                  <span className="sr-only">{t('auth.verifyEmail.goToVerification')}</span>
                </Link>
              )}
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleSignOut}
              className="text-neutral-700 hover:text-red-600 hover:border-red-300 px-4 py-2"
            >
              <LogOut className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              {t('navigation.logout')}
            </Button>
          </div>

          <button
            className="lg:hidden p-3 rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Բացել մենյու"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200/50 py-4 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      pathname.startsWith(item.href)
                        ? 'bg-gradient-primary text-white shadow-lg'
                        : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              <Link href={`/auth/verify-email?email=${encodeURIComponent(user?.email || '')}`} className="px-3 text-sm text-red-600">
                {needsEmailVerify ? t('auth.verifyEmail.required') : ''}
              </Link>

              <Button 
                variant="outline" 
                className="w-full text-neutral-700 hover:text-red-600 hover:border-red-300 py-3 text-base"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-2" />
                {t('navigation.logout')}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
