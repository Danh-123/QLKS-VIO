import type { BookingStatus, StoredBooking } from './types'
import { BOOKING_STORAGE_KEY } from './types'

function parse(raw: string | null): StoredBooking[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw) as unknown
    return Array.isArray(v) ? (v as StoredBooking[]) : []
  } catch {
    return []
  }
}

export function getBookings(): StoredBooking[] {
  if (typeof window === 'undefined') return []
  return parse(localStorage.getItem(BOOKING_STORAGE_KEY))
}

export function saveBookings(list: StoredBooking[]) {
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(list))
}

export function addBooking(b: StoredBooking) {
  const list = getBookings()
  saveBookings([b, ...list])
}

const demoBookings: StoredBooking[] = [
  {
    id: 'vio-demo-1',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    roomId: 'ocean-suite',
    roomName: 'Suite Hướng biển',
    checkIn: '2025-04-02',
    checkOut: '2025-04-05',
    guests: 2,
    status: 'checked-out',
    totalVnd: 14400000,
  },
  {
    id: 'vio-demo-2',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    roomId: 'garden-villa',
    roomName: 'Villa Vườn',
    checkIn: '2025-05-10',
    checkOut: '2025-05-14',
    guests: 4,
    status: 'confirmed',
    totalVnd: 32800000,
  },
  {
    id: 'vio-demo-3',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    roomId: 'studio',
    roomName: 'Studio Signature',
    checkIn: '2025-03-28',
    checkOut: '2025-03-29',
    guests: 1,
    status: 'pending',
    totalVnd: 2400000,
  },
  {
    id: 'vio-demo-4',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    roomId: 'harbour',
    roomName: 'Phòng Cảng',
    checkIn: '2025-02-01',
    checkOut: '2025-02-03',
    guests: 2,
    status: 'cancelled',
    totalVnd: 5800000,
  },
  {
    id: 'vio-demo-5',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    roomId: 'sky-penthouse',
    roomName: 'Penthouse Trời',
    checkIn: '2025-04-18',
    checkOut: '2025-04-20',
    guests: 2,
    status: 'checked-in',
    totalVnd: 25000000,
  },
  {
    id: 'vio-demo-6',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    roomId: 'garden-deluxe',
    roomName: 'Deluxe Vườn',
    checkIn: '2025-01-15',
    checkOut: '2025-01-16',
    guests: 2,
    status: 'no-show',
    totalVnd: 3200000,
  },
]

const SEED_FLAG = 'vio_bookings_seeded_v1'

export function ensureDemoBookingsSeeded() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(SEED_FLAG)) return
  const existing = getBookings()
  if (existing.length === 0) {
    saveBookings(demoBookings)
  }
  localStorage.setItem(SEED_FLAG, '1')
}

export const statusLabels: Record<BookingStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  'checked-in': 'Đã nhận phòng',
  'checked-out': 'Đã trả phòng',
  cancelled: 'Đã hủy',
  'no-show': 'Không đến',
}
