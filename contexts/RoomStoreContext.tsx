'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { roomsSeed } from '../lib/mockData'
import type { Room, RoomStatus } from '../types/room'

type RoomStore = {
  rooms: Room[]
  setRoomStatus: (roomId: string, status: RoomStatus) => void
  getRoomById: (id: string) => Room | undefined
}

const RoomStoreContext = createContext<RoomStore | null>(null)

export function RoomStoreProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(roomsSeed)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await fetch('/api/rooms', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as Room[]
        if (mounted) setRooms(data)
      } catch {
        // keep seeded fallback
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  const setRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((room) => (room.id === roomId ? { ...room, status } : room)),
    )
  }

  const getRoomById = (id: string) => rooms.find((room) => room.id === id)

  const value = useMemo(
    () => ({ rooms, setRoomStatus, getRoomById }),
    [rooms],
  )

  return <RoomStoreContext.Provider value={value}>{children}</RoomStoreContext.Provider>
}

export function useRoomStore() {
  const ctx = useContext(RoomStoreContext)
  if (!ctx) throw new Error('useRoomStore must be used inside RoomStoreProvider')
  return ctx
}
