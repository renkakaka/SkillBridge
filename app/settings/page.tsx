'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Save, Shield, Bell, User as UserIcon, X } from 'lucide-react'

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    const e = localStorage.getItem('userEmail') || ''
    const n = localStorage.getItem('userFullName') || ''
    setEmail(e); setFullName(n)
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/users/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName }) })
      if (res.ok) localStorage.setItem('userFullName', fullName)
    } finally { setSaving(false) }
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const deleteAccount = async () => {
    setDeleting(true)
    try {
      const resMe = await fetch('/api/users/me')
      if (!resMe.ok) return
      const me = await resMe.json()
      await fetch(`/api/admin/users/${me.id}`, { method: 'DELETE' })
      localStorage.clear()
      window.location.href = '/'
    } catch {
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-neutral-900">Կարգավորումներ</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserIcon className="h-5 w-5"/> Անձնական տվյալներ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Անուն Ազգանուն</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Անուն Ազգանուն" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>
            <Button onClick={saveProfile} disabled={saving} className="flex items-center gap-2"><Save className="h-4 w-4"/>{saving ? 'Պահպանվում է...' : 'Պահպանել'}</Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5"/> Անվտանգություն</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-600">Փոխեք գաղտնաբառը էջում «Change password» (в разработке).</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5"/> Ծանուցումներ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked onChange={async (e) => {
                    const res = await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateSettings', userId: email, settings: { email: e.target.checked } }) })
                  }} /> Email
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked onChange={async (e) => {
                    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateSettings', userId: email, settings: { push: e.target.checked } }) })
                  }} /> Push
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" onChange={async (e) => {
                    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateSettings', userId: email, settings: { sms: e.target.checked } }) })
                  }} /> SMS
                </label>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600"><Trash2 className="h-5 w-5"/> Ջնջել հաշիվը</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 mb-3">Հաշիվը և տվյալները կջնջվեն անշրջելիորեն.</p>
              <Button variant="destructive" onClick={() => setShowDeleteModal(true)} className="bg-red-600 hover:bg-red-700">Ջնջել հաշիվը</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-red-600">Ջնջել հաշիվը</h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-2 rounded hover:bg-neutral-100"><X className="h-5 w-5"/></button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-neutral-700">
                Դուք պատրաստվո՞ւմ եք ջնջել ձեր հաշիվը և բոլոր հետ կապված տվյալները։ Այս գործողությունը անշրջելի է:
              </p>
              <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-md text-sm">
                Համոզվեք, որ հանել եք հասանելի մնացորդը և ներբեռնել եք անհրաժեշտ հաշվետվությունները մինչև ջնջելը。
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Չեղարկել</Button>
              <Button variant="destructive" onClick={deleteAccount} disabled={deleting} className="bg-red-600 hover:bg-red-700">
                {deleting ? 'Ջնջվում է...' : 'Ապահովորեն ջնջել'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
