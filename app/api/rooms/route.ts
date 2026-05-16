import { NextResponse } from 'next/server'
import { createRoom, listRooms, sleep } from '../../../lib/serverData'

export async function GET() {
  await sleep(500)
  return NextResponse.json(listRooms())
}

export async function POST(request: Request) {
  await sleep(320)

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ.' }, { status: 400 })
  }

  const result = createRoom(body)
  if ('error' in result) {
    return NextResponse.json({ message: result.error }, { status: 400 })
  }

  return NextResponse.json(result, { status: 201 })
}
