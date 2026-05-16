"use client"

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { bookingApi, roomApi } from '../../../lib/api'
import { getStoredUser } from '../../../hooks/useAuth'
import { GuestAdminBackLink } from '../../components/GuestAdminBackLink'

function formatVnd(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value) + ' ₫'
}

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 1
  const start = new Date(checkIn).getTime()
  const end = new Date(checkOut).getTime()
  const nights = Math.ceil((end - start) / 86400000)
  return Number.isFinite(nights) && nights > 0 ? nights : 1
}

type Room = {
  id: string
  name: string
  type?: string
  image?: string
  description?: string
  price?: number
  basePriceVnd?: number
  capacity?: number
  status?: string
}

export default function BookingRoomPage() {
  const params = useParams<{ roomId: string }>()
  const router = useRouter()
  const roomId = params?.roomId

  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  useEffect(() => {
    let active = true

    async function loadRoom() {
      if (!roomId) {
        setError('Thiếu roomId.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await roomApi.getById(roomId)
        if (!active) return

        if (!data) {
          setRoom(null)
          setError('Không tìm thấy phòng.')
          return
        }

        setRoom(data as Room)
      } catch (err) {
        if (!active) return
        setRoom(null)
        setError(err instanceof Error ? err.message : 'Không tải được thông tin phòng.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadRoom()

    return () => {
      active = false
    }
  }, [roomId])

  useEffect(() => {
    const user = getStoredUser()
    if (user || redirecting) return

    if (!roomId) return

    setRedirecting(true)
    router.replace(`/login?reason=auth&redirect=${encodeURIComponent(`/booking/${roomId}`)}`)
  }, [redirecting, roomId, router])

  const price = room?.basePriceVnd || room?.price || 0
  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut])
  const totalPrice = nights * price
  const capacity = room?.capacity || 2

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const user = getStoredUser()
    if (!user) {
      setError('Bạn cần đăng nhập trước khi đặt phòng.')
      router.replace(`/login?reason=auth&redirect=${encodeURIComponent(`/booking/${roomId || ''}`)}`)
      return
    }

    if (!roomId || !room) {
      setError('Phòng không hợp lệ.')
      return
    }

    if (!checkIn || !checkOut) {
      setError('Vui lòng chọn ngày nhận và ngày trả.')
      return
    }

    if (new Date(checkOut).getTime() <= new Date(checkIn).getTime()) {
      setError('Ngày trả phải sau ngày nhận.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const bookingPayload = {
        roomId,
        roomName: room.name,
        userId: user.id,
        customerName: user.name,
        checkIn,
        checkOut,
        totalPrice,
        totalVnd: totalPrice,
        guests,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      }

      const createdBooking = await bookingApi.create(bookingPayload)

      try {
        await roomApi.update(roomId, { status: 'occupied' })
      } catch (roomError) {
        if (createdBooking?.id) {
          try {
            await bookingApi.delete(createdBooking.id)
          } catch {
            // If rollback fails, keep the original error visible.
          }
        }
        throw roomError
      }

      router.replace('/bookings/history')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo booking. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#f8f3e9_0%,#ffffff_40%,#f5efe3_100%)] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <GuestAdminBackLink />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="overflow-hidden rounded-[2rem] border border-vio-navy/10 bg-white shadow-soft">
            <div className="relative aspect-[16/8] bg-vio-sand/30">
              {room?.image ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${room.image})` }}
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                <p className="text-xs uppercase tracking-[0.28em] text-white/75">Đặt phòng</p>
                <h1 className="mt-2 font-heading text-3xl md:text-5xl">{room?.name || 'Đang tải phòng...'}</h1>
                <p className="mt-2 text-sm text-white/80">{room?.type || 'Room'} · {capacity} khách</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {loading ? (
                <p className="text-sm text-vio-navy/60">Đang tải thông tin phòng...</p>
              ) : null}

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
                <label className="block md:col-span-1">
                  <span className="text-sm font-medium text-vio-navy/75">Ngày nhận</span>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-vio-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-vio-navy/30"
                    required
                  />
                </label>

                <label className="block md:col-span-1">
                  <span className="text-sm font-medium text-vio-navy/75">Ngày trả</span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-vio-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-vio-navy/30"
                    required
                  />
                </label>

                <label className="block md:col-span-1">
                  <span className="text-sm font-medium text-vio-navy/75">Số khách</span>
                  <input
                    type="number"
                    min={1}
                    max={capacity}
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
                    className="mt-2 w-full rounded-2xl border border-vio-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-vio-navy/30"
                  />
                </label>

                <div className="md:col-span-1" />

                <button
                  type="submit"
                  disabled={submitting || loading || !room}
                  className="md:col-span-2 mt-2 inline-flex items-center justify-center rounded-full bg-vio-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-vio-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Đang đặt phòng...' : 'Xác nhận đặt phòng'}
                </button>
              </form>
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] border border-vio-navy/10 bg-white p-6 shadow-soft md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-vio-navy/40">Tóm tắt</p>
            <h2 className="mt-3 font-heading text-2xl text-vio-navy">Chi tiết đặt phòng</h2>

            <div className="mt-6 space-y-4 text-sm text-vio-navy/70">
              <div className="flex items-center justify-between gap-4 border-b border-vio-navy/10 pb-3">
                <span>Phòng</span>
                <span className="font-medium text-vio-navy">{room?.name || '-'}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-vio-navy/10 pb-3">
                <span>Đơn giá / đêm</span>
                <span className="font-medium text-vio-navy">{formatVnd(price)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-vio-navy/10 pb-3">
                <span>Số đêm</span>
                <span className="font-medium text-vio-navy">{nights}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-vio-navy/10 pb-3">
                <span>Số khách</span>
                <span className="font-medium text-vio-navy">{guests}</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-vio-sand/35 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-vio-navy/45">Tổng tiền</p>
              <p className="mt-2 font-heading text-3xl text-vio-navy">{formatVnd(totalPrice)}</p>
              <p className="mt-2 text-xs leading-6 text-vio-navy/55">
                Số tiền được tính theo số đêm × giá phòng.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
