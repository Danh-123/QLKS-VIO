import { useMemo, useState } from 'react'
import {
  initialInventoryRooms,
  matrixRoomTypes,
  type InventoryRoom,
} from '../../admin/mockData'
import { Button } from '../../components/ui/Button'
import { AdminPageHero } from '../../components/admin/AdminPageHero'
import { Input } from '../../components/ui/Input'
import { LuxuryPagination, LuxuryTable, type LuxuryColumn } from '../../components/ui/LuxuryTable'
import { Modal } from '../../components/ui/Modal'
import { useFakeApiData } from '../../lib/useFakeApiData'

const PAGE_SIZE = 6

export function RoomsManagePage() {
  const [rows, setRows] = useState<InventoryRoom[]>(initialInventoryRooms)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<InventoryRoom | null>(null)
  const [page, setPage] = useState(1)
  const [form, setForm] = useState({
    code: '',
    floor: '1',
    type: 'Deluxe',
    beds: '2',
  })

  const { loading, data: roomRows } = useFakeApiData(rows, 700)

  const totalPages = Math.max(1, Math.ceil(roomRows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageRows = roomRows.slice(pageStart, pageStart + PAGE_SIZE)

  const columns: LuxuryColumn<InventoryRoom>[] = useMemo(
    () => [
      { header: 'Code', accessorKey: 'code', className: 'font-medium' },
      { header: 'Floor', accessorKey: 'floor' },
      { header: 'Type', accessorKey: 'type' },
      { header: 'Beds', accessorKey: 'beds' },
      {
        header: 'Status',
        accessorKey: 'active',
        render: (row) => (row.active ? 'Active' : 'Inactive'),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        align: 'right',
        render: (row) => (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              className="px-3 py-1.5 text-xs"
              onClick={() => openEdit(row)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="px-3 py-1.5 text-xs text-vio-error"
              onClick={() => remove(row.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const openNew = () => {
    setEditing(null)
    setForm({ code: '', floor: '1', type: 'Deluxe', beds: '2' })
    setOpen(true)
  }

  const openEdit = (room: InventoryRoom) => {
    setEditing(room)
    setForm({
      code: room.code,
      floor: String(room.floor),
      type: room.type,
      beds: String(room.beds),
    })
    setOpen(true)
  }

  const save = () => {
    if (!form.code.trim()) return
    if (editing) {
      setRows((list) =>
        list.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                code: form.code,
                floor: parseInt(form.floor, 10) || 1,
                type: form.type,
                beds: parseInt(form.beds, 10) || 1,
              }
            : item,
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
    if (confirm('Delete this room?')) {
      setRows((list) => list.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="space-y-8">
      <AdminPageHero
        eyebrow="Room Operations"
        title="Rooms"
        description="Manage inventory, categories, and floor configuration with one elegant workflow."
        imageUrl="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1800&q=80"
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div />
        <Button type="button" onClick={openNew}>
          Add Room
        </Button>
      </div>

      <LuxuryTable
        columns={columns}
        data={pageRows}
        loading={loading}
        rowKey={(row) => row.id}
        emptyMessage="No rooms available."
      />
      <LuxuryPagination page={safePage} totalPages={totalPages} onPageChange={setPage} />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit room' : 'Add room'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Input
            id="rm-code"
            label="Room code"
            value={form.code}
            onChange={(event) =>
              setForm((current) => ({ ...current, code: event.target.value }))
            }
          />
          <Input
            id="rm-floor"
            label="Floor"
            type="number"
            min={1}
            value={form.floor}
            onChange={(event) =>
              setForm((current) => ({ ...current, floor: event.target.value }))
            }
          />
          <div>
            <label
              htmlFor="rm-type"
              className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-text-secondary"
            >
              Room type
            </label>
            <select
              id="rm-type"
              value={form.type}
              onChange={(event) =>
                setForm((current) => ({ ...current, type: event.target.value }))
              }
              className="w-full rounded-xl border border-vio-linen bg-vio-white px-4 py-3 text-base text-vio-text-primary"
            >
              {matrixRoomTypes.map((roomType) => (
                <option key={roomType} value={roomType}>
                  {roomType}
                </option>
              ))}
            </select>
          </div>
          <Input
            id="rm-beds"
            label="Beds"
            type="number"
            min={1}
            value={form.beds}
            onChange={(event) =>
              setForm((current) => ({ ...current, beds: event.target.value }))
            }
          />
        </div>
      </Modal>
    </div>
  )
}
