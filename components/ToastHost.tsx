'use client'

import { useEffect, useState } from 'react'

type Toast = { id: number; message: string; type: 'success' | 'error' }

export default function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handler = (e: any) => {
      const detail = e?.detail || {}
      const id = Date.now() + Math.random()
      const toast: Toast = { id, message: String(detail.message || ''), type: (detail.type === 'error' ? 'error' : 'success') }
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3000)
    }
    window.addEventListener('sb-toast', handler as EventListener)
    return () => window.removeEventListener('sb-toast', handler as EventListener)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[1000] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className={`px-4 py-3 rounded-lg shadow-lg text-white ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}


