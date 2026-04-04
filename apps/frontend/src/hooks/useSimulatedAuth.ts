'use client'

import { useState } from 'react'
import {
  MOCK_USERS,
  MOCK_LOCKED_EMAILS,
  MOCK_EXISTING_EMAILS,
} from '@/lib/mockData'

// ── Types ────────────────────────────────────────────────────────────────

export type AuthError =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'EMAIL_ALREADY_EXISTS'
  | 'NETWORK_ERROR'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  error?: AuthError
  message?: string
}

// ── Délai de simulation réseau ───────────────────────────────────────────
const simulateDelay = (ms = 1200) =>
  new Promise<void>((res) => setTimeout(res, ms))

// ── Hook ─────────────────────────────────────────────────────────────────

/**
 * useSimulatedAuth
 *
 * Simule login / register côté front sans appel API réel.
 * Remplacer `simulateLogin` et `simulateRegister` par de vrais
 * appels axios quand le backend sera opérationnel.
 */
export function useSimulatedAuth() {
  const [loading, setLoading] = useState(false)

  // ── LOGIN ────────────────────────────────────────────────────────────
  async function simulateLogin(payload: LoginPayload): Promise<AuthResult> {
    setLoading(true)
    await simulateDelay()

    try {
      // Compte verrouillé
      if (MOCK_LOCKED_EMAILS.includes(payload.email.toLowerCase())) {
        return {
          success: false,
          error: 'ACCOUNT_LOCKED',
          message: 'Compte temporairement verrouillé. Réessayez dans 15 minutes.',
        }
      }

      // Cherche utilisateur
      const user = MOCK_USERS.find(
        (u) =>
          u.email.toLowerCase() === payload.email.toLowerCase() &&
          u.password === payload.password,
      )

      if (!user) {
        return {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Email ou mot de passe incorrect.',
        }
      }

      // Succès — en prod, stocker le token JWT
      return { success: true }
    } finally {
      setLoading(false)
    }
  }

  // ── REGISTER ─────────────────────────────────────────────────────────
  async function simulateRegister(payload: RegisterPayload): Promise<AuthResult> {
    setLoading(true)
    await simulateDelay()

    try {
      // Email déjà utilisé
      if (MOCK_EXISTING_EMAILS.includes(payload.email.toLowerCase())) {
        return {
          success: false,
          error: 'EMAIL_ALREADY_EXISTS',
          message: 'Cette adresse email est déjà associée à un compte.',
        }
      }

      // En prod : POST /api/auth/register
      // Ici on simule une création réussie
      return { success: true }
    } finally {
      setLoading(false)
    }
  }

  return { loading, simulateLogin, simulateRegister }
}
