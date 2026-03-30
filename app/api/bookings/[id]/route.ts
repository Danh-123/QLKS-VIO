import { NextResponse } from 'next/server'
import { sleep, updateBookingStatusById } from '../../../../lib/serverData'
import type { BookingStatus } from '../../../../types/booking'

type Params = {
  params: Promise<{ id: string }>
}

type PatchBody = {
  status: BookingStatus
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const body = (await request.json()) as PatchBody

  if (!body?.status) {
    return NextResponse.json({ message: 'Status is required' }, { status: 400 })
  }

  const updated = updateBookingStatusById(id, body.status)
  if (!updated) {
    return NextResponse.json({ message: 'Booking not found' }, { status: 404 })
  }

  await sleep(280)
  return NextResponse.json(updated)
}
