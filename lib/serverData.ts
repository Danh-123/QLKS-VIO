import type { Booking, BookingStatus, StoredBooking } from '../types/booking'

type RoomStatus = 'available' | 'occupied' | 'dirty' | 'maintenance' | 'reserved'

type ApiRoom = {
  id: string
  name: string
  description: string
  image: string
  priceFrom: string
  basePriceVnd: number
  status: RoomStatus
}

type UserRecord = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

const _RAW_MOCKAPI_BASE = process.env.NEXT_PUBLIC_MOCKAPI_BASE_URL || 'https://api.mockapi.com'
const MOCKAPI_BASE_URL = _RAW_MOCKAPI_BASE.replace(/\/+$/u, '')
const MOCKAPI_API_KEY = process.env.MOCKAPI_API_KEY?.trim()

function apiUrl(path: string) {
  return `${MOCKAPI_BASE_URL}/${path.replace(/^\/+/, '')}`
}

function mockApiHeaders(extraHeaders?: HeadersInit) {
  const headers = new Headers(extraHeaders)

  if (MOCKAPI_API_KEY) {
    headers.set('x-api-key', MOCKAPI_API_KEY)
    headers.set('authorization', `Bearer ${MOCKAPI_API_KEY}`)
  }

  return headers
}

let cachedRooms: ApiRoom[] | null = null


let bookings: StoredBooking[] = []

export function sleep(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

export async function listRooms() {
  try {
    if (cachedRooms) return cachedRooms
    
    const response = await fetch(apiUrl('rooms'))
    if (!response.ok) throw new Error('Failed to fetch rooms')
    
    const data: ApiRoom[] = await response.json()
    cachedRooms = data
    return data
  } catch (error) {
    console.error('Error fetching rooms from MockAPI:', error)
    return []
  }
}

export async function findRoom(id: string) {
  try {
    const response = await fetch(apiUrl(`rooms/${id}`))
    if (!response.ok) return null
    return (await response.json()) as ApiRoom
  } catch (error) {
    console.error('Error fetching room:', error)
    return null
  }
}

export async function listBookings() {
  try {
    const response = await fetch(apiUrl('bookings'))
    if (!response.ok) throw new Error('Failed to fetch bookings')
    
    const data: StoredBooking[] = await response.json()
    bookings = data
    return data
  } catch (error) {
    console.error('Error fetching bookings from MockAPI:', error)
    return bookings
  }
}

export async function addBooking(booking: Booking) {
  try {
    const response = await fetch(apiUrl('bookings'), {
      method: 'POST',
      headers: mockApiHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(booking),
    })
    if (!response.ok) throw new Error('Failed to create booking')
    
    const created = (await response.json()) as StoredBooking
    bookings.unshift(created)
    return created
  } catch (error) {
    console.error('Error creating booking:', error)
    return null
  }
}

export async function updateBookingStatusById(id: string, status: BookingStatus) {
  try {
    const response = await fetch(apiUrl(`bookings/${id}`), {
      method: 'PUT',
      headers: mockApiHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status }),
    })
    if (!response.ok) return null

    const updated = (await response.json()) as StoredBooking
    const index = bookings.findIndex((booking) => booking.id === id)
    if (index !== -1) {
      bookings[index] = updated
    }
    return { ...updated }
  } catch (error) {
    console.error('Error updating booking status:', error)
    return null
  }
}

export async function listUsers() {
  try {
    const response = await fetch(apiUrl('users'))
    if (!response.ok) throw new Error('Failed to fetch users')
    
    const data: UserRecord[] = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching users from MockAPI:', error)
    return []
  }
}

export async function findUser(id: string) {
  try {
    const response = await fetch(apiUrl(`users/${id}`))
    if (!response.ok) return null
    return (await response.json()) as UserRecord
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

