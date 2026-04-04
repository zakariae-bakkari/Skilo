'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { AuthUser } from '@/types/auth'

// ── Types ─────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  logout: () => void
}

// ── Contexte ──────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const setUser = useCallback((newUser: AuthUser | null) => {
    setUserState(newUser)
  }, [])

  const logout = useCallback(() => {
    setUserState(null)
    // En prod : appeler authApi.logout() et vider les tokens
    // localStorage.removeItem('skillswap_token')
    // router.push('/login')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth doit être utilisé à lintérieur dun <AuthProvider>')
  }
  return ctx
}
