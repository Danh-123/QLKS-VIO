export type RoomStatus = 'available' | 'occupied' | 'dirty' | 'maintenance'

export type Room = {
  id: string
  code: string
  name: string
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Villa'
  floor: number
  capacity: number
  pricePerNight: number
  description: string
  image: string
  status: RoomStatus
}
