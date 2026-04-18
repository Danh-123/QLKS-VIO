import { useMemo, useState } from 'react'
import type { BookingStatus } from '../../../types/booking'
import { LuxuryPagination, LuxuryTable, type LuxuryColumn } from '../../components/ui/LuxuryTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Card } from '../../components/ui/Card'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import { cn } from '../../lib/cn'

const PAGE_SIZE = 6

const statusLabels: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'checked-in': 'Checked In',
  'checked-out': 'Checked Out',
  cancelled: 'Cancelled',
  'no-show': 'No Show',
}

type BookingRow = {
  id: string
  guest: string
  room: string
  checkIn: string
  total: string
  status: BookingStatus
}

function toBadgeStatus(status: BookingStatus): 'confirmed' | 'pending' | 'cancelled' {
  if (status === 'confirmed' || status === 'checked-in' || status === 'checked-out') {
    return 'confirmed'
  }

  if (status === 'cancelled' || status === 'no-show') {
    return 'cancelled'
  }

  return 'pending'
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value / 25_000)
}

function StatTile({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <Card goldBorder className="p-6">
      <p className="text-xs uppercase tracking-[0.1em] text-vio-text-secondary">
        {label}
      </p>
      <p className="mt-3 font-heading text-5xl font-normal leading-none text-vio-navy">
        {value}
      </p>
      <p className="mt-3 text-xs text-vio-text-secondary">{hint}</p>
    </Card>
  )
}

export function AdminDashboardPage() {
  const [page, setPage] = useState(1)
  const { bookings, metrics, loading, error, reload, updateBookingStatus } = useAdminDashboard()

  const rows = useMemo<BookingRow[]>(
    () =>
      bookings.map((booking) => ({
        id: booking.id,
        guest: booking.guest,
        room: booking.room,
        checkIn: booking.checkIn,
        total: formatCurrency(booking.totalVnd),
        status: booking.status,
      })),
    [bookings],
  )

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageRows = rows.slice(pageStart, pageStart + PAGE_SIZE)

  const columns: LuxuryColumn<BookingRow>[] = [
    { header: 'Booking ID', accessorKey: 'id', className: 'font-medium' },
    { header: 'Guest', accessorKey: 'guest' },
    { header: 'Room', accessorKey: 'room' },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row) => <StatusBadge status={toBadgeStatus(row.status)} />,
    },
    {
      header: 'Update',
      accessorKey: 'update',
      render: (row) => (
        <select
          value={row.status}
          onChange={(event) =>
            updateBookingStatus(row.id, event.target.value as BookingStatus)
          }
          className="rounded-full border border-vio-linen bg-vio-white px-3 py-1.5 text-xs text-vio-text-primary"
        >
          {Object.keys(statusLabels).map((status) => (
            <option key={status} value={status}>
              {statusLabels[status as BookingStatus]}
            </option>
          ))}
        </select>
      ),
    },
    { header: 'Check-in', accessorKey: 'checkIn' },
    { header: 'Total', accessorKey: 'total', align: 'right' },
  ]

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="h-[280px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-vio-navy/80 via-vio-navy/55 to-vio-navy/20" />

        <div className="absolute inset-0 flex items-end p-8 md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-vio-gold">Admin Suite</p>
            <h1 className="mt-3 font-heading text-5xl font-normal text-vio-white md:text-6xl">
              Hotel Operations
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-vio-white/80 md:text-base">
              One control center for reservations, occupancy, and guest experience quality.
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <div
          className={cn(
            'rounded-lg border border-vio-error/30 bg-vio-error/5 px-4 py-3 text-sm text-vio-error',
            'flex items-center justify-between gap-4',
          )}
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={reload}
            className="rounded-md border border-vio-error/40 px-3 py-1.5 text-xs transition-colors hover:bg-vio-error/10"
          >
            Retry
          </button>
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total Revenue"
          value={formatCurrency(metrics.totalRevenueVnd)}
          hint="Live total from booking API"
        />
        <StatTile
          label="Occupancy Rate"
          value={`${metrics.occupancyRate}%`}
          hint="Based on room status API"
        />
        <StatTile
          label="Active Bookings"
          value={String(metrics.activeBookings)}
          hint="Pending + confirmed + checked-in"
        />
        <StatTile
          label="Average Daily Rate"
          value={formatCurrency(metrics.averageDailyRateVnd)}
          hint="Average value per active booking"
        />
      </section>

      <Card className="p-0">
        <div className="border-b border-vio-linen p-6">
          <h2 className="font-heading text-4xl font-normal text-vio-navy">Recent Bookings</h2>
          <p className="mt-2 text-sm text-vio-text-secondary">
            Synced data feed prepared for external API switch.
          </p>
        </div>

        <div className="p-6 pt-2">
          <LuxuryTable
            columns={columns}
            data={pageRows}
            loading={loading}
            rowKey={(row) => row.id}
            emptyMessage="No bookings available."
          />
          <LuxuryPagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  )
}
