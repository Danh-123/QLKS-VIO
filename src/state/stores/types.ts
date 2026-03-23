import type { BookingStatus, BookingWizardState, StoredBooking } from '../../booking/types'

export type SearchFilters = {
  hotelId: string
  locationQuery: string
  checkIn: string
  checkOut: string
  guests: string
}

export type BookingDraft = Pick<
  BookingWizardState,
  'roomId' | 'checkIn' | 'checkOut' | 'guests' | 'adults' | 'children'
>

export type CreateBookingInput = {
  roomId: string
  roomName: string
  checkIn: string
  checkOut: string
  guests: number
  totalVnd: number
  preferencesNote?: string
  status?: BookingStatus
  customer?: {
    name: string
    email: string
  }
}

export type NewCustomerInput = {
  name: string
  email: string
  tier?: string
}

export type PricingResult = {
  nights: number
  subtotal: number
  serviceFee: number
  total: number
}

export type BookingAvailabilityFn = (
  bookings: StoredBooking[],
  roomId: string,
  checkIn: string,
  checkOut: string,
) => boolean
