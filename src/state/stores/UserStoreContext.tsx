import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { initialCustomers, type CustomerRow } from '../../admin/mockData'
import type { NewCustomerInput } from './types'

type UserStoreValue = {
  customers: CustomerRow[]
  addCustomer: (input: NewCustomerInput) => void
  recordCustomerStay: (name: string, email: string) => void
}

const UserStoreContext = createContext<UserStoreValue | null>(null)

function tierFromStays(stays: number): string {
  if (stays >= 20) return 'Platinum'
  if (stays >= 8) return 'Gold'
  return 'Silver'
}

export function UserStoreProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<CustomerRow[]>(() => [...initialCustomers])

  const addCustomer = useCallback((input: NewCustomerInput) => {
    const name = input.name.trim()
    const email = input.email.trim()
    if (!name || !email) return

    setCustomers((prev) => {
      const existing = prev.find(
        (customer) => customer.email.toLowerCase() === email.toLowerCase(),
      )
      if (existing) return prev
      return [
        ...prev,
        {
          id: `c-${Date.now()}`,
          name,
          email,
          tier: input.tier ?? 'Silver',
          stays: 0,
        },
      ]
    })
  }, [])

  const recordCustomerStay = useCallback((name: string, email: string) => {
    const safeName = name.trim()
    const safeEmail = email.trim()
    if (!safeEmail) return

    setCustomers((prev) => {
      const key = safeEmail.toLowerCase()
      const idx = prev.findIndex((customer) => customer.email.toLowerCase() === key)
      if (idx >= 0) {
        const updated = [...prev]
        const current = updated[idx]
        const stays = current.stays + 1
        updated[idx] = {
          ...current,
          name: safeName || current.name,
          stays,
          tier: tierFromStays(stays),
        }
        return updated
      }

      return [
        ...prev,
        {
          id: `c-${Date.now()}`,
          name: safeName || 'Khach moi',
          email: safeEmail,
          stays: 1,
          tier: tierFromStays(1),
        },
      ]
    })
  }, [])

  const value = useMemo<UserStoreValue>(
    () => ({
      customers,
      addCustomer,
      recordCustomerStay,
    }),
    [customers, addCustomer, recordCustomerStay],
  )

  return <UserStoreContext.Provider value={value}>{children}</UserStoreContext.Provider>
}

export function useUserStore() {
  const ctx = useContext(UserStoreContext)
  if (!ctx) {
    throw new Error('useUserStore must be used within UserStoreProvider')
  }
  return ctx
}
