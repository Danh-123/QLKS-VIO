import { NextResponse } from 'next/server'
import { listRooms, sleep } from '../../../lib/serverData'

export async function GET() {
  await sleep(500)
  return NextResponse.json(listRooms())
}
