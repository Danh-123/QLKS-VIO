import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { statusLabels } from '../booking/bookingStorage'
import type { BookingStatus, StoredBooking } from '../booking/types'
import { ScrollReveal } from '../components/guest/ScrollReveal'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Skeleton } from '../components/ui/Skeleton'
import { formatVnd } from '../data/roomDetails'
import { useFakeApiData } from '../lib/useFakeApiData'
import { cn } from '../lib/cn'
import { useAppData } from '../state/AppDataContext'

function statusStyle(s: BookingStatus) {
  switch (s) {
    case 'pending':
      return 'bg-vio-navy/8 text-vio-navy/70 ring-vio-navy/10'
    case 'confirmed':
      return 'bg-vio-gold/15 text-vio-navy ring-vio-gold/25'
    case 'checked-in':
      return 'bg-vio-navy/10 text-vio-navy ring-vio-navy/12'
    case 'checked-out':
      return 'bg-vio-white text-vio-navy/50 ring-vio-navy/10'
    case 'cancelled':
      return 'bg-vio-navy/5 text-vio-navy/45 line-through ring-vio-navy/8'
    case 'no-show':
      return 'bg-vio-navy/5 text-vio-navy/55 ring-vio-navy/8'
    default:
      return 'bg-vio-white ring-vio-navy/10'
  }
}

function BookingRow({ b }: { b: StoredBooking }) {
  return (
    <li>
      <Card className="flex flex-col gap-6 p-8 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-soft-2xl md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                'inline-flex rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ring-1',
                statusStyle(b.status),
              )}
            >
              {statusLabels[b.status]}
            </span>
            <span className="text-xs tracking-wide text-vio-navy/40">
              {b.id}
            </span>
          </div>
          <p className="mt-4 font-heading text-xl font-medium text-vio-navy md:text-2xl">
            {b.roomName}
          </p>
          <p className="mt-2 text-sm text-vio-navy/50">
            {b.checkIn} → {b.checkOut} · {b.guests} khách
          </p>
          {b.preferencesNote ? (
            <p className="mt-3 text-xs leading-relaxed text-vio-navy/40">
              {b.preferencesNote}
            </p>
          ) : null}
        </div>
        <div className="shrink-0 text-left md:text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-vio-navy/40">
            Tổng
          </p>
          <p className="mt-1 font-heading text-xl text-vio-navy">
            {formatVnd(b.totalVnd)}
          </p>
          <p className="mt-2 text-xs text-vio-navy/35">
            {new Date(b.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </Card>
    </li>
  )
}

export function BookingHistoryPage() {
  const navigate = useNavigate()
  const { bookings: list } = useAppData()

  const sorted = useMemo(
    () =>
      [...list].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [list],
  )

  const { loading, data: displayedBookings } = useFakeApiData(sorted, 900)

  return (
    <div className="vio-container vio-section">
      <ScrollReveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/40">
          VIO
        </p>
        <h1 className="mt-4 font-heading text-4xl font-medium leading-[1.12] tracking-wide text-vio-navy md:text-5xl">
          Lịch sử đặt phòng
        </h1>
        <p className="mt-6 text-base leading-[1.85] tracking-[0.02em] text-vio-navy/55">
          Trạng thái đặt chỗ của bạn — dữ liệu lưu cục bộ trên trình duyệt (demo).
        </p>
      </ScrollReveal>

      <div className="mt-10 flex items-center justify-center">
        {loading ? <LoadingSpinner label="Đang tải lịch sử đặt phòng..." /> : null}
      </div>

      <div className="mt-24 transition-opacity duration-300" style={{ opacity: loading ? 0.9 : 1 }}>
        {loading ? (
          <ul className="flex flex-col gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <li key={idx}>
                <Card className="p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-6 w-56" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="space-y-3 md:w-40 md:text-right">
                      <Skeleton className="ml-auto h-4 w-16" />
                      <Skeleton className="ml-auto h-6 w-28" />
                      <Skeleton className="ml-auto h-4 w-24" />
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : displayedBookings.length === 0 ? (
          <EmptyState
            className="p-10 text-center"
            title="Chưa có đặt phòng nào"
            description="Khi bạn hoàn tất một booking, lịch sử sẽ hiển thị tại đây."
            action={
              <Button
                type="button"
                onClick={() => navigate('/search')}
              >
                Bắt đầu đặt phòng
              </Button>
            }
          />
        ) : (
          <ul className="flex flex-col gap-8">
            {displayedBookings.map((b) => (
              <BookingRow key={b.id} b={b} />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-24 flex flex-wrap gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/rooms')}
        >
          Xem phòng
        </Button>
        <Button type="button" variant="ghost" onClick={() => navigate('/')}>
          Trang chủ
        </Button>
      </div>
    </div>
  )
}
