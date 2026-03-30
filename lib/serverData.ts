import { bookingsSeed, roomsSeed, usersSeed } from './mockData'
import type { Booking, BookingStatus } from '../types/booking'
import type { Room } from '../types/room'
import type { User } from '../types/user'

const roomsDb: Room[] = [...roomsSeed]
let bookingsDb: Booking[] = [...bookingsSeed]
const usersDb: User[] = [...usersSeed]

export function listRooms() {
  return roomsDb
}

export function findRoom(id: string) {
  return roomsDb.find((room) => room.id === id)
}

export function listBookings() {
  return bookingsDb
}

export function addBooking(booking: Booking) {
  bookingsDb = [booking, ...bookingsDb]
  return booking
}

export function updateBookingStatusById(id: string, status: BookingStatus) {
  let updated: Booking | null = null
  bookingsDb = bookingsDb.map((booking) => {
    if (booking.id !== id) return booking
    updated = { ...booking, status }
    return updated
  })
  return updated
}

export function listUsers() {
  return usersDb
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
