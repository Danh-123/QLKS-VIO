import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ensureDemoBookingsSeeded,
  getBookings,
  saveBookings,
} from '../../booking/bookingStorage'
import type { BookingStatus, StoredBooking } from '../../booking/types'

type BookingStoreValue = {
  bookings: StoredBooking[]
  addBookingRecord: (booking: StoredBooking) => void
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void
}

const BookingStoreContext = createContext<BookingStoreValue | null>(null)

const statusFlow: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['checked-in', 'cancelled', 'no-show'],
  'checked-in': ['checked-out'],
  'checked-out': ['checked-out'],
  cancelled: ['cancelled'],
  'no-show': ['no-show'],
}

function nextStatus(current: BookingStatus): BookingStatus {
  const options = statusFlow[current]
  if (!options || options.length === 0) return current
  const idx = Math.floor(Math.random() * options.length)
  return options[idx]
}

export function BookingStoreProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<StoredBooking[]>(() => {
    ensureDemoBookingsSeeded()
    return getBookings()
  })

  const addBookingRecord = useCallback((booking: StoredBooking) => {
    setBookings((prev) => {
      const updated = [booking, ...prev]
      saveBookings(updated)
      return updated
    })
  }, [])

  const updateBookingStatus = useCallback(
    (bookingId: string, status: BookingStatus) => {
      setBookings((prev) => {
        const updated = prev.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status,
              }
            : booking,
        )
        saveBookings(updated)
        return updated
      })
    },
    [],
  )

  useEffect(() => {
    if (bookings.length === 0) return

    const timer = window.setInterval(() => {
      setBookings((prev) => {
        if (prev.length === 0) return prev

        const mutable = prev
          .map((booking, index) => ({ booking, index }))
          .filter(({ booking }) =>
            booking.status === 'pending' ||
            booking.status === 'confirmed' ||
            booking.status === 'checked-in',
          )

        if (mutable.length === 0) return prev

        const selected = mutable[Math.floor(Math.random() * mutable.length)]
        const current = selected.booking
        const next = nextStatus(current.status)
        if (next === current.status) return prev

        const updated = [...prev]
        updated[selected.index] = {
          ...current,
          status: next,
        }
        saveBookings(updated)
        return updated
      })
    }, 7000)

    return () => {
      window.clearInterval(timer)
    }
  }, [bookings.length])

  const value = useMemo<BookingStoreValue>(
    () => ({
      bookings,
      addBookingRecord,
      updateBookingStatus,
    }),
    [bookings, addBookingRecord, updateBookingStatus],
  )

  return (
    <BookingStoreContext.Provider value={value}>
      {children}
    </BookingStoreContext.Provider>
  )
}

export function useBookingStore() {
  const ctx = useContext(BookingStoreContext)
  if (!ctx) {
    throw new Error('useBookingStore must be used within BookingStoreProvider')
  }
  return ctx
}
