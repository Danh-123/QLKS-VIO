import { useCallback, useEffect, useMemo, useState } from 'react'
import type { BookingStatus } from '../../types/booking'
import {
  fetchAdminBookings,
  fetchAdminOverviewMetrics,
  patchBookingStatus,
  type AdminBooking,
  type AdminOverviewMetrics,
} from '../lib/adminApi'

type AdminDashboardState = {
  loading: boolean
  error: string | null
  bookings: AdminBooking[]
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
    metrics: initialMetrics,
  })

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }))

    try {
      const bookings = await fetchAdminBookings()
      const metrics = await fetchAdminOverviewMetrics(bookings)
      setState({ loading: false, error: null, bookings, metrics })
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

      const activeBookings = nextBookings.filter((booking) =>
        ['pending', 'confirmed', 'checked-in'].includes(booking.status),
      ).length

      return {
        ...current,
        bookings: nextBookings,
        metrics: {
          ...current.metrics,
          activeBookings,
        },
      }
    })
  }, [])

  return {
    ...state,
    bookings: sortedBookings,
    reload: load,
    updateBookingStatus,
  }
}
