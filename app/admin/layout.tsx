import { ReactNode } from 'react'
import AdminLayoutComp from '../../../components/admin/AdminLayout'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutComp>{children}</AdminLayoutComp>
}
