import { NextResponse } from 'next/server'
import { calculatePricing, isRoomAvailable, isValidDateRange } from '../../../lib/businessLogic'
import { addBooking, findRoom, listBookings, sleep } from '../../../lib/serverData'
import type { Booking } from '../../../types/booking'

export async function GET() {
  await sleep(500)
  return NextResponse.json(listBookings())
}

type CreateBookingRequest = {
  roomId: string
  customerId: string
  customerName: string
  checkIn: string
  checkOut: string
  guests: number
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateBookingRequest

  if (!isValidDateRange(body.checkIn, body.checkOut)) {
    return NextResponse.json(
      { message: 'Invalid date range' },
      { status: 400 },
    )
  }

  const room = findRoom(body.roomId)
  if (!room) {
    return NextResponse.json({ message: 'Room not found' }, { status: 404 })
  }

  const existing = listBookings()
  if (!isRoomAvailable(body.roomId, body.checkIn, body.checkOut, existing)) {
    return NextResponse.json(
      { message: 'Room is not available for selected dates' },
      { status: 409 },
    )
  }

  const pricing = calculatePricing(room, body.checkIn, body.checkOut)

  const next: Booking = {
    id: `vio-${Date.now()}`,
    roomId: room.id,
    roomName: room.name,
    customerId: body.customerId,
    customerName: body.customerName,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    guests: Math.max(1, body.guests || 1),
    totalVnd: pricing.total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  addBooking(next)
  await sleep(350)

  return NextResponse.json(next, { status: 201 })
}
