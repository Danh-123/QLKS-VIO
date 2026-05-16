import { rooms as legacyRooms, type RoomListing } from '../legacy/data/rooms'
import type { Booking, BookingStatus, StoredBooking } from '../types/booking'

type RoomStatus = 'available' | 'occupied' | 'dirty' | 'maintenance' | 'reserved'

export type ApiRoom = {
  id: string
  name: string
  description: string
  image: string
  priceFrom: string
  basePriceVnd: number
  status: RoomStatus
  /** Admin / form */
  type?: string
  capacity?: number
  price?: number
}

function formatPriceFromVnd(vnd: number): string {
  return `Từ ${new Intl.NumberFormat('vi-VN').format(vnd)} ₫ / đêm`
}

function normalizeRoomStatus(value: unknown): RoomStatus {
  const s = typeof value === 'string' ? value : ''
  if (s === 'available' || s === 'occupied' || s === 'dirty' || s === 'maintenance' || s === 'reserved') {
    return s
  }
  return 'available'
}

type UserRecord = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

const pricingById: Record<string, number> = {
  'ocean-suite': 4_800_000,
  'garden-villa': 8_200_000,
  'sky-penthouse': 12_500_000,
  'garden-deluxe': 3_200_000,
  harbour: 2_900_000,
  studio: 2_400_000,
}

const statusById: Record<string, RoomStatus> = {
  'ocean-suite': 'occupied',
  'garden-villa': 'occupied',
  'sky-penthouse': 'reserved',
  'garden-deluxe': 'available',
  harbour: 'maintenance',
  studio: 'available',
}

function guestsToCapacity(guests: RoomListing['guests']): number {
  if (typeof guests === 'number' && Number.isFinite(guests)) return Math.max(1, guests)
  if (typeof guests === 'string') {
    const n = Number.parseInt(guests, 10)
    if (Number.isFinite(n)) return Math.max(1, n)
  }
  return 2
}

/** Mutable copy — CRUD qua API Next.js (không phụ thuộc json-server POST). */
const roomsMutable: ApiRoom[] = legacyRooms.map((room) => {
  const basePriceVnd = pricingById[room.id] ?? 3_500_000

  return {
    id: room.id,
    name: room.name,
    description: room.description,
    image: room.image,
    priceFrom: room.priceFrom,
    basePriceVnd,
    status: statusById[room.id] ?? 'available',
    type: 'Deluxe',
    capacity: guestsToCapacity(room.guests),
    price: basePriceVnd,
  }
})

const demoBookings: StoredBooking[] = [
  {
    id: 'vio-demo-1',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    customerName: 'Nguyễn Minh An',
    roomId: 'ocean-suite',
    roomName: 'Suite Hướng biển',
    checkIn: '2026-04-02',
    checkOut: '2026-04-05',
    guests: 2,
    status: 'checked-out',
    totalVnd: 14_400_000,
  },
  {
    id: 'vio-demo-2',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    customerName: 'Trần Hải Đăng',
    roomId: 'garden-villa',
    roomName: 'Villa Vườn',
    checkIn: '2026-05-12',
    checkOut: '2026-05-16',
    guests: 4,
    status: 'confirmed',
    totalVnd: 32_800_000,
  },
  {
    id: 'vio-demo-3',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customerName: 'Lê Thu Hà',
    roomId: 'studio',
    roomName: 'Studio Signature',
    checkIn: '2026-05-14',
    checkOut: '2026-05-15',
    guests: 1,
    status: 'pending',
    totalVnd: 2_400_000,
  },
  {
    id: 'vio-demo-4',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    customerName: 'Phạm Quốc Bảo',
    roomId: 'harbour',
    roomName: 'Phòng Cảng',
    checkIn: '2026-02-01',
    checkOut: '2026-02-03',
    guests: 2,
    status: 'cancelled',
    totalVnd: 5_800_000,
  },
  {
    id: 'vio-demo-5',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    customerName: 'Hoàng Lan Chi',
    roomId: 'sky-penthouse',
    roomName: 'Penthouse Trời',
    checkIn: '2026-05-10',
    checkOut: '2026-05-14',
    guests: 2,
    status: 'checked-in',
    totalVnd: 25_000_000,
  },
  {
    id: 'vio-demo-6',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    customerName: 'Đỗ Văn Khoa',
    roomId: 'garden-deluxe',
    roomName: 'Deluxe Vườn',
    checkIn: '2026-01-15',
    checkOut: '2026-01-16',
    guests: 2,
    status: 'no-show',
    totalVnd: 3_200_000,
  },
  {
    id: 'vio-demo-7',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    customerName: 'Sarah Chen',
    roomId: 'garden-deluxe',
    roomName: 'Deluxe Vườn',
    checkIn: '2026-05-14',
    checkOut: '2026-05-18',
    guests: 2,
    status: 'confirmed',
    totalVnd: 12_800_000,
  },
]

const bookings: StoredBooking[] = [...demoBookings]

const demoUsers: UserRecord[] = [
  { id: 'usr-admin-1', name: 'Quản trị VIO', email: 'admin@viohotel.com', role: 'admin' },
  { id: 'usr-user-1', name: 'Khách VIO', email: 'guest@viohotel.com', role: 'user' },
  { id: 'usr-user-2', name: 'Mai Hương', email: 'mai@example.com', role: 'user' },
]

export function sleep(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

export function listRooms() {
  return roomsMutable.map((room) => ({ ...room }))
}

export function findRoom(id: string) {
  return roomsMutable.find((room) => room.id === id) ?? null
}

export function createRoom(input: Record<string, unknown>): ApiRoom | { error: string } {
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  if (!name) {
    return { error: 'Thiếu tên phòng.' }
  }

  const type = typeof input.type === 'string' ? input.type.trim() || 'Deluxe' : 'Deluxe'
  const description = typeof input.description === 'string' ? input.description.trim() : ''
  const image = typeof input.image === 'string' ? input.image.trim() : ''

  const basePriceVnd =
    typeof input.basePriceVnd === 'number' && Number.isFinite(input.basePriceVnd)
      ? Math.max(0, input.basePriceVnd)
      : typeof input.price === 'number' && Number.isFinite(input.price)
        ? Math.max(0, input.price)
        : 0

  const capacityRaw = input.capacity
  const capacity =
    typeof capacityRaw === 'number' && Number.isFinite(capacityRaw)
      ? Math.max(1, Math.floor(capacityRaw))
      : typeof capacityRaw === 'string'
        ? Math.max(1, Math.floor(Number.parseInt(capacityRaw, 10)) || 1)
        : 2

  const status = normalizeRoomStatus(input.status)

  const id = `vio-room-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const room: ApiRoom = {
    id,
    name,
    description,
    image,
    priceFrom: formatPriceFromVnd(basePriceVnd),
    basePriceVnd,
    status,
    type,
    capacity,
    price: basePriceVnd,
  }

  roomsMutable.unshift(room)
  return room
}

export function updateRoom(id: string, input: Record<string, unknown>): ApiRoom | null | { error: string } {
  const index = roomsMutable.findIndex((room) => room.id === id)
  if (index === -1) return null

  const current = roomsMutable[index]

  const name = typeof input.name === 'string' ? input.name.trim() : current.name
  if (!name) {
    return { error: 'Tên phòng không hợp lệ.' }
  }

  const type = typeof input.type === 'string' ? input.type.trim() || current.type || 'Deluxe' : current.type || 'Deluxe'
  const description = typeof input.description === 'string' ? input.description.trim() : current.description
  const image = typeof input.image === 'string' ? input.image.trim() : current.image

  let basePriceVnd = current.basePriceVnd
  if (typeof input.basePriceVnd === 'number' && Number.isFinite(input.basePriceVnd)) {
    basePriceVnd = Math.max(0, input.basePriceVnd)
  } else if (typeof input.price === 'number' && Number.isFinite(input.price)) {
    basePriceVnd = Math.max(0, input.price)
  }

  const capacityRaw = input.capacity
  let capacity = current.capacity ?? 2
  if (typeof capacityRaw === 'number' && Number.isFinite(capacityRaw)) {
    capacity = Math.max(1, Math.floor(capacityRaw))
  } else if (typeof capacityRaw === 'string') {
    capacity = Math.max(1, Math.floor(Number.parseInt(capacityRaw, 10)) || 1)
  }

  const status = input.status !== undefined ? normalizeRoomStatus(input.status) : current.status

  const next: ApiRoom = {
    ...current,
    id: current.id,
    name,
    type,
    description,
    image,
    basePriceVnd,
    priceFrom: formatPriceFromVnd(basePriceVnd),
    price: basePriceVnd,
    capacity,
    status,
  }

  roomsMutable[index] = next
  return next
}

export function deleteRoom(id: string): boolean {
  const index = roomsMutable.findIndex((room) => room.id === id)
  if (index === -1) return false
  roomsMutable.splice(index, 1)
  return true
}

export function listBookings() {
  return bookings.map((booking) => ({ ...booking }))
}

export function addBooking(booking: Booking) {
  bookings.unshift({ ...booking })
}

export function updateBookingStatusById(id: string, status: BookingStatus) {
  const index = bookings.findIndex((booking) => booking.id === id)
  if (index === -1) return null

  bookings[index] = {
    ...bookings[index],
    status,
  }

  return { ...bookings[index] }
}

export function listUsers() {
  return demoUsers.map((user) => ({ ...user }))
}
