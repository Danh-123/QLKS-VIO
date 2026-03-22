import { createContext } from 'react'

export type ToastItem = {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'
}

export type ToastContextValue = {
  toasts: ToastItem[]
  push: (t: Omit<ToastItem, 'id'> & { id?: string }) => string
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
