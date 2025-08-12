'use client'

import Link from 'next/link'

export type ProjectCardProps = {
  id: string
  title: string
  description: string
  projectType: 'bronze' | 'silver' | 'gold'
  budgetMin: number
  budgetMax: number
  durationWeeks: number
  applicantCount: number
  requiredSkills: string[]
}

const typeColor: Record<ProjectCardProps['projectType'], string> = {
  bronze: 'bg-amber-100 text-amber-800',
  silver: 'bg-gray-100 text-gray-800',
  gold: 'bg-yellow-100 text-yellow-800',
}

const typeLabel: Record<ProjectCardProps['projectType'], string> = {
  bronze: 'Բրոնզե',
  silver: 'Արծաթե',
  gold: 'Ոսկե',
}

export function ProjectCard(props: ProjectCardProps) {
  const {
    id,
    title,
    description,
    projectType,
    budgetMin,
    budgetMax,
    durationWeeks,
    applicantCount,
    requiredSkills,
  } = props

  return (
    <div className="rounded-xl border p-5 hover:shadow-lg transition-all duration-200 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${typeColor[projectType]}`}>{typeLabel[projectType]}</span>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-gray-600">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {requiredSkills?.slice(0, 6).map((skill) => (
          <span key={skill} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-700">
        <div>
          <div className="text-gray-500">Բյուջե</div>
          ${budgetMin} - ${budgetMax}
        </div>
        <div>
          <div className="text-gray-500">Ժամկետ</div>
          {durationWeeks} շաբաթ
        </div>
        <div>
          <div className="text-gray-500">Դիմորդներ</div>
          {applicantCount}
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Link href={`/projects/${id}`} className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-all duration-200 shadow-sm hover:shadow-md">
          Դիմել
        </Link>
      </div>
    </div>
  )
}

export default ProjectCard
