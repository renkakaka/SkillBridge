'use client'

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import AuthenticatedNavbar from './AuthenticatedNavbar'

export default function ClientNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Проверяем аутентификацию через localStorage
    const userEmail = localStorage.getItem('userEmail')
    const userFullName = localStorage.getItem('userFullName')
    const userType = localStorage.getItem('userType')
    
    if (userEmail && userFullName && userType) {
      setIsAuthenticated(true)
    }
    
    setIsLoading(false)
  }, [])

  // Показываем загрузку пока проверяем аутентификацию
  if (!mounted || isLoading) {
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

  // Показываем соответствующую навигацию
  return isAuthenticated ? <AuthenticatedNavbar /> : <Navbar />
}
