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
  const token = searchParams.get('token')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (!email) {
      router.push('/auth/signin')
      return
    }

    // If we have a token, verify it automatically
    if (token) {
      verifyToken()
    }
  }, [email, token, router])

  const verifyToken = async () => {
    if (!token) return

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setIsVerified(true)
        setMessage('Email verified successfully!')
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(data.error || 'Verification failed')
      }
    } catch (error) {
      setError('Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    if (!email) return

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, resend: true }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage('Verification email sent successfully!')
      } else {
        setError(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      setError('Failed to send verification email')
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Verified!</h2>
            <p className="text-neutral-600 mb-6">{message}</p>
            <div className="text-sm text-neutral-500">
              Redirecting to dashboard...
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
            Verify your email
          </h1>
          <p className="text-neutral-600">
            We've sent a verification link to {email}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              Check your email and click the verification link
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
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

              <div className="text-center text-sm text-neutral-600">
                <p>Didn't receive the email?</p>
                <p>Check your spam folder or request a new verification email.</p>
              </div>
            </div>

            <Button 
              onClick={resendVerification}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </Button>

            <div className="text-center text-sm">
              <Link 
                href="/auth/signin"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
