"use client"

import Link from 'next/link'
import { useState } from 'react'
import { getStoredUser } from '../../hooks/useAuth'

/** Hiện khi admin xem trang khách trên App Router (không có GuestHeader). */
export function GuestAdminBackLink() {
  const [visible] = useState(() => typeof window !== 'undefined' && getStoredUser()?.role === 'admin')

  if (!visible) return null

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-vio-navy/12 bg-white/80 px-4 py-3 shadow-soft-sm backdrop-blur-sm">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-vio-navy/45">Quản trị đang bật</p>
      <Link
        href="/admin/dashboard"
        className="text-sm font-semibold text-vio-navy underline-offset-4 transition-colors hover:text-vio-gold hover:underline"
      >
        Về bảng quản trị
      </Link>
    </div>
  )
}
