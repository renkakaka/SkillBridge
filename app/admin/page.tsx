'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Mail, Users, Settings, BarChart3, Target } from 'lucide-react'

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
    fetch('/api/users')
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
        return r.json()
      })
      .then((data) => setUsers(data.users))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const adminEmailHeader = ''

  async function toggleVerify(userId: string, current: boolean) {
    setActionMessage('')
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        headers: {}
      })
      if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
      setActionMessage('Հաստատման նամակը կրկին ուղարկվեց')
    } catch (e: any) { setError(e.message) }
  }

  const [pwdModal, setPwdModal] = useState<{ open: boolean; userId: string; value: string }>({ open: false, userId: '', value: '' })
  async function resetPassword(userId: string) {
    setPwdModal({ open: true, userId, value: '' })
  }

  const [delModal, setDelModal] = useState<{ open: boolean; userId: string }>({ open: false, userId: '' })
  async function deleteUser(userId: string) {
    setDelModal({ open: true, userId })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Ադմին • Օգտատերերի հաստատում (Ուսուցիչներ)</h1>
      
      {/* Навигационное меню */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/admin">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Օգտատերեր</h3>
                  <p className="text-sm text-neutral-600">Կառավարել օգտատերերին</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/newsletter">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Բաժանորդագրություններ</h3>
                  <p className="text-sm text-neutral-600">Նորությունների բաժանորդներ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/stats">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Վիճակագրություն</h3>
                  <p className="text-sm text-neutral-600">Համակարգի վիճակագրություն</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Settings className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Կարգավորումներ</h3>
                  <p className="text-sm text-neutral-600">Համակարգի կարգավորումներ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      
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

      {pwdModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b font-semibold">Փոխել գաղտնաբառը</div>
            <div className="p-4 space-y-3">
              <input value={pwdModal.value} onChange={e => setPwdModal(m => ({ ...m, value: e.target.value }))} type="password" className="w-full rounded border p-2" placeholder="Նոր գաղտնաբառ" />
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPwdModal({ open: false, userId: '', value: '' })}>Չեղարկել</Button>
              <Button onClick={async () => {
                setActionMessage('')
                try {
                  const r = await fetch(`/api/admin/users/${pwdModal.userId}/reset-password`, {
                    method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newPassword: pwdModal.value })
                  })
                  if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
                  setPwdModal({ open: false, userId: '', value: '' })
                  setActionMessage('Գաղտնաբառը փոխվեց')
                } catch (e: any) { setError(e.message) }
              }}>Պահպանել</Button>
            </div>
          </div>
        </div>
      )}

      {delModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b font-semibold text-red-600">Ջնջել օգտատիրոջը</div>
            <div className="p-4 text-sm text-neutral-700">Վստահ եք, որ ցանկանում եք ջնջել օգտատիրոջը և բոլոր տվյալները?</div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDelModal({ open: false, userId: '' })}>Չեղարկել</Button>
              <Button variant="destructive" onClick={async () => {
                setActionMessage('')
                try {
                  const r = await fetch(`/api/admin/users/${delModal.userId}`, { method: 'DELETE' })
                  if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
                  setUsers(prev => prev.filter(u => u.id !== delModal.userId))
                  setDelModal({ open: false, userId: '' })
                  setActionMessage('Օգտատերը ջնջվեց')
                } catch (e: any) { setError(e.message) }
              }}>Ջնջել</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
