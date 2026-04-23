import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { fetchBookings } from '../../../lib/api'
import type { Booking } from '../../../types/booking'


'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { fetchBookings } from '../../../lib/api'
import type { Booking, BookingStatus } from '../../../types/booking'
import { cn } from '../../../lib/utils'

const PAGE_SIZE = 6

  const statusLabels: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'checked-in': 'Checked In',
  'checked-out': 'Checked Out',
  cancelled: 'Cancelled',
  'no-show': 'No Show',
}

function toBadgeStatus(status: BookingStatus): 'confirmed' | 'pending' | 'cancelled' {
  if (['confirmed', 'checked-in', 'checked-out'].includes(status)) return 'confirmed'
  if (['cancelled', 'no-show'].includes(status)) return 'cancelled'
  return 'pending'
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBookings()
      setBookings(data)
    } catch (err) {
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const totalPages = Math.ceil(bookings.length / PAGE_SIZE)
  const currentPage = Math.min(page, totalPages)
  const paginatedBookings = bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      reload()
    } catch (err) {
      setError('Failed to update status')
    }
  }

  // Stub metrics
  const metrics = {
    totalRevenueVnd: bookings.reduce((sum, b) => sum + b.totalVnd, 0),
    activeBookings: bookings.filter(b => ['pending', 'confirmed', 'checked-in'].includes(b.status)).length,
    occupancyRate: 75, // Stub
    averageDailyRateVnd: 2500000, // Stub
  }

  return (
    <div className="space-y-8 md:space-y-10 p-0"> {/* Padding in layout */}
      {/* Hero */}
      <section className="relative h-[280px] overflow-hidden rounded-3xl md:rounded-[2rem]">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
          alt="Hotel Operations Hero"
          fill
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-vio-near-black/70 via-vio-near-black/40 to-vio-near-black/20" />
        <div className="absolute inset-0 flex items-end p-6 md:p-8 lg:p-10">
          <div className="max-w-md">
            <p className="text-xs uppercase tracking-[0.2em] text-vio-terracotta">Admin Suite</p>
            <h1 className="mt-2 font-cormorant text-4xl md:text-5xl font-normal text-vio-ivory leading-tight">
              Hotel Operations
            </h1>
            <p className="mt-4 text-sm md:text-base text-vio-ivory/90 max-w-lg">
              Control center for reservations, occupancy, and guest experience.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200/50 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button onClick={reload} className="px-3 py-1 rounded-md border border-red-200 bg-white text-xs hover:bg-red-50 transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group/card p-6 rounded-2xl border border-vio-border-cream/50 bg-white hover:shadow-lg hover:shadow-vio-terracotta/5 transition-all duration-300">
          <p className="text-xs uppercase tracking-[0.1em] text-vio-stone-gray mb-2">Total Revenue</p>
          <p className="text-3xl lg:text-4xl font-cormorant font-normal text-vio-near-black leading-none">
            {formatCurrency(metrics.totalRevenueVnd)}
          </p>
          <p className="mt-2 text-sm text-emerald-600 font-medium">+12.5% from last month</p>
        </div>
        <div className="p-6 rounded-2xl border border-vio-border-cream/50 bg-white hover:shadow-lg hover:shadow-vio-terracotta/5 transition-all">
          <p className="text-xs uppercase tracking-[0.1em] text-vio-stone-gray mb-2">Occupancy</p>
          <p className="text-3xl lg:text-4xl font-cormorant font-normal text-vio-near-black">{metrics.occupancyRate}%</p>
          <p className="mt-2 text-sm text-emerald-600 font-medium">+3.2% week over week</p>
        </div>
        <div className="p-6 rounded-2xl border border-vio-border-cream/50 bg-white hover:shadow-lg hover:shadow-vio-terracotta/5 transition-all">
          <p className="text-xs uppercase tracking-[0.1em] text-vio-stone-gray mb-2">Active Bookings</p>
          <p className="text-3xl lg:text-4xl font-cormorant font-normal text-vio-near-black">
            {metrics.activeBookings}
          </p>
          <p className="mt-2 text-sm text-emerald-600 font-medium">+8 new today</p>
        </div>
        <div className="p-6 rounded-2xl border border-vio-border-cream/50 bg-white hover:shadow-lg hover:shadow-vio-terracotta/5 transition-all">
          <p className="text-xs uppercase tracking-[0.1em] text-vio-stone-gray mb-2">Avg Daily Rate</p>
          <p className="text-3xl lg:text-4xl font-cormorant font-normal text-vio-near-black">
            {formatCurrency(metrics.averageDailyRateVnd)}
          </p>
          <p className="mt-2 text-sm text-emerald-600 font-medium">YoY +15%</p>
        </div>
      </section>

      {/* Recent Bookings Table */}
      <section className="overflow-hidden rounded-2xl border border-vio-border-cream/30 bg-white shadow-sm">
        <div className="border-b border-vio-border-cream/30 px-6 py-5 md:px-7">
          <h2 className="font-cormorant text-3xl md:text-4xl font-normal tracking-tight text-vio-near-black">
            Recent Bookings
          </h2>
          <p className="mt-1 text-sm text-vio-stone-gray">
            Synced from booking API. Ready for DB migration.
          </p>
        </div>

        <div className="p-5 md:p-7">
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-vio-terracotta border-t-transparent" />
              <p className="mt-2 text-sm text-vio-stone-gray">Loading bookings...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-vio-border-cream/50">
                  <thead className="sticky top-0 bg-vio-ivory/50 backdrop-blur-sm">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-vio-stone-gray">
                        ID
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-vio-stone-gray">
                        Guest
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-vio-stone-gray">
                        Room
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-vio-stone-gray">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-vio-stone-gray">
                        Update
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-vio-stone-gray">
                        Check-in
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-[0.12em] text-vio-stone-gray">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-vio-border-cream/20">
                    {paginatedBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-vio-parchment/30 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-vio-near-black max-w-[140px] truncate">
                          {booking.id}
                        </td>
                        <td className="px-4 py-4 text-sm text-vio-near-black">
                          {booking.customerName}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-vio-near-black">
                          {booking.roomName}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              'inline-flex px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset',
                              toBadgeStatus(booking.status) === 'confirmed' && 'bg-emerald-100 text-emerald-800 ring-emerald-200',
                              toBadgeStatus(booking.status) === 'pending' && 'bg-amber-100 text-amber-800 ring-amber-200',
                              toBadgeStatus(booking.status) === 'cancelled' && 'bg-red-100 text-red-800 ring-red-200',
                            )}
                          >
                            {statusLabels[booking.status]}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value as BookingStatus)}
  className="rounded-full border border-vio-border-cream/50 bg-vio-ivory px-3 py-1.5 text-xs font-medium text-vio-near-black focus:border-vio-terracotta focus:outline-none focus:ring-1 focus:ring-vio-terracotta transition-colors"
                            aria-label="Update booking status"
                          >
                            {Object.entries(statusLabels).map(([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-sm text-vio-stone-gray">
                          {new Date(booking.checkIn).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-vio-near-black">
                          {formatCurrency(booking.totalVnd)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-2 text-xs font-medium rounded-lg border border-vio-border-cream/50 bg-white disabled:opacity-50 hover:bg-vio-parchment transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm font-medium text-vio-stone-gray">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-2 text-xs font-medium rounded-lg border border-vio-border-cream/50 bg-white disabled:opacity-50 hover:bg-vio-parchment transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
              {paginatedBookings.length === 0 && !loading && (
                <div className="py-12 text-center">
                  <p className="text-sm text-vio-stone-gray">No bookings available.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

