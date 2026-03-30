export function formatVnd(value: number) {
  return `${new Intl.NumberFormat('vi-VN').format(value)} ₫`
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1
  const a = new Date(`${checkIn}T12:00:00`).getTime()
  const b = new Date(`${checkOut}T12:00:00`).getTime()
  const days = Math.ceil((b - a) / 86400000)
  return days > 0 ? days : 1
}

export function todayIso() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
