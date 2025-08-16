'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import AuthenticatedNavbar from './AuthenticatedNavbar'
import { useAuthContext } from '@/lib/AuthContext'

export default function ClientNavbar() {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  console.log('ClientNavbar render:', { isAuthenticated, authLoading, mounted })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Показываем загрузку только если компонент еще не смонтирован
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="h-9 w-9 bg-neutral-200 rounded-xl animate-pulse" />
            <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
            <div className="h-8 w-20 bg-neutral-200 rounded animate-pulse" />
          </div>
        </div>
      </header>
    )
  }

  // Если идет проверка аутентификации, показываем обычную навигацию
  if (authLoading) {
    return <Navbar />
  }

  // Показываем соответствующую навигацию
  return (
    <div className="w-full">
      {isAuthenticated ? <AuthenticatedNavbar /> : <Navbar />}
    </div>
  )
}
