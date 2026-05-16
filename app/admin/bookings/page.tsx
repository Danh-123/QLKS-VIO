"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { bookingApi, roomApi, userApi } from '../../../lib/api'
import { getStoredUser } from '../../../hooks/useAuth'
import { Button } from '../../../legacy/components/ui/Button'
import { Card } from '../../../legacy/components/ui/Card'

const bookingStatusOptions = ['confirmed', 'cancelled'] as const
const filterStatusOptions = ['all', ...bookingStatusOptions] as const

type BookingStatus = (typeof bookingStatusOptions)[number]
type FilterStatus = (typeof filterStatusOptions)[number]

type BookingRow = {
  id: string
  userId?: string
  user_id?: string
  roomId?: string
  room_id?: string
  checkIn?: string
  check_in?: string
  checkOut?: string
  check_out?: string
  totalAmount?: number
  totalPrice?: number
  totalVnd?: number
  status?: string
  createdAt?: string
}

type RoomRow = {
  id: string
  name?: string
  image?: string
  status?: string
}

type UserRow = {
  id: string
  fullName?: string
  name?: string
  email?: string
}

type BookingViewRow = BookingRow & {
  roomName: string
  roomImage?: string
  guestName: string
  guestEmail?: string
  roomStatus?: string
}

function formatDate(value?: string) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function formatVnd(value?: number) {
  return `${new Intl.NumberFormat('vi-VN').format(value || 0)} ₫`
}

function buildDateSearchValue(booking: BookingViewRow) {
  return [booking.checkIn, booking.checkOut]
    .filter(Boolean)
    .map((item) => (item ? item.slice(0, 10) : ''))
    .join(' ')
}

function statusLabel(status?: string) {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return status || 'Chờ xử lý'
  }
}

function getBookingRoomId(booking: BookingRow) {
  return booking.roomId || booking.room_id || ''
}

function getBookingUserId(booking: BookingRow) {
  return booking.userId || booking.user_id || ''
}

function getBookingCheckIn(booking: BookingRow) {
  return booking.checkIn || booking.check_in || ''
}

function getBookingCheckOut(booking: BookingRow) {
  return booking.checkOut || booking.check_out || ''
}

function getBookingTotalAmount(booking: BookingRow) {
  return booking.totalAmount || booking.totalPrice || booking.totalVnd || 0
}

async function safeGetRoom(roomId: string) {
  if (!roomId) return null
  try {
    return (await roomApi.getById(roomId)) as RoomRow | null
  } catch {
    return null
  }
}

async function safeGetUser(userId: string) {
  if (!userId) return null
  try {
    return (await userApi.getById(userId)) as UserRow | null
  } catch {
    return null
  }
}

export default function AdminBookingsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [rows, setRows] = useState<BookingViewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [dateFilter, setDateFilter] = useState('')

  const loadBookings = useCallback(async () => {
    setLoading(true)
    setPageError(null)

    try {
      const bookings = (await bookingApi.getAll()) as BookingRow[]
      const enriched = await Promise.all(
        bookings.map(async (booking) => {
          const roomId = getBookingRoomId(booking)
          const userId = getBookingUserId(booking)

          const [room, user] = await Promise.all([
            safeGetRoom(roomId),
            safeGetUser(userId),
          ])

          return {
            ...booking,
            roomId,
            userId,
            checkIn: getBookingCheckIn(booking),
            checkOut: getBookingCheckOut(booking),
            totalAmount: getBookingTotalAmount(booking),
            roomName: room?.name || roomId || 'Unknown room',
            roomImage: room?.image,
            guestName: user?.fullName || user?.name || user?.email || userId || 'Unknown guest',
            guestEmail: user?.email,
            roomStatus: room?.status,
          }
        }),
      )

      setRows(enriched)
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Không thể tải danh sách đặt phòng.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const user = getStoredUser()

    if (!user) {
      router.replace('/login?reason=auth&redirect=/admin/bookings')
      return
    }

    if (user.role !== 'admin') {
      router.replace('/login?reason=auth&redirect=/admin/bookings')
      return
    }

    void loadBookings()
  }, [loadBookings, pathname, router])

  const filteredRows = useMemo(() => {
    return rows.filter((booking) => {
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      const matchesDate = !dateFilter || buildDateSearchValue(booking).includes(dateFilter)
      return matchesStatus && matchesDate
    })
  }, [dateFilter, rows, statusFilter])

  const handleStatusChange = async (booking: BookingViewRow, newStatus: BookingStatus) => {
    setSavingId(booking.id)
    setPageError(null)

    try {
      await bookingApi.updateStatus(booking.id, newStatus)

      if (newStatus === 'cancelled' && booking.roomId) {
        await roomApi.update(booking.roomId, { status: 'available' })
      }

      await loadBookings()
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái đặt phòng.')
    } finally {
      setSavingId(null)
    }
  }

  const handleDeleteBooking = async (booking: BookingViewRow) => {
    if (!confirm('Bạn có chắc muốn xóa booking này không?')) return
    setSavingId(booking.id)
    setPageError(null)

    try {
      await bookingApi.delete(booking.id)

      if (booking.roomId) {
        await roomApi.update(booking.roomId, { status: 'available' })
      }

      await loadBookings()
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Không thể xóa booking.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="w-full">
      <p className="mb-6 max-w-2xl text-sm leading-7 text-vio-navy/55">
        Theo dõi toàn bộ booking của hệ thống, xem tên phòng và tên khách, đồng thời thay đổi trạng thái trực tiếp.
      </p>

      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-vio-navy/10 bg-white p-4 shadow-soft md:flex-row md:items-end md:p-6">
        <div className="flex-1">
          <label htmlFor="status-filter" className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45">
            Lọc theo trạng thái
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as FilterStatus)}
            className="w-full rounded-2xl border border-vio-navy/10 bg-vio-white px-4 py-3 text-sm text-vio-navy outline-none focus:border-vio-navy/30"
          >
            {filterStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? 'Tất cả' : statusLabel(option)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="date-filter" className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45">
            Lọc theo ngày
          </label>
          <input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="w-full rounded-2xl border border-vio-navy/10 bg-vio-white px-4 py-3 text-sm text-vio-navy outline-none focus:border-vio-navy/30"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setStatusFilter('all')
            setDateFilter('')
          }}
          className="w-full md:w-auto"
        >
          Xóa bộ lọc
        </Button>
      </div>

      {pageError ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-[1.5rem] border border-vio-navy/10 bg-white shadow-soft" />
          ))}
        </div>
      ) : null}

      {!loading ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:hidden">
            {filteredRows.map((booking) => (
              <Card key={booking.id} className="flex h-full flex-col overflow-hidden p-0">
                <div className="relative aspect-[4/3] bg-vio-sand/30">
                  {booking.roomImage ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${booking.roomImage})` }}
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-heading text-2xl text-vio-navy">{booking.roomName}</h2>
                        <p className="mt-1 text-sm text-vio-navy/45">Khách: {booking.guestName}</p>
                      </div>
                      <span className="rounded-full bg-vio-navy/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-vio-navy">
                        {statusLabel(booking.status)}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-vio-navy/60">
                      <p>Ngày nhận: {formatDate(booking.checkIn)}</p>
                      <p>Ngày trả: {formatDate(booking.checkOut)}</p>
                      <p>Tổng tiền: {formatVnd(booking.totalAmount)}</p>
                      {booking.guestEmail ? <p>Email: {booking.guestEmail}</p> : null}
                    </div>

                    <div>
                      <label htmlFor={`mobile-status-${booking.id}`} className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45">
                        Cập nhật trạng thái
                      </label>
                      <select
                        id={`mobile-status-${booking.id}`}
                        value={(booking.status as BookingStatus) || 'confirmed'}
                        disabled={savingId === booking.id}
                        onChange={(event) => handleStatusChange(booking, event.target.value as BookingStatus)}
                        className="w-full rounded-2xl border border-vio-navy/10 bg-vio-white px-4 py-3 text-sm text-vio-navy outline-none focus:border-vio-navy/30 disabled:opacity-60"
                      >
                        {bookingStatusOptions.map((option) => (
                          <option key={option} value={option}>
                            {statusLabel(option)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 hidden overflow-hidden rounded-[1.5rem] border border-vio-navy/10 bg-white shadow-soft lg:block">
            <table className="w-full border-collapse text-left">
              <thead className="bg-vio-sand/30 text-xs uppercase tracking-[0.2em] text-vio-navy/45">
                <tr>
                  <th className="px-5 py-4">Tên phòng</th>
                  <th className="px-5 py-4">Tên khách</th>
                  <th className="px-5 py-4">Ngày nhận / trả</th>
                  <th className="px-5 py-4">Tổng tiền</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((booking) => (
                  <tr key={booking.id} className="border-t border-vio-navy/8 align-top">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-vio-sand/30">
                          {booking.roomImage ? (
                            <div
                              className="h-full w-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${booking.roomImage})` }}
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-medium text-vio-navy">{booking.roomName}</p>
                          <p className="text-sm text-vio-navy/45">ID: {booking.roomId || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-vio-navy/70">
                      <div className="space-y-1">
                        <p>{booking.guestName}</p>
                        {booking.guestEmail ? <p className="text-vio-navy/45">{booking.guestEmail}</p> : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-vio-navy/70">
                      <div className="space-y-1">
                        <p>Nhận: {formatDate(booking.checkIn)}</p>
                        <p>Trả: {formatDate(booking.checkOut)}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-vio-navy/70">{formatVnd(booking.totalAmount)}</td>
                    <td className="px-5 py-4">
                      <div className="space-y-3">
                        <span className="inline-flex rounded-full bg-vio-navy/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-vio-navy">
                          {statusLabel(booking.status)}
                        </span>
                        <select
                          value={(booking.status as BookingStatus) || 'confirmed'}
                          disabled={savingId === booking.id}
                          onChange={(event) => handleStatusChange(booking, event.target.value as BookingStatus)}
                          className="w-full rounded-2xl border border-vio-navy/10 bg-vio-white px-4 py-3 text-sm text-vio-navy outline-none focus:border-vio-navy/30 disabled:opacity-60"
                        >
                          {bookingStatusOptions.map((option) => (
                            <option key={option} value={option}>
                              {statusLabel(option)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={() => booking.roomId && router.push(`/rooms/${booking.roomId}`)}>
                          Xem
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => handleDeleteBooking(booking)} className="text-red-600">
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRows.length === 0 ? (
            <div className="mt-8 rounded-[1.5rem] border border-dashed border-vio-navy/15 bg-white px-6 py-10 text-center text-sm text-vio-navy/55 shadow-soft">
              Không có booking nào phù hợp bộ lọc hiện tại.
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
