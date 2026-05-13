'use client'

import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { BrowserRouter } from 'react-router-dom'

const AdminLayout = dynamic<{ children?: ReactNode }>(
  () =>
    import('../../legacy/components/admin/AdminLayout').then((mod) => mod.AdminLayout as any),
  {
    ssr: false,
    loading: () => <div className="min-h-screen bg-white" />,
  },
)

export default function Admin({
  children,
}: {
  children: ReactNode
}) {
  return (
    <BrowserRouter>
      <AdminLayout>{children}</AdminLayout>
    </BrowserRouter>
  )
}
