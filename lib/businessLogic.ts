import type { Booking, BookingStatus } from '../types/booking'

type PricedRoom = {
  basePriceVnd: number
}

const activeStatuses: BookingStatus[] = ['pending', 'confirmed', 'checked-in']

export function isValidDateRange(checkIn: string, checkOut: string) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false
  }

  return end.getTime() > start.getTime()
}

function rangesOverlap(
  leftStart: string,
  leftEnd: string,
  rightStart: string,
  rightEnd: string,
) {
  return new Date(leftStart) < new Date(rightEnd) && new Date(leftEnd) > new Date(rightStart)
}

export function isRoomAvailable(
  roomId: string,
  checkIn: string,
  checkOut: string,
  bookings: Booking[],
) {
  return bookings.every((booking) => {
    if (booking.roomId !== roomId) return true
    if (!activeStatuses.includes(booking.status)) return true
    return !rangesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut)
  })
}

export function calculatePricing(room: PricedRoom, checkIn: string, checkOut: string) {
  const oneDay = 24 * 60 * 60 * 1000
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / oneDay))
  const subtotal = room.basePriceVnd * nights
  const serviceFee = Math.round(subtotal * 0.08)
  const total = subtotal + serviceFee

  return {
    nights,
    subtotal,
    serviceFee,
    total,
  }
}
