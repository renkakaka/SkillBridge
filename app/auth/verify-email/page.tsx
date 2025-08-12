'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (!email) {
      router.push('/auth/signin')
      return
    }

    // Автоматически запрашиваем код при загрузке страницы
    requestVerificationCode()
  }, [email, router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const requestVerificationCode = async () => {
    setIsLoading(true)
    setError('')
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (response.ok) {
        if (data.success) {
          setMessage('Հաստատման նամակը ուղարկվել է ձեր email հասցեին')
          setCountdown(60) // 60 секунд до следующего запроса
        } else if (data.code) {
          setMessage(`Հաստատման կոդը՝ ${data.code}`)
          if (data.note) {
            setError(data.note)
          }
        }
      } else {
        setError(data.error || 'Սխալ է տեղի ունեցել')
      }
    } catch (error) {
      setError('Սխալ է տեղի ունեցել')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Մուտքագրեք 6-նիշ կոդը')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setIsVerified(true)
        setMessage('Email հաջողությամբ հաստատվել է!')
        
        // Обновляем localStorage
        localStorage.setItem('emailVerified', 'true')
        
        // Перенаправляем на дашборд через 2 секунды
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(data.error || 'Սխալ է տեղի ունեցել')
      }
    } catch (error) {
      setError('Սխալ է տեղի ունեցել')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setVerificationCode(value)
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Հաստատված է!</h2>
            <p className="text-neutral-600 mb-6">{message}</p>
            <div className="text-sm text-neutral-500">
              Ձեզ կուղղորդեն դաշնագիր...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
            SB
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Հաստատեք ձեր email-ը
          </h1>
          <p className="text-neutral-600">
            Մուտքագրեք 6-նիշ կոդը, որը ուղարկվել է {email}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Հաստատման կոդ</CardTitle>
            <CardDescription className="text-center">
              Մուտքագրեք կոդը ձեր email-ից
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  className="pl-10 text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              {message && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                  {message}
                </div>
              )}
            </div>

            <Button 
              onClick={verifyCode}
              className="w-full"
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? 'Հաստատվում է...' : 'Հաստատել'}
            </Button>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={requestVerificationCode}
                disabled={isLoading || countdown > 0}
                className="text-sm"
              >
                {countdown > 0 
                  ? `Նորից ուղարկել (${countdown}s)` 
                  : 'Նորից ուղարկել կոդը'
                }
              </Button>
            </div>

            <div className="text-center text-sm">
              <Link 
                href="/auth/signin"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Վերադառնալ մուտքի էջ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
