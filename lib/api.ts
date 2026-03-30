import type { Booking } from '../types/booking'
import type { Room } from '../types/room'
import type { User } from '../types/user'

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}

export async function fetchRooms() {
  const res = await fetch('/api/rooms', { cache: 'no-store' })
  return parseJson<Room[]>(res)
}

export async function fetchBookings() {
  const res = await fetch('/api/bookings', { cache: 'no-store' })
  return parseJson<Booking[]>(res)
}

export async function fetchUsers() {
  const res = await fetch('/api/users', { cache: 'no-store' })
  return parseJson<User[]>(res)
}
