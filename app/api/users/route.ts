import { NextResponse } from 'next/server'
import { listUsers, sleep } from '../../../lib/serverData'

export async function GET() {
  await sleep(450)
  const users = await listUsers()
  return NextResponse.json(users)
}
