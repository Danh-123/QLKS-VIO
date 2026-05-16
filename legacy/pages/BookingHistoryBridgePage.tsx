import { useEffect } from 'react'

/**
 * SPA route → full navigation to App Router booking history (API + đúng layout).
 */
export function BookingHistoryBridgePage() {
  useEffect(() => {
    window.location.replace('/bookings/history')
  }, [])

  return (
    <div className="vio-container vio-section py-20 text-center text-sm text-vio-navy/55">
      Đang mở lịch sử đặt phòng...
    </div>
  )
}
