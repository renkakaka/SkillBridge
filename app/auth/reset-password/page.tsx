'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || !email) {
      router.replace('/auth/forgot-password')
    }
  }, [token, email, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 8) {
      setError('Գաղտնաբառը պետք է լինի առնվազն 8 նիշ')
      return
    }
    if (password !== confirm) {
      setError('Գաղտնաբառերը չեն համընկնում')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setMessage('Գաղտնաբառը հաջողությամբ փոխվեց, կարող եք մուտք գործել')
      setTimeout(() => router.replace('/auth/signin'), 1500)
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
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Նոր գաղտնաբառ</h1>
          <p className="text-neutral-600">Մուտքագրեք նոր գաղտնաբառ</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Reset password</CardTitle>
            <CardDescription className="text-center">Ձեր email՝ {email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Նոր գաղտնաբառ</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input type="password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Կրկնել գաղտնաբառը</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input type="password" className="pl-10" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                </div>
              </div>
              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
              {message && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">{message}</div>}
              <Button type="submit" variant="gradient" className="w-full" disabled={isLoading}>
                {isLoading ? 'Պահպանվում է...' : 'Պահպանել'}
              </Button>
              <div className="text-center text-sm">
                <Link href="/auth/signin" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Մուտք
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


