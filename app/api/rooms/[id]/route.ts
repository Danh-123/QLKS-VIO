import { NextResponse } from 'next/server'
import { findRoom, sleep } from '../../../../lib/serverData'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params
  await sleep(450)

  const room = findRoom(id)
  if (!room) {
    return NextResponse.json({ message: 'Room not found' }, { status: 404 })
  }

  return NextResponse.json(room)
}
