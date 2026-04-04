/**
 * lib/api/axios.ts
 *
 * Instance Axios préconfigurée pour le backend SkillSwap.
 * ⚠️  Non utilisée en mode simulation — activez-la quand le backend est prêt.
 */

import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Intercepteur requête : injecte le token JWT ───────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // En prod : récupérer depuis le store Zustand ou localStorage sécurisé
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('skillswap_token')
        : null

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// ── Intercepteur réponse : gère le refresh token ──────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Token expiré → tenter un refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('skillswap_refresh_token')
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        localStorage.setItem('skillswap_token', data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`

        return apiClient(originalRequest)
      } catch {
        // Refresh échoué → déconnecter
        localStorage.removeItem('skillswap_token')
        localStorage.removeItem('skillswap_refresh_token')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

// ── Helpers auth (à activer quand le backend est prêt) ────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (payload: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => apiClient.post('/auth/register', payload),

  logout: () => apiClient.post('/auth/logout'),

  me: () => apiClient.get('/auth/me'),
}
