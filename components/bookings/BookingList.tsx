import type { Booking } from '../../types/booking'
import { formatVnd } from '../../lib/utils'

export function BookingList({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Room</th>
            <th className="px-4 py-3">Check-in</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-mono text-xs">{booking.id}</td>
              <td className="px-4 py-3">{booking.customerName}</td>
              <td className="px-4 py-3">{booking.roomName}</td>
              <td className="px-4 py-3">{booking.checkIn}</td>
              <td className="px-4 py-3 capitalize">{booking.status}</td>
              <td className="px-4 py-3 text-right">{formatVnd(booking.totalVnd)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
