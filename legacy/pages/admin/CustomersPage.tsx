import { useState } from 'react'
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
import { useAppData } from '../../state/AppDataContext'

export function CustomersPage() {
  const { customers: rows, addCustomer } = useAppData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    tier: 'Silver',
  })

  const add = () => {
    if (!form.name.trim() || !form.email.trim()) return
    addCustomer({
      name: form.name,
      email: form.email,
      tier: form.tier,
    })
    setForm({ name: '', email: '', tier: 'Silver' })
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
            Khách hàng
          </h1>
          <p className="mt-2 text-sm text-vio-navy/50">
            Danh sách tối giản — thêm khách mới khi cần.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Thêm khách
        </Button>
      </div>

      <div className="mt-24">
        <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Tên</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Hạng</TableHeaderCell>
            <TableHeaderCell>Lượt lưu trú</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>
                <span className="rounded-full bg-vio-cream px-2 py-1 text-xs">
                  {c.tier}
                </span>
              </TableCell>
              <TableCell>{c.stays}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Khách mới"
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
            id="cu-name"
            label="Họ tên"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <Input
            id="cu-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
          />
          <div>
            <label
              htmlFor="cu-tier"
              className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45"
            >
              Hạng
            </label>
            <select
              id="cu-tier"
              value={form.tier}
              onChange={(e) =>
                setForm((f) => ({ ...f, tier: e.target.value }))
              }
              className="w-full rounded-xl border-0 bg-vio-white px-4 py-3 text-base text-vio-navy shadow-soft-sm ring-1 ring-vio-navy/10"
            >
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
