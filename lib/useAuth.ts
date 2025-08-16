'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string
  fullName: string
  userType: 'newcomer' | 'mentor' | 'client' | 'admin'
  avatarUrl?: string
  bio?: string
  experienceLevel?: string
  skills: string
  emailVerified: boolean
  lastSeen?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
  })
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      console.log('Checking auth...')
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await fetch('/api/users/me')
      console.log('Auth response:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Auth data:', data)
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        console.log('Auth failed, status:', response.status)
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        await checkAuth()
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Sign in failed:', error)
      return { success: false, error: 'Sign in failed' }
    }
  }, [checkAuth])

  const signUp = useCallback(async (userData: {
    email: string
    password: string
    fullName: string
    userType: 'newcomer' | 'mentor' | 'client'
  }) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Sign up failed:', error)
      return { success: false, error: 'Sign up failed' }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      router.push('/auth/signin')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }, [router])

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const data = await response.json()
        setAuthState(prev => ({
          ...prev,
          user: data.user,
        }))
        return { success: true, data }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.error }
      }
    } catch (error) {
      console.error('Profile update failed:', error)
      return { success: false, error: 'Profile update failed' }
    }
  }, [])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Password change failed:', error)
      return { success: false, error: 'Password change failed' }
    }
  }, [])

  useEffect(() => {
    console.log('useAuth useEffect triggered')
    // Проверяем аутентификацию только один раз при монтировании
    const initAuth = async () => {
      try {
        console.log('Initializing auth...')
        setAuthState(prev => ({ ...prev, isLoading: true }))
        
        const response = await fetch('/api/users/me')
        console.log('Initial auth response:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Initial auth data:', data)
          setAuthState({
            user: data.user,
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          console.log('Initial auth failed, status:', response.status)
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } catch (error) {
        console.error('Initial auth check failed:', error)
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }
    
    initAuth()
  }, [])

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    changePassword,
    checkAuth,
  }
}
