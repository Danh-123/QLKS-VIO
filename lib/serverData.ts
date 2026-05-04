import { rooms as legacyRooms } from '../legacy/data/rooms'
import type { Booking, BookingStatus, StoredBooking } from '../types/booking'

type RoomStatus = 'available' | 'occupied' | 'dirty' | 'maintenance' | 'reserved'

type ApiRoom = {
  id: string
  name: string
  description: string
  image: string
  priceFrom: string
  basePriceVnd: number
  status: RoomStatus
}

type UserRecord = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

const roomCatalog: ApiRoom[] = legacyRooms.map((room) => {
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

  return {
    id: room.id,
    name: room.name,
    description: room.description,
    image: room.image,
    priceFrom: room.priceFrom,
    basePriceVnd: pricingById[room.id] ?? 3_500_000,
    status: statusById[room.id] ?? 'available',
  }
})

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
    totalVnd: 14_400_000,
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
    totalVnd: 32_800_000,
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
    totalVnd: 2_400_000,
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
    totalVnd: 5_800_000,
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
    totalVnd: 25_000_000,
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
    totalVnd: 3_200_000,
  },
]

const bookings: StoredBooking[] = [...demoBookings]

const demoUsers: UserRecord[] = [
  { id: 'usr-admin-1', name: 'Aurelia Admin', email: 'admin@aurelia.com', role: 'admin' },
  { id: 'usr-user-1', name: 'Aurelia Guest', email: 'user@aurelia.com', role: 'user' },
  { id: 'usr-user-2', name: 'Mai Hương', email: 'mai@example.com', role: 'user' },
]

export function sleep(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

export function listRooms() {
  return roomCatalog.map((room) => ({ ...room }))
}

export function findRoom(id: string) {
  return roomCatalog.find((room) => room.id === id) ?? null
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
