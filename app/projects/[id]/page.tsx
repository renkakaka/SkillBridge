import prisma from '@/lib/prisma'
type PageProps<TParams> = { params: Promise<TParams> }
import Link from 'next/link'
import { Star } from 'lucide-react'
import ClientOnlyApply from './ClientOnlyApply'

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
        <Link href="/projects" className="hover:text-primary-600">Նախագծեր</Link> / <span>{project.title}</span>
      </nav>
      
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <span className="text-xs px-2 py-1 rounded bg-gray-100">{project.projectType}</span>
      </div>
      
      <div className="text-gray-600">{project.description}</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="font-semibold">Պահանջներ</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {requiredSkills.length > 0 ? (
                requiredSkills.map((skill: string, index: number) => (
                  <span key={index} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">Հատուկ հմտություններ անհրաժեշտ չեն</span>
              )}
            </div>
          </section>
          
          <section className="space-y-2">
            <div><span className="text-gray-500">Բյուջե:</span> ${project.budgetMin} - ${project.budgetMax}</div>
            <div><span className="text-gray-500">Տևողություն:</span> {project.durationWeeks} շաբաթ</div>
            <div><span className="text-gray-500">Բարդություն:</span> {project.difficultyLevel}</div>
          </section>
          
          <section>
            <h2 className="font-semibold">Դիմել</h2>
            <ClientOnlyApply />
          </section>
        </div>
        
        <aside className="space-y-4">
          <h3 className="font-semibold">Հաճախորդ</h3>
          <div className="rounded border p-4">
            <div className="font-medium">{project.client.fullName}</div>
            <div className="text-sm text-gray-600">{project.client.email}</div>
          </div>
          
          <div className="rounded border p-4">
            <div className="font-semibold mb-2">Առաջարկվող մենթորներ</div>
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
