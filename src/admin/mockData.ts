import type { BookingStatus } from '../booking/types'

export type MatrixRoomStatus =
  | 'available'
  | 'occupied'
  | 'dirty'
  | 'maintenance'
  | 'reserved'

export type MatrixRoom = {
  id: string
  floor: number
  code: string
  type: string
  status: MatrixRoomStatus
  guestName?: string
}

export const matrixRoomTypes = ['Standard', 'Deluxe', 'Suite', 'Villa'] as const

export const initialMatrixRooms: MatrixRoom[] = [
  { id: 'r101', floor: 1, code: '101', type: 'Deluxe', status: 'occupied', guestName: 'Nguyễn A.' },
  { id: 'r102', floor: 1, code: '102', type: 'Deluxe', status: 'available' },
  { id: 'r103', floor: 1, code: '103', type: 'Standard', status: 'dirty' },
  { id: 'r104', floor: 1, code: '104', type: 'Standard', status: 'reserved', guestName: 'Lê B.' },
  { id: 'r201', floor: 2, code: '201', type: 'Suite', status: 'occupied', guestName: 'Trần C.' },
  { id: 'r202', floor: 2, code: '202', type: 'Suite', status: 'maintenance' },
  { id: 'r203', floor: 2, code: '203', type: 'Deluxe', status: 'available' },
  { id: 'r204', floor: 2, code: '204', type: 'Deluxe', status: 'available' },
  { id: 'r301', floor: 3, code: '301', type: 'Villa', status: 'occupied', guestName: 'Phạm D.' },
  { id: 'r302', floor: 3, code: '302', type: 'Suite', status: 'reserved' },
  { id: 'r303', floor: 3, code: '303', type: 'Suite', status: 'dirty' },
  { id: 'r304', floor: 3, code: '304', type: 'Deluxe', status: 'available' },
]

export type UnassignedGuest = { id: string; name: string }

export const initialUnassignedGuests: UnassignedGuest[] = [
  { id: 'g1', name: 'Hoàng Minh' },
  { id: 'g2', name: 'Sarah Chen' },
]

export const dashboardStats = {
  roomCount: 48,
  occupancyPct: 72,
  revenueMonthVnd: 2_847_000_000,
}

export const revenueChartData = [
  { name: 'T2', vnd: 82000000 },
  { name: 'T3', vnd: 91000000 },
  { name: 'T4', vnd: 78000000 },
  { name: 'T5', vnd: 95000000 },
  { name: 'T6', vnd: 102000000 },
  { name: 'T7', vnd: 118000000 },
  { name: 'CN', vnd: 124000000 },
]

export type RecentBookingRow = {
  id: string
  guest: string
  room: string
  status: BookingStatus
  checkIn: string
  totalVnd: number
}

export const recentBookingsAdmin: RecentBookingRow[] = [
  {
    id: 'vio-9001',
    guest: 'Nguyễn Lan',
    room: '201',
    status: 'confirmed',
    checkIn: '2025-04-02',
    totalVnd: 14500000,
  },
  {
    id: 'vio-9002',
    guest: 'James Cole',
    room: 'V-01',
    status: 'checked-in',
    checkIn: '2025-04-01',
    totalVnd: 32800000,
  },
  {
    id: 'vio-9003',
    guest: 'Mai Hương',
    room: '104',
    status: 'pending',
    checkIn: '2025-04-05',
    totalVnd: 5200000,
  },
]

export const CALENDAR_DAYS = 21
export const calendarStart = new Date('2025-04-01')

export type CalendarBookingBar = {
  id: string
  roomId: string
  guest: string
  startDay: number
  endDay: number
  color: string
}

export const calendarBookings: CalendarBookingBar[] = [
  { id: 'cb1', roomId: 'r101', guest: 'Nguyễn A.', startDay: 0, endDay: 4, color: 'bg-vio-navy/80' },
  { id: 'cb2', roomId: 'r201', guest: 'Trần C.', startDay: 2, endDay: 7, color: 'bg-vio-gold/70' },
  { id: 'cb3', roomId: 'r301', guest: 'Phạm D.', startDay: 5, endDay: 12, color: 'bg-vio-navy/55' },
  { id: 'cb4', roomId: 'r102', guest: 'Walk-in', startDay: 8, endDay: 10, color: 'bg-vio-navy/40' },
  { id: 'cb5', roomId: 'r203', guest: 'Lê B.', startDay: 10, endDay: 14, color: 'bg-vio-gold/50' },
]

export type InventoryRoom = {
  id: string
  code: string
  floor: number
  type: string
  beds: number
  active: boolean
}

export const initialInventoryRooms: InventoryRoom[] = [
  { id: 'inv1', code: '101', floor: 1, type: 'Deluxe', beds: 1, active: true },
  { id: 'inv2', code: '102', floor: 1, type: 'Deluxe', beds: 2, active: true },
  { id: 'inv3', code: '201', floor: 2, type: 'Suite', beds: 1, active: true },
]

export type PricingRule = {
  id: string
  name: string
  type: string
  adjustment: string
  active: boolean
}

export const initialPricingRules: PricingRule[] = [
  { id: 'p1', name: 'Cuối tuần +15%', type: 'Thời điểm', adjustment: '+15%', active: true },
  { id: 'p2', name: 'Suite dài ngày -8%', type: 'Hạng phòng', adjustment: '-8%', active: true },
  { id: 'p3', name: 'Tết Nguyên Đán', type: 'Mùa', adjustment: '+35%', active: false },
]

export type CustomerRow = {
  id: string
  name: string
  email: string
  tier: string
  stays: number
}

export const initialCustomers: CustomerRow[] = [
  { id: 'c1', name: 'Nguyễn Lan', email: 'lan@email.com', tier: 'Gold', stays: 12 },
  { id: 'c2', name: 'James Cole', email: 'j.cole@email.com', tier: 'Platinum', stays: 28 },
  { id: 'c3', name: 'Mai Hương', email: 'mh@email.com', tier: 'Silver', stays: 4 },
]

export type StaffRow = {
  id: string
  name: string
  role: string
  email: string
  department: string
}

export const initialStaff: StaffRow[] = [
  { id: 's1', name: 'Đỗ Văn H.', role: 'Quản lý', email: 'dv.h@vio.local', department: 'Vận hành' },
  { id: 's2', name: 'Lisa Tran', role: 'Lễ tân', email: 'l.t@vio.local', department: 'Tiền sảnh' },
  { id: 's3', name: 'Minh Anh', role: 'Housekeeping lead', email: 'ma@vio.local', department: 'Buồng phòng' },
]
