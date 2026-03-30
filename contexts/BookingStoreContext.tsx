'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { bookingsSeed } from '../lib/mockData'
import type { Booking, BookingStatus } from '../types/booking'

type CreateBookingInput = {
  roomId: string
  roomName: string
  customerId: string
  customerName: string
  checkIn: string
  checkOut: string
  guests: number
  pricePerNight: number
}

type BookingStore = {
  bookings: Booking[]
  createBooking: (input: CreateBookingInput) => Promise<Booking>
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>
}

const BookingStoreContext = createContext<BookingStore | null>(null)

export function BookingStoreProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(bookingsSeed)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await fetch('/api/bookings', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as Booking[]
        if (mounted) setBookings(data)
      } catch {
        // keep seeded fallback
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  const createBooking = async (input: CreateBookingInput) => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: input.roomId,
        customerId: input.customerId,
        customerName: input.customerName,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
      }),
    })

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { message?: string } | null
      throw new Error(payload?.message || 'Failed to create booking')
    }

    const next = (await res.json()) as Booking
    setBookings((prev) => [next, ...prev.filter((booking) => booking.id !== next.id)])
    return next
  }

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking,
      ),
    )

    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      throw new Error('Failed to update booking status')
    }
  }

  const value = useMemo(
    () => ({ bookings, createBooking, updateBookingStatus }),
    [bookings],
  )

  return (
    <BookingStoreContext.Provider value={value}>
      {children}
    </BookingStoreContext.Provider>
  )
}

export function useBookingStore() {
  const ctx = useContext(BookingStoreContext)
  if (!ctx) throw new Error('useBookingStore must be used inside BookingStoreProvider')
  return ctx
}
