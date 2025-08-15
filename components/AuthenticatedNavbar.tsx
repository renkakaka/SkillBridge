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
  const [unreadNotifCount, setUnreadNotifCount] = useState(0)
  const [unreadMsgCount, setUnreadMsgCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        // Попытка получить пользователя из сессии (cookie)
        const res = await fetch('/api/users/me')
        if (res.ok) {
          const me = await res.json()
          setUser({ email: me.email, fullName: me.fullName, userType: me.userType })
          setNeedsEmailVerify(!Boolean(me.emailVerified))
          return
        }
      } catch {}
      // Фоллбэк на localStorage (устар.)
      const userEmail = localStorage.getItem('userEmail')
      const userFullName = localStorage.getItem('userFullName')
      const userType = localStorage.getItem('userType')
      const verified = localStorage.getItem('emailVerified')
      if (userEmail && userFullName && userType) {
        setUser({ email: userEmail, fullName: userFullName, userType })
        setNeedsEmailVerify(verified !== 'true')
      }
    }
    load()
  }, [])

  const fetchCounts = async () => {
    try {
      const meRes = await fetch('/api/users/me')
      if (!meRes.ok) return
      const me = await meRes.json()
      const userId = me.id
      const notifRes = await fetch(`/api/notifications?countOnly=true`)
      if (notifRes.ok) {
        const notifData = await notifRes.json()
        setUnreadNotifCount(notifData?.stats?.unread || 0)
      }
      const convRes = await fetch(`/api/messages`)
      if (convRes.ok) {
        const convData = await convRes.json()
        const totalUnread = Array.isArray(convData.conversations)
          ? convData.conversations.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0)
          : 0
        setUnreadMsgCount(totalUnread)
      }
    } catch {}
  }

  useEffect(() => {
    const refresh = () => { fetchCounts() }
    const onAuth = async () => {
      try {
        const res = await fetch('/api/users/me')
        if (res.ok) {
          const me = await res.json()
          setUser({ email: me.email, fullName: me.fullName, userType: me.userType })
          setNeedsEmailVerify(!Boolean(me.emailVerified))
          fetchCounts()
        }
      } catch {}
    }
    window.addEventListener('sb-refresh-counts', refresh)
    window.addEventListener('sb-auth-changed', onAuth)
    return () => {
      window.removeEventListener('sb-refresh-counts', refresh)
      window.removeEventListener('sb-auth-changed', onAuth)
    }
  }, [])

  useEffect(() => {
    const loadCounts = async () => {
      try {
        await fetchCounts()
      } catch {}
    }
    loadCounts()
  }, [pathname])

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'qaramyanv210@gmail.com'
  const isAdmin = !!(user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())

  const handleSignOut = async () => {
    try { await fetch('/api/auth/signout', { method: 'POST' }) } catch {}
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userFullName')
    localStorage.removeItem('userType')
    localStorage.removeItem('emailVerified')
    window.location.href = '/'
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const getNavItems = () => {
    if (!user) return []
    if (isAdmin) {
      return [
        { href: '/admin', label: t('navigation.admin'), icon: BarChart3 },
        { href: '/admin/users', label: t('navigation.adminUsers'), icon: Users },
        { href: '/admin/tasks', label: t('navigation.adminTasks'), icon: Briefcase },
        { href: '/admin/stats', label: t('navigation.adminStats'), icon: BarChart3 },
        { href: '/messages', label: t('navigation.messages'), icon: MessageSquare },
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
      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-9 w-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">SkillBridge</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-3 xl:gap-4 flex-1 justify-center flex-wrap">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-2 xl:px-2.5 py-1 rounded-md text-sm font-medium transition-all duration-200 hover:text-primary-600 relative group ${
                    isActive(item.href) ? 'text-primary-600' : 'text-neutral-600'
                  }`}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="flex items-center gap-1 text-sm">
                    {item.label}
                    {item.href === '/messages' && unreadMsgCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-none">{unreadMsgCount}</span>
                    )}
                    {item.href === '/notifications' && unreadNotifCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-none">{unreadNotifCount}</span>
                    )}
                  </span>
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-200 group-hover:w-full ${isActive(item.href) ? 'w-full' : ''}`}></span>
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
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
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
