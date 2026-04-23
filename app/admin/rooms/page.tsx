'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Embedded types from legacy/admin/mockData
type InventoryRoom = {
  id: string
  code: string
  floor: number
  type: string
  beds: number
  active: boolean
}

const matrixRoomTypes = ['Standard', 'Deluxe', 'Suite', 'Villa'] as const

const initialInventoryRooms: InventoryRoom[] = [
  { id: 'inv1', code: '101', floor: 1, type: 'Deluxe', beds: 1, active: true },
  { id: 'inv2', code: '102', floor: 1, type: 'Deluxe', beds: 2, active: true },
  { id: 'inv3', code: '201', floor: 2, type: 'Suite', beds: 1, active: true },
  { id: 'inv4', code: '202', floor: 2, type: 'Suite', beds: 2, active: false },
  { id: 'inv5', code: '301', floor: 3, type: 'Villa', beds: 1, active: true },
]

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold',
        active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
      )}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

function RoomsTable({ data }: { data: InventoryRoom[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-orange-100">
            <th className="px-8 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Code</th>
            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Floor</th>
            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Type</th>
            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Beds</th>
            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">Status</th>
            <th className="px-8 py-4 text-right text-xs uppercase tracking-wider font-semibold text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-50">
          {data.map((room) => (
            <tr key={room.id} className="hover:bg-orange-50/50 transition-colors">
              <td className="px-8 py-6 font-medium text-gray-900">{room.code}</td>
              <td className="px-6 py-6 text-gray-900">Floor {room.floor}</td>
              <td className="px-6 py-6 text-gray-900">{room.type}</td>
              <td className="px-6 py-6 text-gray-900">{room.beds}</td>
              <td className="px-6 py-6">
                <StatusBadge active={room.active} />
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex gap-2 justify-end">
                  <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Edit">
                    ✏️
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete">
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

const PAGE_SIZE = 6

export default function RoomsPage() {
  const [rows, setRows] = useState<InventoryRoom[]>(initialInventoryRooms)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<InventoryRoom | null>(null)
  const [page, setPage] = useState(1)
  const [form, setForm] = useState({
    code: '',
    floor: '1',
    type: 'Deluxe' as typeof matrixRoomTypes[number],
    beds: '1',
  })

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageRows = rows.slice(pageStart, pageStart + PAGE_SIZE)

  const openNew = () => {
    setEditing(null)
    setForm({ code: '', floor: '1', type: 'Deluxe', beds: '1' })
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
                type: form.type as typeof matrixRoomTypes[number],
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
          type: form.type as typeof matrixRoomTypes[number],
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
      {/* Hero */}
      <section className="relative h-[260px] rounded-3xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1800&q=80"
          alt="Room Operations"
          fill
          sizes="(max-width: 390px) 100vw, 60vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30" />
        <div className="absolute bottom-6 left-6">
          <p className="text-xs uppercase tracking-wider text-orange-400">Room Operations</p>
          <h1 className="text-3xl font-cormorant font-normal text-white mt-2">Rooms Inventory</h1>
        </div>
      </section>

      {/* Controls */}
      <div className="flex items-center justify-end">
        <button 
          onClick={openNew}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          + Add Room
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl border border-orange-100/50 bg-white/80 backdrop-blur shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-orange-100">
          <h2 className="text-3xl font-cormorant font-normal text-gray-900">Room Inventory</h2>
          <p className="text-sm text-gray-600 mt-1">Manage floor, type, status, and availability details ({rows.length} total).</p>
        </div>
        <div className="p-8">
          <RoomsTable data={pageRows} />
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button 
                disabled={safePage === 1} 
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-xl border border-gray-200 font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">{safePage} / {totalPages}</span>
              <button 
                disabled={safePage === totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-xl border border-gray-200 font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white/95 rounded-3xl p-8 max-w-md w-full border border-orange-100/50">
            <h2 className="text-2xl font-cormorant mb-6">
              {editing ? 'Edit Room' : 'Add Room'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Code</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                <input
                  type="number"
                  min={1}
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300"
                >
                  {matrixRoomTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beds</label>
                <input
                  type="number"
                  min={1}
                  value={form.beds}
                  onChange={(e) => setForm({ ...form, beds: e.target.value })}
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
                onClick={save}
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

