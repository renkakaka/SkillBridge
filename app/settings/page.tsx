'use client'

import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  useEffect(() => {
    const e = localStorage.getItem('userEmail') || ''
    setEmail(e)
  }, [])

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold">Պարամետրեր</h1>
      <div className="rounded border p-4">
        <div className="text-gray-600">Email</div>
        <div>{email || '—'}</div>
      </div>
    </div>
  )
}
