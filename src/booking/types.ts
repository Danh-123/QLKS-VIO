export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked-in'
  | 'checked-out'
  | 'cancelled'
  | 'no-show'

export type StoredBooking = {
  id: string
  createdAt: string
  roomId: string
  roomName: string
  checkIn: string
  checkOut: string
  guests: number
  status: BookingStatus
  totalVnd: number
  preferencesNote?: string
}

export type BookingWizardState = {
  checkIn: string
  checkOut: string
  /** @deprecated use adults+children; kept for URL sync */
  guests: string
  adults: string
  children: string
  roomId: string
  floorPref: 'high' | 'low' | 'any'
  smoking: boolean
  allergy: string
  occasion: string
  fullName: string
  email: string
  phone: string
  cardName: string
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

export const BOOKING_STORAGE_KEY = 'vio_bookings_v1'
