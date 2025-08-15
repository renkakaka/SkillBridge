'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import AuthenticatedNavbar from './AuthenticatedNavbar'

export default function ClientNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Устанавливаем mounted сразу
    setMounted(true)
    
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        
        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          // Проверяем localStorage как fallback
          const userEmail = localStorage.getItem('userEmail')
          const userFullName = localStorage.getItem('userFullName')
          const userType = localStorage.getItem('userType')
          setIsAuthenticated(!!(userEmail && userFullName && userType))
        }
      } catch (error) {
        // В случае ошибки используем localStorage
        const userEmail = localStorage.getItem('userEmail')
        const userFullName = localStorage.getItem('userFullName')
        const userType = localStorage.getItem('userType')
        setIsAuthenticated(!!(userEmail && userFullName && userType))
      } finally {
        setIsLoading(false)
      }
    }

    // Запускаем проверку сразу
    checkAuth()

    // Добавляем слушатель для изменений аутентификации
    const handleAuthChange = () => {
      checkAuth()
    }

    // Слушаем события изменения аутентификации
    window.addEventListener('sb-auth-changed', handleAuthChange)
    window.addEventListener('focus', handleAuthChange)
    
    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      checkAuth()
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('sb-auth-changed', handleAuthChange)
      window.removeEventListener('focus', handleAuthChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Перепроверяем аутентификацию при смене маршрута
  useEffect(() => {
    if (mounted && !isLoading) {
      const recheck = async () => {
        try {
          const res = await fetch('/api/users/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          })
          
          if (res.ok) {
            setIsAuthenticated(true)
          } else {
            const userEmail = localStorage.getItem('userEmail')
            const userFullName = localStorage.getItem('userFullName')
            const userType = localStorage.getItem('userType')
            setIsAuthenticated(!!(userEmail && userFullName && userType))
          }
        } catch (error) {
          const userEmail = localStorage.getItem('userEmail')
          const userFullName = localStorage.getItem('userFullName')
          const userType = localStorage.getItem('userType')
          setIsAuthenticated(!!(userEmail && userFullName && userType))
        }
      }
      recheck()
    }
  }, [pathname, mounted, isLoading])

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

  // Показываем соответствующую навигацию
  return (
    <div className="w-full">
      {isAuthenticated ? <AuthenticatedNavbar /> : <Navbar />}
    </div>
  )
}
