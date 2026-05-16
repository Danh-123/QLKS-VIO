"use client"

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { roomApi } from '../../../lib/api'
import { getStoredUser } from '../../../hooks/useAuth'
import { Button } from '../../../legacy/components/ui/Button'
import { Card } from '../../../legacy/components/ui/Card'
import { Modal } from '../../../legacy/components/ui/Modal'
import { RoomForm, type RoomFormState, type RoomStatus } from './RoomForm'

type RoomRow = {
  id: string
  name?: string
  type?: string
  price?: number
  basePriceVnd?: number
  image?: string
  description?: string
  capacity?: number
  status?: RoomStatus
}

const emptyForm: RoomFormState = {
  name: '',
  type: 'Deluxe',
  price: '',
  image: '',
  description: '',
  capacity: '2',
  status: 'available',
}

function formatVnd(value: number) {
  return `${new Intl.NumberFormat('vi-VN').format(value)} ₫`
}

function buildCreatePayload(form: RoomFormState) {
  return {
    name: form.name.trim(),
    type: form.type.trim(),
    price: Number(form.price) || 0,
    basePriceVnd: Number(form.price) || 0,
    image: form.image.trim(),
    description: form.description.trim(),
    capacity: Number(form.capacity) || 1,
    status: 'available' as const,
  }
}

function buildUpdatePayload(form: RoomFormState) {
  return {
    name: form.name.trim(),
    type: form.type.trim(),
    price: Number(form.price) || 0,
    basePriceVnd: Number(form.price) || 0,
    image: form.image.trim(),
    description: form.description.trim(),
    capacity: Number(form.capacity) || 1,
    status: form.status,
  }
}

export default function AdminRoomsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [rooms, setRooms] = useState<RoomRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<RoomRow | null>(null)
  const [form, setForm] = useState<RoomFormState>(emptyForm)

  const loadRooms = useCallback(async () => {
    setLoading(true)
    setPageError(null)

    try {
      const data = await roomApi.getAll()
      setRooms(Array.isArray(data) ? (data as RoomRow[]) : [])
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Không thể tải danh sách phòng.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const user = getStoredUser()

    if (!user) {
      router.replace('/login?reason=auth&redirect=/admin/rooms')
      return
    }

    if (user.role !== 'admin') {
      router.replace('/login?reason=auth&redirect=/admin/rooms')
      return
    }

    void loadRooms()
  }, [loadRooms, pathname, router])

  const openCreate = () => {
    setEditingRoom(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (room: RoomRow) => {
    setEditingRoom(room)
    setForm({
      name: room.name || '',
      type: room.type || 'Deluxe',
      price: String(room.basePriceVnd || room.price || ''),
      image: room.image || '',
      description: room.description || '',
      capacity: String(room.capacity || 2),
      status: (room.status as RoomStatus) || 'available',
    })
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setEditingRoom(null)
    setForm(emptyForm)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      setPageError('Vui lòng nhập tên phòng.')
      return
    }

    setSaving(true)
    setPageError(null)

    try {
      if (editingRoom) {
        await roomApi.update(editingRoom.id, buildUpdatePayload(form))
      } else {
        await roomApi.create(buildCreatePayload(form))
      }

      await loadRooms()
      closeModal()
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Không thể lưu phòng.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (room: RoomRow) => {
    if (!confirm(`Xóa phòng "${room.name || room.id}"?`)) return

    setSaving(true)
    setPageError(null)

    try {
      await roomApi.delete(room.id)
      await loadRooms()
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Không thể xóa phòng.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      <p className="mb-4 max-w-2xl text-sm leading-7 text-vio-navy/55">
        Thêm, sửa, xóa phòng trực tiếp từ dữ liệu API. Giao diện tự co giãn cho mobile và desktop.
      </p>
      <div className="mb-6 flex justify-end">
        <Button type="button" onClick={openCreate} className="w-full sm:w-auto">
          Thêm phòng
        </Button>
      </div>

      {pageError ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-[1.5rem] border border-vio-navy/10 bg-white shadow-soft" />
          ))}
        </div>
      ) : null}

      {!loading ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:hidden">
            {rooms.map((room) => (
              <Card key={room.id} className="flex h-full flex-col overflow-hidden p-0">
                <div className="relative aspect-[4/3] bg-vio-sand/30">
                  {room.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${room.image})` }}
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-heading text-2xl text-vio-navy">{room.name || room.id}</h2>
                        <p className="mt-1 text-sm uppercase tracking-[0.18em] text-vio-navy/40">{room.type || '-'}</p>
                      </div>
                      <span className="rounded-full bg-vio-navy/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-vio-navy">
                        {room.status || 'available'}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-vio-navy/60 line-clamp-3">
                      {room.description || 'No description'}
                    </p>
                    <div className="mt-4 space-y-1 text-sm text-vio-navy/55">
                      <p>Giá: {formatVnd(room.basePriceVnd || room.price || 0)}</p>
                      <p>Sức chứa: {room.capacity || 1} khách</p>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-col gap-2 pt-5">
                    <Button type="button" variant="secondary" className="w-full" onClick={() => openEdit(room)}>
                      Sửa
                    </Button>
                    <Button type="button" variant="ghost" className="w-full text-vio-error" onClick={() => handleDelete(room)}>
                      Xóa
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 hidden overflow-hidden rounded-[1.5rem] border border-vio-navy/10 bg-white shadow-soft lg:block">
            <table className="w-full border-collapse text-left">
              <thead className="bg-vio-sand/30 text-xs uppercase tracking-[0.2em] text-vio-navy/45">
                <tr>
                  <th className="px-5 py-4">Phòng</th>
                  <th className="px-5 py-4">Loại</th>
                  <th className="px-5 py-4">Giá</th>
                  <th className="px-5 py-4">Sức chứa</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-t border-vio-navy/8">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-vio-sand/30">
                          {room.image ? (
                            <div
                              className="h-full w-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${room.image})` }}
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-medium text-vio-navy">{room.name || room.id}</p>
                          <p className="line-clamp-1 text-sm text-vio-navy/45">{room.description || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-vio-navy/70">{room.type || '-'}</td>
                    <td className="px-5 py-4 text-sm text-vio-navy/70">{formatVnd(room.basePriceVnd || room.price || 0)}</td>
                    <td className="px-5 py-4 text-sm text-vio-navy/70">{room.capacity || 1}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-vio-navy/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-vio-navy">
                        {room.status || 'available'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" className="px-4 py-2 text-xs" onClick={() => openEdit(room)}>
                          Sửa
                        </Button>
                        <Button type="button" variant="ghost" className="px-4 py-2 text-xs text-vio-error" onClick={() => handleDelete(room)}>
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <Modal
        open={open}
        onClose={closeModal}
        title={editingRoom ? 'Sửa phòng' : 'Thêm phòng'}
        description="Điền đầy đủ thông tin phòng trước khi lưu."
        panelClassName="max-w-2xl"
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal} className="w-full sm:w-auto">
              Hủy
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </>
        }
      >
        <RoomForm value={form} onChange={setForm} showStatus={Boolean(editingRoom)} />
      </Modal>
    </div>
  )
}
