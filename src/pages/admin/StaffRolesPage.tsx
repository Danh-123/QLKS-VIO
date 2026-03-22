import { useState } from 'react'
import {
  initialStaff,
  type StaffRow,
} from '../../admin/mockData'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/ui/Table'

const roles = [
  'Quản lý',
  'Lễ tân',
  'Buồng phòng',
  'Ẩm thực',
  'Bảo trì',
  'IT',
] as const

export function StaffRolesPage() {
  const [rows, setRows] = useState<StaffRow[]>(initialStaff)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Lễ tân',
    department: '',
  })

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
    setForm({ name: '', email: '', role: 'Lễ tân', department: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-vio-navy md:text-4xl">
            Nhân sự & quyền
          </h1>
          <p className="mt-2 text-sm text-vio-navy/50">
            Vai trò minh họa — quản trị quyền chi tiết sẽ gắn backend.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Thêm nhân sự
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Họ tên</TableHeaderCell>
            <TableHeaderCell>Vai trò</TableHeaderCell>
            <TableHeaderCell>Bộ phận</TableHeaderCell>
            <TableHeaderCell>Email nội bộ</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>
                <span className="rounded-full bg-vio-navy/[0.06] px-3 py-1 text-xs text-vio-navy/80">
                  {s.role}
                </span>
              </TableCell>
              <TableCell>{s.department}</TableCell>
              <TableCell className="font-mono text-xs text-vio-navy/55">
                {s.email}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm nhân sự"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={add}>Lưu</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Input
            id="st-name"
            label="Họ tên"
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
              className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45"
            >
              Vai trò
            </label>
            <select
              id="st-role"
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value }))
              }
              className="w-full rounded-xl border-0 bg-vio-white px-4 py-3 text-base text-vio-navy shadow-soft-sm ring-1 ring-vio-navy/10"
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
            label="Bộ phận"
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
