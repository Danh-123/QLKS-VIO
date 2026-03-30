export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked-in'
  | 'checked-out'
  | 'cancelled'
  | 'no-show'

export type Booking = {
  id: string
  roomId: string
  roomName: string
  customerId: string
  customerName: string
  checkIn: string
  checkOut: string
  guests: number
  totalVnd: number
  status: BookingStatus
  createdAt: string
}
