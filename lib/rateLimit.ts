type Bucket = {
  resetAtMs: number
  count: number
}

const buckets = new Map<string, Bucket>()

function getClientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for') || ''
  const ip = forwarded.split(',')[0].trim() || headers.get('x-real-ip') || '127.0.0.1'
  return ip
}

export async function rateLimit(
  headers: Headers,
  options: { id: string; limit: number; windowMs: number }
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const ip = getClientKey(headers)
  const key = `${options.id}:${ip}`
  const now = Date.now()
  const existing = buckets.get(key)
  if (!existing || existing.resetAtMs <= now) {
    const resetAtMs = now + options.windowMs
    buckets.set(key, { resetAtMs, count: 1 })
    return { allowed: true, remaining: options.limit - 1, resetAt: resetAtMs }
  }
  existing.count += 1
  const allowed = existing.count <= options.limit
  return { allowed, remaining: Math.max(0, options.limit - existing.count), resetAt: existing.resetAtMs }
}


