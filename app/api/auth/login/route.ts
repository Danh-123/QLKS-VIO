import { NextResponse } from 'next/server'
import { sleep } from '../../../../lib/serverData'

const MOCKAPI_BASE_URL = (process.env.NEXT_PUBLIC_MOCKAPI_BASE_URL || 'https://api.mockapi.com').replace(/\/+$/u, '')
const MOCKAPI_API_KEY = (process.env.MOCKAPI_API_KEY || '').trim()

type LoginRequest = {
  email?: string
  password?: string
}

type AuthUser = {
  id: string
  name: string
  email: string
  password: string
  role: string
}

async function fetchAuthUsers(): Promise<AuthUser[]> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (MOCKAPI_API_KEY) {
      headers['x-api-key'] = MOCKAPI_API_KEY
      headers['authorization'] = `Bearer ${MOCKAPI_API_KEY}`
    }

    const response = await fetch(`${MOCKAPI_BASE_URL}/auth`, {
      headers,
    })

    if (!response.ok) {
      console.warn('Failed to fetch auth from MockAPI:', response.status)
      return getHardcodedAccounts()
    }

    const json = await response.json()
    
    // Handle MockAPI response format
    if (Array.isArray(json)) {
      return json as AuthUser[]
    } else if (json.data && Array.isArray(json.data)) {
      return json.data as AuthUser[]
    } else if (json.data) {
      // Single record wrapped in data
      return [json.data] as AuthUser[]
    }
    
    console.warn('Unexpected auth response format:', json)
    return getHardcodedAccounts()
  } catch (error) {
    console.warn('Error fetching auth:', error)
    return getHardcodedAccounts()
  }
}

function getHardcodedAccounts(): AuthUser[] {
  return [
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
    {
      id: 'usr-user-3',
      name: 'Demo User',
      email: 'demo@vio.com',
      password: 'demo1234',
      role: 'user',
    },
  ]
}

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

  const authUsers = await fetchAuthUsers()
  const matchedAccount = authUsers.find(
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
