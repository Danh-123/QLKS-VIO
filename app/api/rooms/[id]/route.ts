import { NextResponse } from 'next/server'
import { deleteRoom, findRoom, sleep, updateRoom } from '../../../../lib/serverData'

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

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  await sleep(280)

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ.' }, { status: 400 })
  }

  const result = updateRoom(id, body)
  if (result === null) {
    return NextResponse.json({ message: 'Room not found' }, { status: 404 })
  }
  if ('error' in result) {
    return NextResponse.json({ message: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params
  await sleep(260)

  const ok = deleteRoom(id)
  if (!ok) {
    return NextResponse.json({ message: 'Room not found' }, { status: 404 })
  }

  return new NextResponse(null, { status: 204 })
}
