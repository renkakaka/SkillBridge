'use client'

import { useEffect, useState } from 'react'

type UserRow = {
  id: string
  email: string
  fullName: string
  userType: string
  emailVerified: boolean
  createdAt: string
  experienceLevel: string | null
  skills: string[]
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<UserRow[]>([])
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    const adminEmail = localStorage.getItem('userEmail') || ''
    fetch('/api/users', { headers: { 'x-admin-email': adminEmail } })
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
        return r.json()
      })
      .then((data) => setUsers(data.users))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const adminEmailHeader = typeof window !== 'undefined' ? (localStorage.getItem('userEmail') || '') : ''

  async function toggleVerify(userId: string, current: boolean) {
    setActionMessage('')
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-email': adminEmailHeader },
        body: JSON.stringify({ emailVerified: !current })
      })
      if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
      const updated = await r.json()
      setUsers((prev) => prev.map(u => u.id === userId ? { ...u, emailVerified: updated.emailVerified } : u))
      setActionMessage('Թարմացվեց')
    } catch (e: any) { setError(e.message) }
  }

  async function resendVerification(userId: string) {
    setActionMessage('')
    try {
      const r = await fetch(`/api/admin/users/${userId}/resend-verification`, {
        method: 'POST',
        headers: { 'x-admin-email': adminEmailHeader }
      })
      if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
      setActionMessage('Հաստատման նամակը կրկին ուղարկվեց')
    } catch (e: any) { setError(e.message) }
  }

  async function resetPassword(userId: string) {
    const newPassword = prompt('Մուտքագրեք նոր գաղտնաբառ')
    if (!newPassword) return
    setActionMessage('')
    try {
      const r = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-email': adminEmailHeader },
        body: JSON.stringify({ newPassword })
      })
      if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
      setActionMessage('Գաղտնաբառը փոխվեց')
    } catch (e: any) { setError(e.message) }
  }

  async function deleteUser(userId: string) {
    if (!confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել օգտատիրոջը')) return
    setActionMessage('')
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'x-admin-email': adminEmailHeader }
      })
      if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
      setUsers((prev) => prev.filter(u => u.id !== userId))
      setActionMessage('Օգտատերը ջնջվեց')
    } catch (e: any) { setError(e.message) }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Ադմին • Օգտատերերի հաստատում (Ուսուցիչներ)</h1>
      {loading && <div>Բեռնվում է...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {actionMessage && <div className="text-green-600">{actionMessage}</div>}
      {!loading && !error && (
        <div className="overflow-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left p-3">Անուն</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Տեսակ</th>
                <th className="text-left p-3">Հաստատված</th>
                <th className="text-left p-3">Ստեղծվել է</th>
                <th className="text-left p-3">Հմտություններ</th>
                <th className="text-left p-3">Գործողություններ</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.userType}</td>
                  <td className="p-3">{u.emailVerified ? 'Այո' : 'Ոչ'}</td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleString('hy-AM')}</td>
                  <td className="p-3">{u.skills.join(', ') || '—'}</td>
                  <td className="p-3 space-x-2">
                    <button className="underline text-blue-600" onClick={() => toggleVerify(u.id, u.emailVerified)}>
                      {u.emailVerified ? 'Ապահովել որպես չհաստատված' : 'Հաստատել ուսուցիչ'}
                    </button>
                    <button className="underline text-purple-600" onClick={() => resendVerification(u.id)}>Կրկին ուղարկել հաստատում</button>
                    <button className="underline text-amber-600" onClick={() => resetPassword(u.id)}>Փոխել գաղտնաբառը</button>
                    <button className="underline text-red-600" onClick={() => deleteUser(u.id)}>Ջնջել</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
