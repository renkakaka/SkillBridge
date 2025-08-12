export type ProjectTier = 'bronze' | 'silver' | 'gold'

export function calculateEP(projectType: ProjectTier, clientRating: number, completion: 'early' | 'ontime' | 'late') {
  const basePoints = { bronze: 100, silver: 300, gold: 800 } as const
  const multipliers = {
    rating: Math.max(0.2, Math.min(1, clientRating / 5)),
    completion: completion === 'early' ? 1.2 : completion === 'ontime' ? 1.0 : 0.8,
  }
  return Math.round(basePoints[projectType] * multipliers.rating * multipliers.completion)
}
