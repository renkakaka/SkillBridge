'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react'
import { useTranslations } from '@/lib/useTranslations'

export default function SignInPage() {
  const { t } = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userFullName', data.user.fullName)
        localStorage.setItem('userType', data.user.userType)
        localStorage.setItem('emailVerified', String(Boolean(data.user.emailVerified)))
        setTimeout(() => {
          setIsLoading(false)
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        const errorData = await response.json()
        if (errorData.needsVerification) {
          setError('Խնդրում ենք հաստատել ձեր email հասցեն մուտք գործելու համար')
          setTimeout(() => {
            window.location.href = `/auth/verify-email?email=${encodeURIComponent(email)}`
          }, 2000)
        } else {
          setError(errorData.error || 'Սխալ է տեղի ունեցել')
        }
        setIsLoading(false)
      }
    } catch (error) {
      setError('Սխալ է տեղի ունեցել')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              SB
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {t('auth.signIn.title')}
          </h1>
          <p className="text-neutral-600">
            {t('auth.signIn.subtitle')}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">{t('auth.signIn.formTitle')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.signIn.formSubtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-neutral-700">
                  {t('auth.signIn.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.signIn.emailPlaceholder')}
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                  {t('auth.signIn.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="password"
                    type={'password'}
                    placeholder={t('auth.signIn.passwordPlaceholder')}
                    required
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
                  />
                  <span className="text-sm text-neutral-600">{t('auth.signIn.rememberMe')}</span>
                </label>
                <Link 
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('auth.signIn.forgotPassword')}
                </Link>
              </div>

              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>{t('auth.signIn.signingIn')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{t('auth.signIn.submit')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-neutral-500">{t('auth.signIn.orContinueWith')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" className="w-full">
                <Chrome className="h-4 w-4 mr-2" />
                Google
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-neutral-600">{t('auth.signIn.noAccount')} </span>
              <Link 
                href="/auth/signup"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('auth.signIn.signUp')}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-neutral-500">
            {t('auth.signIn.termsAgreement')}{' '}
            <Link href="/terms" className="text-neutral-600 hover:text-neutral-700">
              {t('auth.signIn.termsOfUse')}
            </Link>{' '}
            {t('common.and')}{' '}
            <Link href="/privacy" className="text-neutral-600 hover:text-neutral-700">
              {t('auth.signIn.privacyPolicy')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

