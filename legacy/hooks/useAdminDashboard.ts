import { useCallback, useEffect, useMemo, useState } from 'react'
import type { BookingStatus } from '../../types/booking'
import {
  computeAdminOverviewMetrics,
  fetchAdminBookings,
  fetchAdminRooms,
  patchBookingStatus,
  type AdminBooking,
  type AdminOverviewMetrics,
  type AdminRoomRow,
} from '../lib/adminApi'

function countRoomStatuses(rooms: AdminRoomRow[]) {
  const counts: Record<string, number> = {}
  for (const room of rooms) {
    const key = room.status ?? 'unknown'
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}

type AdminDashboardState = {
  loading: boolean
  error: string | null
  bookings: AdminBooking[]
  rooms: AdminRoomRow[]
  metrics: AdminOverviewMetrics
}

const initialMetrics: AdminOverviewMetrics = {
  totalRevenueVnd: 0,
  occupancyRate: 0,
  activeBookings: 0,
  averageDailyRateVnd: 0,
}

export function useAdminDashboard() {
  const [state, setState] = useState<AdminDashboardState>({
    loading: true,
    error: null,
    bookings: [],
    rooms: [],
    metrics: initialMetrics,
  })

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }))

    try {
      const [bookings, rooms] = await Promise.all([fetchAdminBookings(), fetchAdminRooms()])
      const metrics = computeAdminOverviewMetrics(bookings, rooms)
      setState({ loading: false, error: null, bookings, rooms, metrics })
    } catch (err) {
      setState((current) => ({
        ...current,
        loading: false,
        error: err instanceof Error ? err.message : 'Unable to load dashboard data.',
      }))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const sortedBookings = useMemo(
    () => [...state.bookings].sort((a, b) => (a.id < b.id ? 1 : -1)),
    [state.bookings],
  )

  const updateBookingStatus = useCallback(async (bookingId: string, status: BookingStatus) => {
    await patchBookingStatus(bookingId, status)

    setState((current) => {
      const nextBookings = current.bookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status }
          : booking,
      )

      const metrics = computeAdminOverviewMetrics(nextBookings, current.rooms)

      return {
        ...current,
        bookings: nextBookings,
        metrics,
      }
    })
  }, [])

  const roomStatusCounts = useMemo(() => countRoomStatuses(state.rooms), [state.rooms])

  return {
    ...state,
    bookings: sortedBookings,
    roomStatusCounts,
    reload: load,
    updateBookingStatus,
  }
}
