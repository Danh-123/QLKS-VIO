"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredUser } from '../../hooks/useAuth'
import { AdminChrome } from './AdminChrome'

type Props = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  const router = useRouter()
  const user = getStoredUser()
  const hasAccess = Boolean(user && user.role === 'admin')

  useEffect(() => {
    if (!hasAccess) {
      router.replace('/login?reason=auth&redirect=/admin/bookings')
    }
  }, [hasAccess, router])

  if (!hasAccess) {
    return (
      <div className="min-h-dvh grid place-items-center bg-[linear-gradient(180deg,#f8f3e9_0%,#ffffff_45%,#f4eee0_100%)] px-4">
        <p className="text-sm text-vio-navy/55">Đang kiểm tra quyền truy cập...</p>
      </div>
    )
  }

  return <AdminChrome>{children}</AdminChrome>
}
