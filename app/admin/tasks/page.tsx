'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function AdminTasksPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [projects, setProjects] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budgetMin, setBudgetMin] = useState<number>(0)
  const [budgetMax, setBudgetMax] = useState<number>(0)
  const [durationWeeks, setDurationWeeks] = useState<number>(1)
  const [difficultyLevel, setDifficultyLevel] = useState<string>('Beginner')
  const [requiredSkills, setRequiredSkills] = useState<string>('')

  const adminEmail = typeof window !== 'undefined' ? (localStorage.getItem('userEmail') || '') : ''

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/projects')
      const data = await r.json()
      setProjects(Array.isArray(data) ? data : data.projects || [])
    } catch (e: any) { setError(e?.message || 'Սխալ') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const addProject = async () => {
    if (!title || !description) return
    try {
      const r = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          projectType: 'Marketplace', 
          requiredSkills: requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : [], 
          budgetMin, 
          budgetMax, 
          durationWeeks, 
          difficultyLevel,
          clientId: (localStorage.getItem('clientId') || localStorage.getItem('userId') || '00000000-0000-0000-0000-000000000000')
        })
      })
      if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
      setTitle(''); setDescription(''); setRequiredSkills(''); setBudgetMin(0); setBudgetMax(0); setDurationWeeks(1); setDifficultyLevel('Beginner')
      load()
    } catch (e: any) { setError(e?.message || 'Սխալ') }
  }

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteProject = async (id: string) => {
    setDeleteId(id)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Ադմին • Բորսա (Առաջադրանքներ)</h1>
      {error && <div className="text-red-600">{error}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Ավելացնել նախագիծ/առաջադրանք</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Վերնագիր" value={title} onChange={e => setTitle(e.target.value)} />
          <Input placeholder="Նկարագրություն" value={description} onChange={e => setDescription(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input type="number" placeholder="Ֆինանսներ (մին)" value={budgetMin} onChange={e => setBudgetMin(Number(e.target.value))} />
            <Input type="number" placeholder="Ֆինանսներ (մաքս)" value={budgetMax} onChange={e => setBudgetMax(Number(e.target.value))} />
            <Input type="number" placeholder="Տևողություն (շաբաթ)" value={durationWeeks} onChange={e => setDurationWeeks(Number(e.target.value))} />
            <Input placeholder="Բարդություն (Beginner/Intermediate/Advanced)" value={difficultyLevel} onChange={e => setDifficultyLevel(e.target.value)} />
            <Input placeholder="Պահանջվող հմտություններ՝ comma separated" value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} />
          </div>
          <Button onClick={addProject}>Ավելացնել</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Բոլոր առաջադրանքները</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? 'Բեռնվում է...' : (
            <div className="space-y-2">
              {projects.map((p) => (
                <div key={p.id} className="flex items-start justify-between border rounded p-3">
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-neutral-600">{p.description}</div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => deleteProject(p.id)}>Ջնջել</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="font-semibold text-red-600">Ջնջել առաջադրանքը</div>
              <button onClick={() => setDeleteId(null)} className="p-2 rounded hover:bg-neutral-100"><X className="h-5 w-5"/></button>
            </div>
            <div className="p-4 text-sm text-neutral-700">Վստահ եք, որ ցանկանում եք ջնջել այս առաջադրանքը? Կապված հայտերը նույնպես կջնջվեն։</div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Չեղարկել</Button>
              <Button variant="destructive" onClick={async () => {
                try {
                  const r = await fetch(`/api/projects/${deleteId}`, { method: 'DELETE' })
                  if (!r.ok) throw new Error((await r.json()).error || 'Սխալ')
                  setDeleteId(null)
                  load()
                } catch (e: any) { setError(e?.message || 'Սխալ') }
              }}>Ջնջել</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
