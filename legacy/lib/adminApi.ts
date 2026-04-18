import type { BookingStatus } from '../../types/booking'

export type AdminBooking = {
  id: string
  guest: string
  room: string
  checkIn: string
  totalVnd: number
  status: BookingStatus
}

export type AdminOverviewMetrics = {
  totalRevenueVnd: number
  occupancyRate: number
  activeBookings: number
  averageDailyRateVnd: number
}

function getApiBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL?.trim()
  if (!raw) return ''
  return raw.replace(/\/+$/, '')
}

function getAuthHeaders() {
  if (typeof window === 'undefined') return {} as Record<string, string>
  const token = localStorage.getItem('vio_auth_token')
  if (!token) return {} as Record<string, string>
  return {
    Authorization: `Bearer ${token}`,
  } as Record<string, string>
}

function buildUrl(path: string) {
  const base = getApiBaseUrl()
  if (!base) return `/api${path}`
  return `${base}${path}`
}

function parseStatus(value: unknown): BookingStatus {
  const valid: BookingStatus[] = [
    'pending',
    'confirmed',
    'checked-in',
    'checked-out',
    'cancelled',
    'no-show',
  ]

  if (typeof value === 'string' && valid.includes(value as BookingStatus)) {
    return value as BookingStatus
  }

  return 'pending'
}

function normalizeBooking(raw: Record<string, unknown>): AdminBooking {
  return {
    id: String(raw.id ?? raw.bookingId ?? ''),
    guest: String(raw.customerName ?? raw.guest ?? raw.customer ?? 'Walk-in guest'),
    room: String(raw.roomName ?? raw.room ?? raw.roomCode ?? 'Unknown room'),
    checkIn: String(raw.checkIn ?? raw.check_in ?? ''),
    totalVnd: Number(raw.totalVnd ?? raw.total ?? raw.totalAmount ?? 0),
    status: parseStatus(raw.status),
  }
}

export async function fetchAdminBookings() {
  const response = await fetch(buildUrl('/bookings'), {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error('Failed to load bookings from API')
  }

  const payload = (await response.json()) as Array<Record<string, unknown>>
  return payload.map(normalizeBooking)
}

export async function fetchAdminOverviewMetrics(bookings: AdminBooking[]): Promise<AdminOverviewMetrics> {
  const response = await fetch(buildUrl('/rooms'), {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error('Failed to load room metrics from API')
  }

  const rooms = (await response.json()) as Array<{ status?: string }>

  const totalRevenueVnd = bookings.reduce((sum, booking) => sum + booking.totalVnd, 0)
  const activeBookings = bookings.filter((booking) =>
    ['pending', 'confirmed', 'checked-in'].includes(booking.status),
  ).length

  const occupiedRooms = rooms.filter((room) => room.status === 'occupied').length
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 1000) / 10 : 0

  const averageDailyRateVnd = activeBookings > 0
    ? Math.round(totalRevenueVnd / activeBookings)
    : 0

  return {
    totalRevenueVnd,
    occupancyRate,
    activeBookings,
    averageDailyRateVnd,
  }
}

export async function patchBookingStatus(bookingId: string, status: BookingStatus) {
  const response = await fetch(buildUrl(`/bookings/${bookingId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('Failed to update booking status')
  }

  return (await response.json()) as Record<string, unknown>
}
