import prisma from '@/lib/prisma'

async function getMentor(id: string) {
  return prisma.mentor.findUnique({ where: { id }, include: { user: true, sessions: { take: 5, orderBy: { scheduledAt: 'desc' } } } })
}

export default async function MentorProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const mentor = await getMentor(id)
  if (!mentor) return <div className="p-6">Mentor not found</div>
  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-gradient-to-br from-brand.purple to-brand.blue" />
        <div>
          <h1 className="text-2xl font-bold">{mentor.user.fullName}</h1>
          <div className="text-gray-600">{mentor.expertise} • {mentor.experienceYears}y • Rating {Number(mentor.rating).toFixed(1)}</div>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="font-semibold">About</h2>
            <p className="text-gray-600 mt-2">{mentor.user.bio || 'No bio yet.'}</p>
          </div>
          <div>
            <h2 className="font-semibold">Recent Sessions</h2>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              {mentor.sessions.map((s) => (
                <li key={s.id} className="rounded border p-2">{s.sessionType} • {s.durationMinutes}m • ${(s.priceCents / 100).toFixed(0)}</li>
              ))}
            </ul>
          </div>
        </div>
        <aside>
          <h3 className="font-semibold">Book a Session</h3>
          <form action="/api/sessions" method="post" className="mt-3 space-y-3">
            <input type="hidden" name="mentorId" value={mentor.id} />
            <select name="sessionType" className="w-full rounded border p-2">
              <option value="code_review">Code Review</option>
              <option value="strategy">Strategy</option>
              <option value="feedback">Feedback</option>
              <option value="career_advice">Career Advice</option>
            </select>
            <input name="durationMinutes" className="w-full rounded border p-2" type="number" min="30" step="15" defaultValue={60} />
            <input name="priceCents" className="w-full rounded border p-2" type="number" min="1000" step="500" defaultValue={mentor.hourlyRate} />
            <button className="rounded bg-primary-600 text-white px-4 py-2 w-full">Book Now</button>
          </form>
        </aside>
      </section>
    </div>
  )
}
