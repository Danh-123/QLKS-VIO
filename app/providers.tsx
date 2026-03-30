'use client'

import type { ReactNode } from 'react'
import { RealtimeSimulation } from '../components/RealtimeSimulation'
import { AppDataProvider } from '../contexts/AppDataContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppDataProvider>
      <RealtimeSimulation />
      {children}
    </AppDataProvider>
  )
}
