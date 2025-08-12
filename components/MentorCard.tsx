'use client'

import Link from 'next/link'

export type MentorCardProps = {
  id: string
  name: string
  expertise: string
  experienceYears: number
  rating: number
  hourlyRate: number
  totalMentees: number
  successRate: number
}

export function MentorCard(props: MentorCardProps) {
  const { id, name, expertise, experienceYears, rating, hourlyRate, totalMentees, successRate } = props
  return (
    <div className="rounded-xl border p-5 hover:shadow-lg transition-all duration-200 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-full bg-gradient-to-br from-brand.purple to-brand.blue" />
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-600">{expertise} • {experienceYears} տարի</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Գնահատական</div>
          {rating.toFixed(1)} / 5
        </div>
        <div>
          <div className="text-gray-500">Ժամավճար</div>
          ${(hourlyRate / 100).toFixed(0)}
        </div>
        <div>
          <div className="text-gray-500">Ուսանողներ</div>
          {totalMentees} ({successRate.toFixed(0)}%)
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Link href={`/mentors/${id}`} className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-all duration-200 shadow-sm hover:shadow-md">
          Ամրագրել սեսիա
        </Link>
      </div>
    </div>
  )
}

export default MentorCard
