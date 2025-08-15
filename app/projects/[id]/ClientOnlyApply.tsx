'use client'

import Link from 'next/link'

export default function ClientOnlyApply() {
  const isVerified = typeof window !== 'undefined' && localStorage.getItem('emailVerified') === 'true'
  if (!isVerified) {
    return (
      <div className="space-y-3">
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
          Խնդրում ենք հաստատել ձեր email հասցեն՝ հայտ ուղարկելու համար
        </div>
        <Link href={`/auth/verify-email?email=${encodeURIComponent(typeof window !== 'undefined' ? (localStorage.getItem('userEmail') || '') : '')}`} className="inline-block rounded bg-primary-600 text-white px-4 py-2">
          Գնալ հաստատման էջ
        </Link>
      </div>
    )
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const coverLetter = String(form.get('coverLetter') || '')
    const proposedTimeline = String(form.get('proposedTimeline') || '1')
    const projectId = typeof window !== 'undefined' ? (window.location.pathname.split('/').pop() || '') : ''
    const r = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, coverLetter, proposedTimeline })
    })
    if (r.ok) {
      const event = new CustomEvent('sb-toast', { detail: { message: 'Դիմումը ուղարկված է ադմինին', type: 'success' } })
      window.dispatchEvent(event)
    } else {
      const event = new CustomEvent('sb-toast', { detail: { message: 'Սխալ դիմում ուղարկելիս', type: 'error' } })
      window.dispatchEvent(event)
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-3">
      <textarea name="coverLetter" className="w-full rounded border p-2" placeholder="Գրեք ուղեկից նամակ" required />
      <input name="proposedTimeline" className="w-full rounded border p-2" type="number" min="1" placeholder="Առաջարկվող ժամկետ (շաբաթ)" required />
      <button className="rounded bg-primary-600 text-white px-4 py-2 hover:bg-primary-700 transition-colors">
        Դիմել
      </button>
    </form>
  )
}



