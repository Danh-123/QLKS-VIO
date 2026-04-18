import { useMemo, useState } from 'react'
import {
  initialStaff,
  type StaffRow,
} from '../../admin/mockData'
import { AdminPageHero } from '../../components/admin/AdminPageHero'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { LuxuryTable, type LuxuryColumn } from '../../components/ui/LuxuryTable'
import { Modal } from '../../components/ui/Modal'
import { StatusBadge } from '../../components/ui/StatusBadge'

type StaffStatus = 'active' | 'inactive' | 'on-leave'

type StaffDisplayRow = StaffRow & {
  status: StaffStatus
  joinedDate: string
}

const roles = [
  'Manager',
  'Front Desk',
  'Housekeeping',
  'Food & Beverage',
  'Maintenance',
  'IT',
] as const

export function StaffRolesPage() {
  const [rows, setRows] = useState<StaffRow[]>(initialStaff)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | StaffStatus>('all')
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Front Desk',
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

  const filteredRows = useMemo(
    () =>
      staffRows.filter((row) => {
        if (statusFilter !== 'all' && row.status !== statusFilter) {
          return false
        }

        if (!search.trim()) return true
        const term = search.toLowerCase()
        return (
          row.name.toLowerCase().includes(term) ||
          row.email.toLowerCase().includes(term) ||
          row.role.toLowerCase().includes(term)
        )
      }),
    [staffRows, statusFilter, search],
  )

  const columns: LuxuryColumn<StaffDisplayRow>[] = [
    { header: 'Name', accessorKey: 'name', className: 'font-medium' },
    { header: 'Role', accessorKey: 'role' },
    { header: 'Email', accessorKey: 'email', className: 'font-mono text-xs' },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    { header: 'Joined Date', accessorKey: 'joinedDate' },
    {
      header: 'Actions',
      accessorKey: 'actions',
      align: 'right',
      render: () => (
        <div className="flex justify-end gap-3">
          <button
            type="button"
            aria-label="Edit staff"
            className="text-vio-text-secondary transition-colors duration-200 hover:text-vio-gold"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M4 20H8L19 9L15 5L4 16V20Z" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Delete staff"
            className="text-vio-text-secondary transition-colors duration-200 hover:text-vio-gold"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M6 7H18M9 7V5H15V7M10 10V17M14 10V17M7 7L8 19H16L17 7" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
      ),
    },
  ]

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
      <AdminPageHero
        eyebrow="Team Leadership"
        title="Staff Management"
        description="Coordinate teams, roles, and availability while preserving service excellence."
        imageUrl="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1800&q=80"
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div />
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="transition-colors duration-200 hover:bg-vio-gold"
        >
          Add Staff
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-vio-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label htmlFor="staff-search" className="mb-2 block text-xs uppercase tracking-[0.08em] text-vio-text-secondary">
            Search
          </label>
          <input
            id="staff-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, role, or email"
            className="w-full rounded-lg border border-vio-linen bg-vio-white px-3 py-2 text-sm text-vio-text-primary outline-none transition-shadow duration-200 focus:ring-2 focus:ring-vio-gold/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="staff-status" className="text-xs uppercase tracking-[0.08em] text-vio-text-secondary">
            Status
          </label>
          <select
            id="staff-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | StaffStatus)}
            className="rounded-lg border border-vio-linen bg-vio-white px-3 py-2 text-sm text-vio-text-primary"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>
      </div>

      <LuxuryTable
        columns={columns}
        data={filteredRows}
        rowKey={(row) => row.id}
        emptyMessage="No staff found."
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add staff member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={add}>Save</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Input
            id="st-name"
            label="Full name"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <Input
            id="st-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
          />
          <div>
            <label
              htmlFor="st-role"
              className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-text-secondary"
            >
              Role
            </label>
            <select
              id="st-role"
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value }))
              }
              className="w-full rounded-xl border border-vio-linen bg-vio-white px-4 py-3 text-base text-vio-text-primary"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <Input
            id="st-dept"
            label="Department"
            value={form.department}
            onChange={(e) =>
              setForm((f) => ({ ...f, department: e.target.value }))
            }
          />
        </div>
      </Modal>
    </div>
  )
}
