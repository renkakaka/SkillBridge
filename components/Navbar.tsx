'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from '@/lib/useTranslations'

export default function Navbar() {
  const { t } = useTranslations()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/projects', label: t('navigation.projects') },
    { href: '/mentors', label: t('navigation.mentors') },
    { href: '/success-stories', label: t('navigation.successStories') },
    { href: '/pricing', label: t('navigation.pricing') },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-9 w-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Sparkles className="text-white h-5 w-5 group-hover:animate-pulse" />
            </div>
            <span className="font-bold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors duration-300">SkillBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm md:text-base font-medium transition-all duration-200 hover:text-primary-600 relative group whitespace-nowrap ${
                  pathname.startsWith(item.href) 
                    ? 'text-primary-600' 
                    : 'text-neutral-600'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-200 group-hover:w-full ${
                  pathname.startsWith(item.href) ? 'w-full' : ''
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" size="lg" className="text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 px-4 py-2 hover:scale-105 focus-ring">
                {t('navigation.signIn')}
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 px-5 py-2 focus-ring shadow-lg">
                {t('navigation.signUp')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-3 rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Բացել մենյու"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200/50 py-4 bg-white/95 backdrop-blur-md animate-slide-up">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                    pathname.startsWith(item.href)
                      ? 'bg-gradient-primary text-white shadow-lg'
                      : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-neutral-200/50 space-y-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" className="w-full justify-start text-neutral-700 hover:text-primary-600 hover:bg-primary-50 text-base py-3 transition-all duration-300 hover:scale-105">
                    {t('navigation.signIn')}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="w-full bg-gradient-primary hover:shadow-lg text-base py-3 transition-all duration-300 hover:scale-105">
                    {t('navigation.signUp')}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}


