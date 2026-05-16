"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../lib/api'

export const USER_STORAGE_KEY = 'user'
export const AUTH_USER_KEY = USER_STORAGE_KEY

function readStoredUser() {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const id = typeof parsed.id === 'string' ? parsed.id : ''
    const email = typeof parsed.email === 'string' ? parsed.email : ''
    const name = typeof parsed.name === 'string' ? parsed.name : ''
    const role = parsed.role === 'admin' || parsed.role === 'user' ? parsed.role : ''
    const avatar = typeof parsed.avatar === 'string' && parsed.avatar.trim() ? parsed.avatar : undefined

    if (!id || !email || !name || !role) return null

    return { id, email, name, role, avatar }
  } catch {
    return null
  }
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null

  const id = String(user.id || '')
  const email = String(user.email || '')
  const name = String(user.name || '')
  const role = user.role === 'admin' ? 'admin' : 'user'
  const avatarSource =
    typeof user.avatar === 'string' && user.avatar.trim()
      ? user.avatar
      : typeof user.profileImage === 'string' && user.profileImage.trim()
        ? user.profileImage
        : typeof user.image === 'string' && user.image.trim()
          ? user.image
          : ''

  if (!id || !email || !name) return null

  return { id, email, name, role, avatar: avatarSource || undefined }
}

function persistUser(user) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  }

  return user
}

export function getStoredUser() {
  return readStoredUser()
}

export function hasAuthToken() {
  return Boolean(readStoredUser())
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function useAuth() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => readStoredUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setUser(readStoredUser())
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)

    try {
      const matchedUser = await userApi.login(email, password)

      if (!matchedUser) {
        throw new Error('Invalid email or password')
      }

      const nextUser = normalizeUser(matchedUser)
      if (!nextUser) {
        throw new Error('Invalid account data')
      }

      setUser(persistUser(nextUser))
      return nextUser
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in. Please try again.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true)
    setError(null)

    try {
      const createdUser = await userApi.register({ name, email, password })
      const nextUser = normalizeUser(createdUser)

      if (!nextUser) {
        throw new Error('Invalid account data')
      }

      setUser(persistUser(nextUser))
      return nextUser
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to register. Please try again.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuthSession()
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  return useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      loading,
      error,
      clearError,
    }),
    [clearError, error, loading, login, logout, register, user],
  )
}