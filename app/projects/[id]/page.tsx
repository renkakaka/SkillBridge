import prisma from '@/lib/prisma'
type PageProps<TParams> = { params: Promise<TParams> }
import Link from 'next/link'
import { Star } from 'lucide-react'

async function getProject(id: string) {
  try {
    return await prisma.project.findUnique({ 
      where: { id }, 
      include: { client: true } 
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export default async function ProjectDetail({ params }: PageProps<{ id: string }>) {
  const { id } = await params
  const project = await getProject(id)
  
  if (!project) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/projects" 
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  const requiredSkills = project.requiredSkills ? JSON.parse(project.requiredSkills) : []

  // Кастомный клиентский блок для запрета отклика без верификации
  const VerifyBanner = () => (
    <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
      Խնդրում ենք հաստատել ձեր email հասցեն՝ հայտ ուղարկելու համար
    </div>
  )

  return (
    <div className="container py-10 space-y-6">
      <nav className="text-sm text-gray-500">
        <Link href="/projects" className="hover:text-primary-600">Projects</Link> / <span>{project.title}</span>
      </nav>
      
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <span className="text-xs px-2 py-1 rounded bg-gray-100">{project.projectType}</span>
      </div>
      
      <div className="text-gray-600">{project.description}</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="font-semibold">Requirements</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {requiredSkills.length > 0 ? (
                requiredSkills.map((skill: string, index: number) => (
                  <span key={index} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No specific skills required</span>
              )}
            </div>
          </section>
          
          <section className="space-y-2">
            <div><span className="text-gray-500">Budget:</span> ${project.budgetMin} - ${project.budgetMax}</div>
            <div><span className="text-gray-500">Duration:</span> {project.durationWeeks} weeks</div>
            <div><span className="text-gray-500">Difficulty:</span> {project.difficultyLevel}</div>
          </section>
          
          <section>
            <h2 className="font-semibold">Apply</h2>
            <ClientOnlyApply />
          </section>
        </div>
        
        <aside className="space-y-4">
          <h3 className="font-semibold">Client</h3>
          <div className="rounded border p-4">
            <div className="font-medium">{project.client.fullName}</div>
            <div className="text-sm text-gray-600">{project.client.email}</div>
          </div>
          
          <div className="rounded border p-4">
            <div className="font-semibold mb-2">Recommended Mentors</div>
            <div className="flex items-center gap-2 text-sm">
              <div className="size-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"/>
              <div>Senior Fullstack</div>
              <div className="ml-auto text-amber-500 flex items-center gap-1">
                <Star className="size-4"/>4.9
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <div className="size-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"/>
              <div>UX Lead</div>
              <div className="ml-auto text-amber-500 flex items-center gap-1">
                <Star className="size-4"/>4.8
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

// Client component inside the server file (Next.js supports it via separate function)
'use client'
function ClientOnlyApply() {
  const isVerified = typeof window !== 'undefined' && localStorage.getItem('emailVerified') === 'true'
  if (!isVerified) {
    return (
      <div className="space-y-3">
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
          Խնդրում ենք հաստատել ձեր email հասցեն՝ հայտ ուղարկելու համար
        </div>
        <Link href={`/auth/verify-email?email=${encodeURIComponent(localStorage.getItem('userEmail') || '')}`} className="inline-block rounded bg-primary-600 text-white px-4 py-2">
          Գնալ հաստատման էջ
        </Link>
      </div>
    )
  }

  return <ClientApplyForm />
}

function ClientApplyForm() {
  const submit = async (e: any) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const coverLetter = String(form.get('coverLetter') || '')
    const proposedTimeline = String(form.get('proposedTimeline') || '1')
    const userEmail = localStorage.getItem('userEmail') || ''
    const projectId = window.location.pathname.split('/').pop() || ''
    const r = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, coverLetter, proposedTimeline, userEmail })
    })
    if (r.ok) alert('Դիմումը ուղարկված է ադմինին')
    else alert('Սխալ դիմում ուղարկելիս')
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
