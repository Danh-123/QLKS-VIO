'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { BookingStoreProvider, useBookingStore } from './BookingStoreContext'
import { RoomStoreProvider, useRoomStore } from './RoomStoreContext'
import { UserStoreProvider, useUserStore } from './UserStoreContext'

type AppData = {
  users: ReturnType<typeof useUserStore>['users']
  rooms: ReturnType<typeof useRoomStore>['rooms']
  bookings: ReturnType<typeof useBookingStore>['bookings']
  createBooking: ReturnType<typeof useBookingStore>['createBooking']
  updateBookingStatus: ReturnType<typeof useBookingStore>['updateBookingStatus']
  setRoomStatus: ReturnType<typeof useRoomStore>['setRoomStatus']
  getRoomById: ReturnType<typeof useRoomStore>['getRoomById']
}

const AppDataContext = createContext<AppData | null>(null)

function AppDataComposer({ children }: { children: ReactNode }) {
  const { users } = useUserStore()
  const { rooms, setRoomStatus, getRoomById } = useRoomStore()
  const { bookings, createBooking, updateBookingStatus } = useBookingStore()

  const value = useMemo(
    () => ({
      users,
      rooms,
      bookings,
      createBooking,
      updateBookingStatus,
      setRoomStatus,
      getRoomById,
    }),
    [users, rooms, bookings, createBooking, updateBookingStatus, setRoomStatus, getRoomById],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  return (
    <UserStoreProvider>
      <BookingStoreProvider>
        <RoomStoreProvider>
          <AppDataComposer>{children}</AppDataComposer>
        </RoomStoreProvider>
      </BookingStoreProvider>
    </UserStoreProvider>
  )
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}
