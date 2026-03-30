import type { Booking } from '../types/booking'
import type { Room } from '../types/room'
import { nightsBetween, todayIso } from './utils'

const activeStatuses = new Set(['pending', 'confirmed', 'checked-in'])

function toMillis(iso: string) {
  return new Date(`${iso}T12:00:00`).getTime()
}

export function isValidDateRange(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return false
  const ci = toMillis(checkIn)
  const co = toMillis(checkOut)
  const today = toMillis(todayIso())
  if (Number.isNaN(ci) || Number.isNaN(co) || Number.isNaN(today)) return false
  return ci >= today && co > ci
}

export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const aS = toMillis(aStart)
  const aE = toMillis(aEnd)
  const bS = toMillis(bStart)
  const bE = toMillis(bEnd)
  if ([aS, aE, bS, bE].some((v) => Number.isNaN(v))) return false
  return aS < bE && bS < aE
}

export function isRoomAvailable(
  roomId: string,
  checkIn: string,
  checkOut: string,
  bookings: Booking[],
) {
  if (!isValidDateRange(checkIn, checkOut)) return false
  return !bookings.some(
    (booking) =>
      booking.roomId === roomId &&
      activeStatuses.has(booking.status) &&
      rangesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut),
  )
}

export function calculatePricing(room: Room, checkIn: string, checkOut: string) {
  const nights = nightsBetween(checkIn, checkOut)
  const subtotal = room.pricePerNight * nights
  const serviceFee = Math.round(subtotal * 0.08)
  const total = subtotal + serviceFee
  return { nights, subtotal, serviceFee, total }
}
