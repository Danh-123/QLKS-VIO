export type AdminNavItem = {
  to: string
  label: string
}

export const adminNavItems: AdminNavItem[] = [
  { to: '/admin', label: 'Tổng quan' },
  { to: '/admin/matrix', label: 'Sơ đồ phòng' },
  { to: '/admin/calendar', label: 'Lịch đặt phòng' },
  { to: '/admin/rooms', label: 'Quản lý phòng' },
  { to: '/admin/pricing', label: 'Giá & ưu đãi' },
  { to: '/admin/customers', label: 'Khách hàng' },
  { to: '/admin/staff', label: 'Nhân sự & quyền' },
]
