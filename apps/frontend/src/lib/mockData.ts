/**
 * lib/mockData.ts
 *
 * Données simulées pour le front SkillSwap.
 * ⚠️  Remplacer par de vrais appels API quand le backend sera prêt.
 */

export interface MockUser {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string          // simulé seulement — jamais exposer en prod
  city: string
  rating: number
  sessionsCount: number
  offeredSkills: string[]
  wantedSkills: string[]
  credits: number
  isVerified: boolean
  badges: string[]
}

// ── Utilisateurs de test ──────────────────────────────────────────────────
export const MOCK_USERS: MockUser[] = [
  {
    id: 'u-001',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie@test.com',
    password: 'Test1234',
    city: 'Paris',
    rating: 4.9,
    sessionsCount: 12,
    offeredSkills: ['Figma', 'UI Design', 'Illustrator'],
    wantedSkills: ['React', 'Python'],
    credits: 5,
    isVerified: true,
    badges: ['Fiable'],
  },
  {
    id: 'u-002',
    firstName: 'Marc',
    lastName: 'Laurent',
    email: 'marc@test.com',
    password: 'Test1234',
    city: 'Lyon',
    rating: 4.8,
    sessionsCount: 8,
    offeredSkills: ['JavaScript', 'Node.js', 'React'],
    wantedSkills: ['Piano', 'Espagnol'],
    credits: 3,
    isVerified: true,
    badges: ['Fiable'],
  },
]

// ── Scénarios d'erreur simulés ───────────────────────────────────────────
export const MOCK_LOCKED_EMAILS = ['locked@test.com']
export const MOCK_EXISTING_EMAILS = ['test@test.com', ...MOCK_USERS.map((u) => u.email)]

// ── Matchs simulés ───────────────────────────────────────────────────────
export interface MockMatch {
  user: MockUser
  score: number           // 0-100
  type: 'perfect' | 'partial'
  sharedSkills: string[]
}

export function getMatchesFor(userId: string): MockMatch[] {
  const user = MOCK_USERS.find((u) => u.id === userId)
  if (!user) return []

  return MOCK_USERS
    .filter((u) => u.id !== userId)
    .map((other) => {
      const gives = other.offeredSkills.filter((s) => user.wantedSkills.includes(s))
      const gets  = other.wantedSkills.filter((s)  => user.offeredSkills.includes(s))
      const isPerfect = gives.length > 0 && gets.length > 0
      const score = Math.min(100, gives.length * 30 + gets.length * 30 + 30)
      return {
        user: other,
        score,
        type: isPerfect ? 'perfect' : 'partial',
        sharedSkills: [...gives, ...gets],
      } as MockMatch
    })
    .sort((a, b) => b.score - a.score)
}
