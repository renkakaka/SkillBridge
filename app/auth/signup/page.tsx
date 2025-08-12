'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Chrome, Check } from 'lucide-react'
import { useTranslations } from '@/lib/useTranslations'

export default function SignUpPage() {
  const { t } = useTranslations()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'newcomer' as 'newcomer' | 'mentor' | 'client'
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    
    try {
      // Сохраняем данные пользователя в localStorage для демонстрации
      localStorage.setItem('userEmail', formData.email)
      localStorage.setItem('userFullName', formData.fullName)
      localStorage.setItem('userType', formData.userType)
      
      // Отправляем данные на API
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            userType: formData.userType,
            skills: [],
            experienceLevel: 'beginner'
          }),
        })

        if (response.ok) {
          const user = await response.json()
          console.log('User registered successfully:', user)
          
          // Показываем сообщение о необходимости подтверждения email
          setMessage('Գրանցումը հաջողությամբ ավարտվել է! Խնդրում ենք ստուգել ձեր email հասցեն և հաստատել հաշիվը:')
          
          // Перенаправляем на страницу подтверждения email
          setTimeout(() => {
            window.location.href = `/auth/verify-email?email=${encodeURIComponent(formData.email)}`
          }, 2000)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Registration failed')
        }
      } catch (apiError) {
        console.error('API registration failed:', apiError)
        setError('Գրանցումը ձախողվել է: Խնդրում ենք փորձել կրկին:')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              SB
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {t('auth.signUp.title')}
          </h1>
          <p className="text-neutral-600">
            {t('auth.signUp.subtitle')}
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">{t('auth.signUp.formTitle')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.signUp.formSubtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-neutral-700">
                  {t('auth.signUp.fullName')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t('auth.signUp.fullNamePlaceholder')}
                    required
                    className="pl-10"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-neutral-700">
                  {t('auth.signUp.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.signUp.emailPlaceholder')}
                    required
                    className="pl-10"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* User Type Field */}
              <div className="space-y-2">
                <label htmlFor="userType" className="text-sm font-medium text-neutral-700">
                  Օգտագործողի տեսակ
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
                >
                  <option value="newcomer">Նորեկ</option>
                  <option value="mentor">Մենթոր</option>
                  <option value="client">Հաճախորդ</option>
                </select>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                  {t('auth.signUp.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.signUp.passwordPlaceholder')}
                    required
                    className="pl-10"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="text-xs text-neutral-500">
                  {t('auth.signUp.passwordRequirements')}
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700">
                  {t('auth.signUp.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('auth.signUp.confirmPasswordPlaceholder')}
                    required
                    className="pl-10"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                  {message}
                </div>
              )}

              {/* Terms Agreement */}
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
                    required
                  />
                  <div className="text-sm text-neutral-600">
                    {t('auth.signUp.agreeToTerms')}{' '}
                    <Link 
                      href="/terms" 
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {t('auth.signUp.termsAndConditions')}
                    </Link>{' '}
                    {t('common.and')}{' '}
                    <Link 
                      href="/privacy" 
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {t('auth.signUp.privacyPolicy')}
                    </Link>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
                  />
                  <div className="text-sm text-neutral-600">
                    {t('auth.signUp.marketingConsent')}
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full"
                disabled={isLoading || !agreedToTerms}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>{t('auth.signUp.signingUp')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{t('auth.signUp.submit')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-neutral-500">{t('auth.signUp.orContinueWith')}</span>
              </div>
            </div>

            {/* Social Login */}
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

            {/* Sign In Link */}
            <div className="text-center text-sm">
              <span className="text-neutral-600">{t('auth.signUp.alreadyHaveAccount')} </span>
              <Link 
                href="/auth/signin"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('auth.signUp.signIn')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

