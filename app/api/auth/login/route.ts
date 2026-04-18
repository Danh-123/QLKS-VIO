import { NextResponse } from 'next/server'
import { sleep } from '../../../../lib/serverData'

type LoginRequest = {
  email?: string
  password?: string
}

const demoAccounts = [
  {
    id: 'usr-admin-1',
    name: 'Aurelia Admin',
    email: 'admin@aurelia.com',
    password: 'aurelia123',
    role: 'admin',
  },
  {
    id: 'usr-user-1',
    name: 'Aurelia Guest',
    email: 'user@aurelia.com',
    password: 'aurelia123',
    role: 'user',
  },
] as const

export async function POST(request: Request) {
  const body = (await request.json()) as LoginRequest
  const email = body.email?.trim().toLowerCase() || ''
  const password = body.password || ''

  await sleep(450)

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required.' },
      { status: 400 },
    )
  }

  if (password.length < 6) {
    return NextResponse.json(
      { message: 'Password must be at least 6 characters.' },
      { status: 400 },
    )
  }

  const matchedAccount = demoAccounts.find(
    (account) => account.email === email && account.password === password,
  )

  if (!matchedAccount) {
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 },
    )
  }

  const token = `vio_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

  return NextResponse.json({
    token,
    user: {
      id: matchedAccount.id,
      name: matchedAccount.name,
      email: matchedAccount.email,
      role: matchedAccount.role,
    },
  })
}
