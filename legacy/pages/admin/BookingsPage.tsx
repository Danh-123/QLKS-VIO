import { useEffect } from 'react'

export function BookingsPage() {
  useEffect(() => {
    // Force full navigation to App Router admin bookings page
    window.location.href = '/admin/bookings'
  }, [])

  return null
}
