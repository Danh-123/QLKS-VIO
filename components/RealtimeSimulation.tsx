'use client'

import { useAppData } from '../contexts/AppDataContext'
import { useRealtime } from '../hooks/useRealtime'
import type { BookingStatus } from '../types/booking'
import type { RoomStatus } from '../types/room'

export function RealtimeSimulation() {
  const { bookings, rooms, updateBookingStatus, setRoomStatus } = useAppData()

  useRealtime(() => {
    const mutable = bookings.filter(
      (booking) =>
        booking.status === 'pending' ||
        booking.status === 'confirmed' ||
        booking.status === 'checked-in',
    )
    if (mutable.length === 0) return

    const selected = mutable[Math.floor(Math.random() * mutable.length)]
    const flow: Record<BookingStatus, BookingStatus[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['checked-in', 'no-show', 'cancelled'],
      'checked-in': ['checked-out'],
      'checked-out': ['checked-out'],
      cancelled: ['cancelled'],
      'no-show': ['no-show'],
    }
    const nextList = flow[selected.status]
    const next = nextList[Math.floor(Math.random() * nextList.length)]
    void updateBookingStatus(selected.id, next)
  }, 9000)

  useRealtime(() => {
    if (rooms.length === 0) return
    const picked = rooms[Math.floor(Math.random() * rooms.length)]
    const flow: Record<RoomStatus, RoomStatus[]> = {
      available: ['occupied', 'dirty', 'maintenance'],
      occupied: ['dirty', 'available'],
      dirty: ['available', 'maintenance'],
      maintenance: ['available', 'dirty'],
    }
    const nextList = flow[picked.status]
    const next = nextList[Math.floor(Math.random() * nextList.length)]
    setRoomStatus(picked.id, next)
  }, 7000)

  return null
}
