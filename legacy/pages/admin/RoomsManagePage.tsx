import { useState } from 'react'
import {
  initialInventoryRooms,
  matrixRoomTypes,
  type InventoryRoom,
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

export function RoomsManagePage() {
  const [rows, setRows] = useState<InventoryRoom[]>(initialInventoryRooms)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<InventoryRoom | null>(null)
  const [form, setForm] = useState({
    code: '',
    floor: '1',
    type: 'Deluxe',
    beds: '2',
  })

  const openNew = () => {
    setEditing(null)
    setForm({ code: '', floor: '1', type: 'Deluxe', beds: '2' })
    setOpen(true)
  }

  const openEdit = (r: InventoryRoom) => {
    setEditing(r)
    setForm({
      code: r.code,
      floor: String(r.floor),
      type: r.type,
      beds: String(r.beds),
    })
    setOpen(true)
  }

  const save = () => {
    if (!form.code.trim()) return
    if (editing) {
      setRows((list) =>
        list.map((x) =>
          x.id === editing.id
            ? {
                ...x,
                code: form.code,
                floor: parseInt(form.floor, 10) || 1,
                type: form.type,
                beds: parseInt(form.beds, 10) || 1,
              }
            : x,
        ),
      )
    } else {
      setRows((list) => [
        ...list,
        {
          id: `inv-${Date.now()}`,
          code: form.code,
          floor: parseInt(form.floor, 10) || 1,
          type: form.type,
          beds: parseInt(form.beds, 10) || 1,
          active: true,
        },
      ])
    }
    setOpen(false)
  }

  const remove = (id: string) => {
    if (confirm('Xóa phòng này?')) setRows((l) => l.filter((x) => x.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
            Quản lý phòng
          </h1>
          <p className="mt-2 text-sm text-vio-navy/50">
            CRUD tối giản — dữ liệu phiên làm việc (demo).
          </p>
        </div>
        <Button type="button" onClick={openNew}>
          Thêm phòng
        </Button>
      </div>

      <div className="mt-24">
        <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Mã</TableHeaderCell>
            <TableHeaderCell>Tầng</TableHeaderCell>
            <TableHeaderCell>Hạng</TableHeaderCell>
            <TableHeaderCell>Giường</TableHeaderCell>
            <TableHeaderCell>Hoạt động</TableHeaderCell>
            <TableHeaderCell className="text-right">Thao tác</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.code}</TableCell>
              <TableCell>{r.floor}</TableCell>
              <TableCell>{r.type}</TableCell>
              <TableCell>{r.beds}</TableCell>
              <TableCell>{r.active ? 'Có' : 'Không'}</TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  className="px-3 py-1.5 text-xs"
                  onClick={() => openEdit(r)}
                >
                  Sửa
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-3 py-1.5 text-xs text-rose-700/80"
                  onClick={() => remove(r.id)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Sửa phòng' : 'Thêm phòng'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={save}>Lưu</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Input
            id="rm-code"
            label="Mã phòng"
            value={form.code}
            onChange={(e) =>
              setForm((f) => ({ ...f, code: e.target.value }))
            }
          />
          <Input
            id="rm-floor"
            label="Tầng"
            type="number"
            min={1}
            value={form.floor}
            onChange={(e) =>
              setForm((f) => ({ ...f, floor: e.target.value }))
            }
          />
          <div>
            <label
              htmlFor="rm-type"
              className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45"
            >
              Hạng
            </label>
            <select
              id="rm-type"
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value }))
              }
              className="w-full rounded-xl border-0 bg-vio-white px-4 py-3 text-base text-vio-navy shadow-soft-sm ring-1 ring-vio-navy/10"
            >
              {matrixRoomTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <Input
            id="rm-beds"
            label="Số giường"
            type="number"
            min={1}
            value={form.beds}
            onChange={(e) =>
              setForm((f) => ({ ...f, beds: e.target.value }))
            }
          />
        </div>
      </Modal>
    </div>
  )
}
