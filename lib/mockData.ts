import type { Booking } from '../types/booking'
import type { Room } from '../types/room'
import type { User } from '../types/user'

export const roomsSeed: Room[] = [
  {
    id: 'ocean-suite',
    code: '201',
    name: 'Suite Huong bien',
    type: 'Suite',
    floor: 2,
    capacity: 3,
    pricePerNight: 4800000,
    description: 'Ban cong rieng, view vinh.',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e54d66?auto=format&fit=crop&w=1200&q=80',
    status: 'available',
  },
  {
    id: 'garden-villa',
    code: 'V-01',
    name: 'Villa Vuon',
    type: 'Villa',
    floor: 1,
    capacity: 6,
    pricePerNight: 8200000,
    description: 'Ho boi rieng va khong gian gia dinh.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    status: 'occupied',
  },
  {
    id: 'studio',
    code: '104',
    name: 'Studio Signature',
    type: 'Standard',
    floor: 1,
    capacity: 2,
    pricePerNight: 2400000,
    description: 'Thiet ke mo, gon gang, hien dai.',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    status: 'dirty',
  },
]

export const usersSeed: User[] = [
  { id: 'u1', name: 'Nguyen Lan', email: 'lan@email.com', tier: 'Gold', stays: 12 },
  { id: 'u2', name: 'James Cole', email: 'j.cole@email.com', tier: 'Platinum', stays: 28 },
]

export const bookingsSeed: Booking[] = [
  {
    id: 'vio-9001',
    roomId: 'ocean-suite',
    roomName: 'Suite Huong bien',
    customerId: 'u1',
    customerName: 'Nguyen Lan',
    checkIn: '2026-04-02',
    checkOut: '2026-04-05',
    guests: 2,
    totalVnd: 15552000,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'vio-9002',
    roomId: 'garden-villa',
    roomName: 'Villa Vuon',
    customerId: 'u2',
    customerName: 'James Cole',
    checkIn: '2026-04-03',
    checkOut: '2026-04-06',
    guests: 4,
    totalVnd: 26568000,
    status: 'checked-in',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]
