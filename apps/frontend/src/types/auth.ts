/**
 * types/auth.ts
 *
 * Types partagés liés à l'authentification.
 * Alignés avec ce que le backend devra retourner.
 */

// ── Utilisateur authentifié ───────────────────────────────────────────────

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  city?: string
  rating?: number
  credits?: number
  isVerified?: boolean
  badges?: string[]
  offeredSkills?: string[]
  wantedSkills?: string[]
}

// ── Réponse de l'API auth (à utiliser quand le backend sera prêt) ─────────

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user: AuthUser
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface RegisterResponse {
  accessToken: string
  user: AuthUser
}

// ── Erreurs API standardisées ─────────────────────────────────────────────

export interface ApiError {
  code: string         // ex: 'INVALID_CREDENTIALS', 'EMAIL_ALREADY_EXISTS'
  message: string
  statusCode: number
}
