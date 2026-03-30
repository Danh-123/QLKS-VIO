import { NextResponse } from 'next/server'
import { listUsers, sleep } from '../../../lib/serverData'

export async function GET() {
  await sleep(450)
  return NextResponse.json(listUsers())
}
