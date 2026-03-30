'use client'

import { useAppData } from '../contexts/AppDataContext'

export function useBookings() {
  const { bookings, createBooking, updateBookingStatus } = useAppData()
  return { bookings, createBooking, updateBookingStatus }
}
