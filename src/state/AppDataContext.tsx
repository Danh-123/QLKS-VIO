import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import type { BookingStatus, StoredBooking } from '../booking/types'
import { BookingStoreProvider, useBookingStore } from './stores/BookingStoreContext'
import { RoomStoreProvider, useRoomStore } from './stores/RoomStoreContext'
import { UserStoreProvider, useUserStore } from './stores/UserStoreContext'
import type {
  BookingDraft,
  CreateBookingInput,
  NewCustomerInput,
  SearchFilters,
} from './stores/types'

type AppDataContextValue = {
  hotels: ReturnType<typeof useRoomStore>['hotels']
  rooms: ReturnType<typeof useRoomStore>['rooms']
  bookings: StoredBooking[]
  customers: ReturnType<typeof useUserStore>['customers']
  searchFilters: SearchFilters
  bookingDraft: BookingDraft
  updateSearchFilters: (patch: Partial<SearchFilters>) => void
  setBookingDraft: (patch: Partial<BookingDraft>) => void
  addCustomer: (input: NewCustomerInput) => void
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void
  todayIso: string
  isValidDateRange: (checkIn: string, checkOut: string) => boolean
  isRoomAvailable: (roomId: string, checkIn: string, checkOut: string) => boolean
  getUnavailableRoomIds: (checkIn: string, checkOut: string) => Set<string>
  calculatePricing: ReturnType<typeof useRoomStore>['calculatePricing']
  createBooking: (input: CreateBookingInput) => StoredBooking
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

function AppDataComposer({ children }: { children: ReactNode }) {
  const { customers, addCustomer, recordCustomerStay } = useUserStore()
  const { bookings, addBookingRecord, updateBookingStatus } = useBookingStore()
  const {
    hotels,
    rooms,
    searchFilters,
    bookingDraft,
    todayIso,
    updateSearchFilters,
    setBookingDraft,
    isValidDateRange,
    isRoomAvailableFromBookings,
    getUnavailableRoomIdsFromBookings,
    calculatePricing,
  } = useRoomStore()

  const isRoomAvailable = useCallback(
    (roomId: string, checkIn: string, checkOut: string) =>
      isRoomAvailableFromBookings(bookings, roomId, checkIn, checkOut),
    [bookings, isRoomAvailableFromBookings],
  )

  const getUnavailableRoomIds = useCallback(
    (checkIn: string, checkOut: string) =>
      getUnavailableRoomIdsFromBookings(bookings, checkIn, checkOut),
    [bookings, getUnavailableRoomIdsFromBookings],
  )

  const createBooking = useCallback(
    (input: CreateBookingInput) => {
      if (!isValidDateRange(input.checkIn, input.checkOut)) {
        throw new Error('Ngay nhan/tra phong khong hop le.')
      }
      if (!isRoomAvailable(input.roomId, input.checkIn, input.checkOut)) {
        throw new Error('Phong da duoc dat trong khoang thoi gian nay.')
      }

      const next: StoredBooking = {
        id: `vio-${Date.now()}`,
        createdAt: new Date().toISOString(),
        customerName: input.customer?.name?.trim() || undefined,
        roomId: input.roomId,
        roomName: input.roomName,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        status: input.status ?? 'confirmed',
        totalVnd: input.totalVnd,
        preferencesNote: input.preferencesNote,
      }

      addBookingRecord(next)

      if (input.customer?.email) {
        recordCustomerStay(input.customer.name ?? '', input.customer.email)
      }

      return next
    },
    [addBookingRecord, isRoomAvailable, isValidDateRange, recordCustomerStay],
  )

  const value = useMemo<AppDataContextValue>(
    () => ({
      hotels,
      rooms,
      bookings,
      customers,
      searchFilters,
      bookingDraft,
      updateSearchFilters,
      setBookingDraft,
      addCustomer,
      updateBookingStatus,
      todayIso,
      isValidDateRange,
      isRoomAvailable,
      getUnavailableRoomIds,
      calculatePricing,
      createBooking,
    }),
    [
      hotels,
      rooms,
      bookings,
      customers,
      searchFilters,
      bookingDraft,
      updateSearchFilters,
      setBookingDraft,
      addCustomer,
      updateBookingStatus,
      todayIso,
      isValidDateRange,
      isRoomAvailable,
      getUnavailableRoomIds,
      calculatePricing,
      createBooking,
    ],
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
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider')
  }
  return ctx
}
