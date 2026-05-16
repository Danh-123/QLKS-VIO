"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { bookingApi, roomApi } from '../../../lib/api'
import { getStoredUser } from '../../../hooks/useAuth'
import { GuestAdminBackLink } from '../../components/GuestAdminBackLink'

type BookingRow = {
  id: string
  roomId?: string
  room_id?: string
  roomName?: string
  checkIn: string
  checkOut: string
  totalVnd?: number
  totalPrice?: number
  status: string
  createdAt?: string
}

type RoomRow = {
  id: string
  name?: string
  image?: string
}

function formatVnd(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value) + ' ₫'
}

function getBookingRoomId(booking: BookingRow) {
  return booking.roomId || booking.room_id || ''
}

export default function BookingHistoryPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [bookings, setBookings] = useState<Array<BookingRow & { room?: RoomRow }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBookings = useCallback(async () => {
    const user = getStoredUser()
    if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      const rows = (await bookingApi.getAll(user.id)) as BookingRow[]
      const enriched = await Promise.all(
        rows.map(async (booking) => {
          const roomId = getBookingRoomId(booking)
          let room: RoomRow | null = null
          if (roomId) {
            try {
              room = (await roomApi.getById(roomId)) as RoomRow | null
            } catch {
              room = null
            }
          }
          return {
            ...booking,
            roomId,
            room: room || undefined,
          }
        }),
      )

      setBookings(
        enriched.sort((a, b) => {
          const left = new Date(b.createdAt || b.checkIn).getTime()
          const right = new Date(a.createdAt || a.checkIn).getTime()
          return left - right
        }),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được lịch sử đặt phòng.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const user = getStoredUser()
    if (!user?.id) {
      router.replace('/login?reason=auth&redirect=/bookings/history')
      return
    }

    void loadBookings()
  }, [loadBookings, pathname, router])

  const empty = useMemo(() => !loading && !error && bookings.length === 0, [bookings.length, error, loading])

  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#f8f3e9_0%,#ffffff_45%,#f4eee0_100%)] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <GuestAdminBackLink />

        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/40">Bookings</p>
            <h1 className="mt-3 font-heading text-4xl font-medium text-vio-navy md:text-5xl">Lịch sử đặt phòng</h1>
            <p className="mt-3 text-sm leading-7 text-vio-navy/55">Danh sách booking của tài khoản đang đăng nhập.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center rounded-full border border-vio-navy/10 bg-white px-5 py-3 text-sm font-medium text-vio-navy shadow-soft transition-colors hover:border-vio-gold/40 hover:text-vio-gold"
          >
            Về trang chủ
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-56 animate-pulse rounded-[1.5rem] border border-vio-navy/10 bg-white p-5 shadow-soft" />
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
        ) : null}

        {empty ? (
          <div className="rounded-[1.5rem] border border-vio-navy/10 bg-white px-6 py-12 text-center shadow-soft">
            <h2 className="font-heading text-2xl text-vio-navy">Chưa có đặt phòng nào</h2>
            <p className="mt-3 text-sm text-vio-navy/55">Hãy quay lại trang phòng để tạo đặt chỗ đầu tiên.</p>
            <button
              type="button"
              onClick={() => router.push('/rooms')}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-vio-navy px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-vio-navy/90"
            >
              Xem phòng
            </button>
          </div>
        ) : null}

        {!loading && bookings.length > 0 ? (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <article key={booking.id} className="overflow-hidden rounded-[1.5rem] border border-vio-navy/10 bg-white shadow-soft">
                <div className="grid gap-0 md:grid-cols-[240px_1fr]">
                  <div className="relative min-h-56 bg-vio-sand/30">
                    {booking.room?.image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${booking.room.image})` }}
                      />
                    ) : null}
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-vio-navy/40">
                          {booking.room?.name || booking.roomName || 'Phòng'}
                        </p>
                        <h2 className="mt-2 font-heading text-2xl text-vio-navy">
                          {booking.room?.name || booking.roomName || 'Phòng'}
                        </h2>
                        <p className="mt-2 text-sm text-vio-navy/55">
                          {booking.checkIn} → {booking.checkOut}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-vio-navy/35">Tổng tiền</p>
                        <p className="mt-1 font-heading text-2xl text-vio-navy">
                          {formatVnd(booking.totalVnd || booking.totalPrice || 0)}
                        </p>
                        <span className="mt-3 inline-flex rounded-full bg-vio-navy/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-vio-navy">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
