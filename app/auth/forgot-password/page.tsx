'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setMessage('Եթե email-ը գոյություն ունի, մենք ուղարկել ենք հղում գաղտնաբառի վերականգնման համար')
    } catch (e: any) {
      setError(e.message || 'Սխալ')
    } finally {
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
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Վերականգնել գաղտնաբառը</h1>
          <p className="text-neutral-600">Մուտքագրեք ձեր email հասցեն՝ ստանալու համար հղում</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Reset password</CardTitle>
            <CardDescription className="text-center">Մենք կուղարկենք հղում ձեր email-ին</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
              {message && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">{message}</div>}

              <Button type="submit" variant="gradient" className="w-full" disabled={isLoading}>
                {isLoading ? 'Ուղարկվում է...' : 'Ուղարկել հղումը'}
              </Button>
            </form>

            <div className="text-center text-sm">
              <Link href="/auth/signin" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Վերադառնալ մուտք
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


