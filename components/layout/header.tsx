'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, User, LogOut, Settings, BookOpen, Users, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navigation = [
    { name: 'Главная', href: '/', current: pathname === '/' },
    { name: 'Менторы', href: '/mentors', current: pathname === '/mentors' },
    { name: 'Проекты', href: '/projects', current: pathname === '/projects' },
    { name: 'Истории успеха', href: '/success-stories', current: pathname === '/success-stories' },
    { name: 'Цены', href: '/pricing', current: pathname === '/pricing' },
  ]

  const userMenuItems = [
    { name: 'Профиль', href: '/dashboard', icon: User },
    { name: 'Настройки', href: '/settings', icon: Settings },
    { name: 'Мои проекты', href: '/dashboard/projects', icon: Briefcase },
    { name: 'Менторы', href: '/dashboard/mentors', icon: Users },
    { name: 'Обучение', href: '/dashboard/learning', icon: BookOpen },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Close user menu when mobile menu opens
    if (isUserMenuOpen) setIsUserMenuOpen(false)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
    // Close mobile menu when user menu opens
    if (isMenuOpen) setIsMenuOpen(false)
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-menu]')) {
        setIsMenuOpen(false)
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    closeMenu()
  }, [pathname])

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl font-bold text-neutral-900 hover:text-primary-600 transition-colors"
              aria-label="SkillBridge - Главная страница"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="hidden sm:block">SkillBridge</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Основная навигация">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse" />
            ) : user ? (
              <div className="relative" data-menu="user">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleUserMenu}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  aria-label="Открыть меню пользователя"
                  className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                >
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user.email}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-neutral-200">
                      <p className="text-sm font-medium text-neutral-900">{user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      {userMenuItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Icon className="w-4 h-4 mr-3 text-neutral-400" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                    
                    <div className="border-t border-neutral-200 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 hover:text-error-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Войти
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Регистрация
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Открыть мобильное меню"
              className="md:hidden p-2"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200" data-menu="mobile">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  item.current
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                onClick={closeMenu}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile user menu items */}
            {user && (
              <>
                <div className="border-t border-neutral-200 pt-2 mt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Аккаунт
                  </div>
                  {userMenuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-3 py-2 text-base text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 transition-colors"
                        onClick={closeMenu}
                      >
                        <Icon className="w-4 h-4 mr-3 text-neutral-400" />
                        {item.name}
                      </Link>
                    )
                  })}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-3 py-2 text-base text-error-600 hover:bg-error-50 hover:text-error-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Выйти
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
