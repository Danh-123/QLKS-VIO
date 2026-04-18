import { useCallback, useState } from 'react'

type LoginPayload = {
  email: string
  password: string
}

type LoginResult = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export const AUTH_TOKEN_KEY = 'vio_auth_token'
export const AUTH_USER_KEY = 'vio_auth_user'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const payload = (await response.json()) as LoginResult & { message?: string }

      if (!response.ok || !payload.token) {
        throw new Error(payload.message || 'Invalid email or password')
      }

      localStorage.setItem(AUTH_TOKEN_KEY, payload.token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload.user))

      return payload
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in. Please try again.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    login,
    loading,
    error,
    clearError,
  }
}

export function hasAuthToken() {
  if (typeof window === 'undefined') return false
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY))
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}
