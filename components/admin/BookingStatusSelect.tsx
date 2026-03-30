'use client'

import type { BookingStatus } from '../../types/booking'

const statuses: BookingStatus[] = [
  'pending',
  'confirmed',
  'checked-in',
  'checked-out',
  'cancelled',
  'no-show',
]

export function BookingStatusSelect({
  value,
  onChange,
}: {
  value: BookingStatus
  onChange: (value: BookingStatus) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as BookingStatus)}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}
