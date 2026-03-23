import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { BookingStatus, StoredBooking } from '../../booking/types'
import { getRoomDetail, nightsBetween } from '../../data/roomDetails'
import { hotels, type Hotel } from '../../data/hotels'
import { rooms, type RoomListing } from '../../data/rooms'
import type { BookingDraft, PricingResult, SearchFilters } from './types'

type RoomStoreValue = {
  hotels: Hotel[]
  rooms: RoomListing[]
  searchFilters: SearchFilters
  bookingDraft: BookingDraft
  todayIso: string
  updateSearchFilters: (patch: Partial<SearchFilters>) => void
  setBookingDraft: (patch: Partial<BookingDraft>) => void
  isValidDateRange: (checkIn: string, checkOut: string) => boolean
  isRoomAvailableFromBookings: (
    bookings: StoredBooking[],
    roomId: string,
    checkIn: string,
    checkOut: string,
  ) => boolean
  getUnavailableRoomIdsFromBookings: (
    bookings: StoredBooking[],
    checkIn: string,
    checkOut: string,
  ) => Set<string>
  calculatePricing: (
    roomId: string,
    checkIn: string,
    checkOut: string,
  ) => PricingResult
}

const RoomStoreContext = createContext<RoomStoreValue | null>(null)

const SERVICE_FEE_RATE = 0.08

const activeStatuses = new Set<BookingStatus>(['pending', 'confirmed', 'checked-in'])

function toDateAtNoon(iso: string): Date | null {
  if (!iso) return null
  const d = new Date(`${iso}T12:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

function toIsoDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function rangesOverlap(
  aStartIso: string,
  aEndIso: string,
  bStartIso: string,
  bEndIso: string,
): boolean {
  const aStart = toDateAtNoon(aStartIso)
  const aEnd = toDateAtNoon(aEndIso)
  const bStart = toDateAtNoon(bStartIso)
  const bEnd = toDateAtNoon(bEndIso)
  if (!aStart || !aEnd || !bStart || !bEnd) return false
  return aStart < bEnd && bStart < aEnd
}

const DEFAULT_SEARCH: SearchFilters = {
  hotelId: hotels[0]?.id ?? '',
  locationQuery: `${hotels[0]?.name ?? 'VIO'} · ${hotels[0]?.location ?? 'Vinh Nam'}`,
  checkIn: '',
  checkOut: '',
  guests: '2',
}

const DEFAULT_DRAFT: BookingDraft = {
  roomId: '',
  checkIn: '',
  checkOut: '',
  guests: '2',
  adults: '2',
  children: '0',
}

export function RoomStoreProvider({ children }: { children: ReactNode }) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(DEFAULT_SEARCH)
  const [bookingDraft, setBookingDraftState] = useState<BookingDraft>(DEFAULT_DRAFT)

  const todayIso = useMemo(() => toIsoDate(new Date()), [])

  const updateSearchFilters = useCallback((patch: Partial<SearchFilters>) => {
    setSearchFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const setBookingDraft = useCallback((patch: Partial<BookingDraft>) => {
    setBookingDraftState((prev) => ({ ...prev, ...patch }))
  }, [])

  const isValidDateRange = useCallback(
    (checkIn: string, checkOut: string) => {
      const ci = toDateAtNoon(checkIn)
      const co = toDateAtNoon(checkOut)
      const today = toDateAtNoon(todayIso)
      if (!ci || !co || !today) return false
      return ci >= today && co > ci
    },
    [todayIso],
  )

  const isRoomAvailableFromBookings = useCallback(
    (bookings: StoredBooking[], roomId: string, checkIn: string, checkOut: string) => {
      if (!isValidDateRange(checkIn, checkOut)) return false
      return !bookings.some(
        (booking) =>
          booking.roomId === roomId &&
          activeStatuses.has(booking.status) &&
          rangesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut),
      )
    },
    [isValidDateRange],
  )

  const getUnavailableRoomIdsFromBookings = useCallback(
    (bookings: StoredBooking[], checkIn: string, checkOut: string) => {
      const ids = new Set<string>()
      if (!isValidDateRange(checkIn, checkOut)) return ids
      for (const room of rooms) {
        if (!isRoomAvailableFromBookings(bookings, room.id, checkIn, checkOut)) {
          ids.add(room.id)
        }
      }
      return ids
    },
    [isRoomAvailableFromBookings, isValidDateRange],
  )

  const calculatePricing = useCallback(
    (roomId: string, checkIn: string, checkOut: string): PricingResult => {
      const room = getRoomDetail(roomId)
      const nights = nightsBetween(checkIn, checkOut)
      const subtotal = room ? room.pricePerNight * nights : 0
      const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE)
      const total = subtotal + serviceFee
      return { nights, subtotal, serviceFee, total }
    },
    [],
  )

  const value = useMemo<RoomStoreValue>(
    () => ({
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
    }),
    [
      searchFilters,
      bookingDraft,
      todayIso,
      updateSearchFilters,
      setBookingDraft,
      isValidDateRange,
      isRoomAvailableFromBookings,
      getUnavailableRoomIdsFromBookings,
      calculatePricing,
    ],
  )

  return <RoomStoreContext.Provider value={value}>{children}</RoomStoreContext.Provider>
}

export function useRoomStore() {
  const ctx = useContext(RoomStoreContext)
  if (!ctx) {
    throw new Error('useRoomStore must be used within RoomStoreProvider')
  }
  return ctx
}
