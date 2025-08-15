import prisma from '@/lib/prisma'

async function getMentorUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      mentorSessions: { orderBy: { startTime: 'desc' }, take: 5 },
    },
  })
}

export default async function MentorProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getMentorUser(id)
  if (!user || user.userType !== 'mentor') return <div className="p-6">Mentor not found</div>
  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-gradient-to-br from-brand.purple to-brand.blue" />
        <div>
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          <div className="text-gray-600">{user.experienceLevel || '—'}</div>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="font-semibold">About</h2>
            <p className="text-gray-600 mt-2">{user.bio || 'No bio yet.'}</p>
          </div>
          <div>
            <h2 className="font-semibold">Recent Sessions</h2>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              {(user.mentorSessions || []).map((s) => (
                <li key={s.id} className="rounded border p-2">{new Date(s.startTime).toLocaleString()} • {new Date(s.endTime).toLocaleTimeString()}</li>
              ))}
            </ul>
          </div>
        </div>
        <aside>
          <h3 className="font-semibold">Book a Session</h3>
          <form action="/api/sessions" method="post" className="mt-3 space-y-3">
            <input type="hidden" name="mentorId" value={user.id} />
            <input name="durationMinutes" className="w-full rounded border p-2" type="number" min="30" step="15" defaultValue={60} />
            <input name="priceCents" className="w-full rounded border p-2" type="number" min="1000" step="500" defaultValue={3000} />
            <button className="rounded bg-primary-600 text-white px-4 py-2 w-full">Book Now</button>
          </form>
        </aside>
      </section>
    </div>
  )
}
