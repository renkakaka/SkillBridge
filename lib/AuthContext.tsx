'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, User, AuthState } from './useAuth'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: string }>
  signUp: (userData: {
    email: string
    password: string
    fullName: string
    userType: 'newcomer' | 'mentor' | 'client'
  }) => Promise<{ success: boolean; data?: any; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<{ success: boolean; data?: any; error?: string }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; data?: any; error?: string }>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
