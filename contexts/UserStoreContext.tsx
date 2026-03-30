'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { usersSeed } from '../lib/mockData'
import type { User } from '../types/user'

type UserStore = {
  users: User[]
  addUser: (user: User) => void
}

const UserStoreContext = createContext<UserStore | null>(null)

export function UserStoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(usersSeed)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await fetch('/api/users', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as User[]
        if (mounted) setUsers(data)
      } catch {
        // keep seeded fallback
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  const addUser = (user: User) => {
    setUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id)
      if (exists) return prev
      return [...prev, user]
    })
  }

  const value = useMemo(() => ({ users, addUser }), [users])

  return <UserStoreContext.Provider value={value}>{children}</UserStoreContext.Provider>
}

export function useUserStore() {
  const ctx = useContext(UserStoreContext)
  if (!ctx) throw new Error('useUserStore must be used inside UserStoreProvider')
  return ctx
}
