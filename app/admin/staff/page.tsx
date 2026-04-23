'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
// StaffRow type and initialStaff from legacy/admin/mockData embedded below for self-contained

const roles = [
  'Manager',
  'Front Desk', 
  'Housekeeping',
  'Food & Beverage',
  'Maintenance',
  'IT',
] as const

type StaffStatus = 'active' | 'inactive' | 'on-leave'

interface StaffRow {
  id: string
  name: string
  role: string
  email: string
  department: string
}

type StaffDisplayRow = StaffRow & {
  status: StaffStatus
  joinedDate: string
}

const initialStaff: StaffRow[] = [
  { id: 's1', name: 'Đỗ Văn H.', role: 'Manager', email: 'dv.h@vio.local', department: 'Operations' },
  { id: 's2', name: 'Lisa Tran', role: 'Front Desk', email: 'l.t@vio.local', department: 'Front Office' },
  { id: 's3', name: 'Minh Anh', role: 'Housekeeping Lead', email: 'ma@vio.local', department: 'Housekeeping' },
]

function StatusBadge({ status }: { status: StaffStatus }) {
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold',
        status === 'active' && 'bg-green-100 text-green-800',
        status === 'inactive' && 'bg-gray-100 text-gray-700',
        status === 'on-leave' && 'bg-orange-100 text-orange-800'
      )}
    >
      {status.toUpperCase()}
    </span>
  )
}

function StaffTable({ data }: { data: StaffDisplayRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-orange-100">
            <th className="px-8 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Name</th>
            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Role</th>
            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Email</th>
            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Status</th>
            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Joined</th>
            <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-semibold text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-50">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-orange-50/50 transition-colors">
              <td className="px-8 py-6 font-medium text-gray-900">{row.name}</td>
              <td className="px-6 py-6 text-gray-900">{row.role}</td>
              <td className="px-6 py-6 text-sm text-gray-600 font-mono">{row.email}</td>
              <td className="px-6 py-6">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-6 py-6 text-sm text-gray-600">{row.joinedDate}</td>
              <td className="px-6 py-6 text-right">
                <div className="flex gap-2 justify-end">
                  <button 
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" 
                    aria-label="Edit staff"
                  >
                    ✏️
                  </button>
                  <button 
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    aria-label="Delete staff"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function StaffPage() {
  const [rows, setRows] = useState<StaffRow[]>(initialStaff)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | StaffStatus>('all')
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Front Desk' as typeof roles[number],
    department: '',
  })

  const staffRows = useMemo<StaffDisplayRow[]>(() => {
    const statuses: StaffStatus[] = ['active', 'on-leave', 'inactive']
    const joinedDates = ['2024-01-12', '2023-09-02', '2022-11-18', '2024-03-26']
    return rows.map((row, index) => ({
      ...row,
      status: statuses[index % statuses.length],
      joinedDate: joinedDates[index % joinedDates.length],
    }))
  }, [rows])

  const filteredRows = useMemo(() => 
    staffRows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (!search.trim()) return true
      const term = search.toLowerCase()
      return (
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.role.toLowerCase().includes(term)
      )
    }),
  [staffRows, statusFilter, search])

  const add = () => {
    if (!form.name.trim() || !form.email.trim()) return
    setRows((r) => [
      ...r,
      {
        id: `s-${Date.now()}`,
        name: form.name,
        email: form.email,
        role: form.role,
        department: form.department || '—',
      },
    ])
    setForm({ name: '', email: '', role: 'Front Desk', department: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative h-[260px] rounded-3xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1800&q=80"
          alt="Staff Management"
          fill
          sizes="(max-width: 390px) 100vw, 60vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30" />
        <div className="absolute bottom-6 left-6">
          <p className="text-xs uppercase tracking-wider text-orange-400">Team Leadership</p>
          <h1 className="text-3xl font-cormorant font-normal text-white mt-2">Staff Management</h1>
        </div>
      </section>

      {/* Controls */}
      <div className="flex flex-wrap items-end justify-between gap-4 p-6 bg-white/50 backdrop-blur rounded-2xl border border-orange-100/50">
        <div className="flex gap-6 items-end flex-1">
          <div className="min-w-[250px]">
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, role, email..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>
        <button 
          onClick={() => setOpen(true)}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          + Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-orange-100/50 bg-white/80 backdrop-blur shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-orange-100">
          <h2 className="text-3xl font-cormorant font-normal text-gray-900">Staff Directory</h2>
          <p className="text-sm text-gray-600 mt-1">Roles, departments, and status overview ({filteredRows.length} found).</p>
        </div>
        <StaffTable data={filteredRows} />
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white/95 rounded-3xl p-8 max-w-md w-full border border-orange-100/50">
            <h2 className="text-2xl font-cormorant mb-6">Add Staff Member</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({...form, role: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300"
                >
                  {roles.map(role => <option key={role}>{role}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  value={form.department}
                  onChange={(e) => setForm({...form, department: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setOpen(false)}
                className="flex-1 py-3 px-6 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={add}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
