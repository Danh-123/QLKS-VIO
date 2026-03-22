import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
/* eslint-disable react-hooks/refs -- @dnd-kit useDroppable / useDraggable */
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  initialMatrixRooms,
  initialUnassignedGuests,
  matrixRoomTypes,
  type MatrixRoom,
  type MatrixRoomStatus,
  type UnassignedGuest,
} from '../../admin/mockData'
import { InfoTip } from '../../components/admin/InfoTip'
import { cn } from '../../lib/cn'

function statusStyle(s: MatrixRoomStatus) {
  switch (s) {
    case 'available':
      return 'bg-emerald-50/90 text-emerald-900/80 ring-emerald-200/60'
    case 'occupied':
      return 'bg-vio-navy/[0.08] text-vio-navy ring-vio-navy/15'
    case 'dirty':
      return 'bg-amber-50/90 text-amber-900/70 ring-amber-200/50'
    case 'maintenance':
      return 'bg-rose-50/90 text-rose-900/75 ring-rose-200/50'
    case 'reserved':
      return 'bg-vio-gold/12 text-vio-navy ring-vio-gold/30'
    default:
      return 'bg-vio-white ring-vio-navy/10'
  }
}

const statusLabel: Record<MatrixRoomStatus, string> = {
  available: 'Trống',
  occupied: 'Có khách',
  dirty: 'Dọn dẹp',
  maintenance: 'Bảo trì',
  reserved: 'Giữ chỗ',
}

function canAccept(room: MatrixRoom) {
  if (room.status === 'maintenance' || room.status === 'dirty') return false
  if (room.status === 'occupied') return false
  if (room.status === 'reserved' && room.guestName) return false
  return room.status === 'available' || room.status === 'reserved'
}

function DraggableGuest({ guest }: { guest: UnassignedGuest }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: `guest-${guest.id}` })
  const style = transform
    ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)` }
    : undefined
  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'rounded-xl bg-vio-white px-4 py-2.5 text-sm font-medium text-vio-navy ring-1 ring-vio-navy/10 transition-shadow',
        isDragging && 'z-50 shadow-soft ring-vio-navy/25',
      )}
    >
      {guest.name}
    </button>
  )
}

function RoomCell({
  room,
  children,
}: {
  room: MatrixRoom
  children: ReactNode
}) {
  const accept = canAccept(room)
  const droppable = useDroppable({
    id: room.id,
    disabled: !accept,
  })
  return (
    <div
      ref={droppable.setNodeRef}
      className={cn(
        'min-h-[120px] rounded-xl p-4 ring-1 transition-shadow duration-300',
        statusStyle(room.status),
        droppable.isOver && accept && 'ring-2 ring-vio-gold/60',
        !accept && 'opacity-60',
      )}
    >
      {children}
    </div>
  )
}

export function RoomMatrixPage() {
  const [rooms, setRooms] = useState<MatrixRoom[]>(initialMatrixRooms)
  const [guests, setGuests] =
    useState<UnassignedGuest[]>(initialUnassignedGuests)
  const [floor, setFloor] = useState<string>('all')
  const [type, setType] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (floor !== 'all' && String(r.floor) !== floor) return false
      if (type !== 'all' && r.type !== type) return false
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      return true
    })
  }, [rooms, floor, type, statusFilter])

  const onDragEnd = (e: DragEndEvent) => {
    const overId = e.over?.id
    const activeId = String(e.active.id)
    if (!overId || !activeId.startsWith('guest-')) return
    const guestId = activeId.replace('guest-', '')
    const roomId = String(overId)
    const room = rooms.find((x) => x.id === roomId)
    const guest = guests.find((g) => g.id === guestId)
    if (!room || !guest || !canAccept(room)) return
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              status: 'occupied',
              guestName: guest.name,
            }
          : r,
      ),
    )
    setGuests((g) => g.filter((x) => x.id !== guestId))
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="space-y-10">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-vio-navy md:text-4xl">
            Sơ đồ phòng
          </h1>
          <p className="mt-2 text-sm text-vio-navy/50">
            Kéo khách chưa xếp phòng vào ô trống hoặc giữ chỗ trống.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-vio-navy/45">
            Tầng
            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="rounded-xl border-0 bg-vio-white px-4 py-2.5 text-sm font-normal tracking-normal text-vio-navy ring-1 ring-vio-navy/10"
            >
              <option value="all">Tất cả</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-vio-navy/45">
            Hạng
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border-0 bg-vio-white px-4 py-2.5 text-sm font-normal tracking-normal text-vio-navy ring-1 ring-vio-navy/10"
            >
              <option value="all">Tất cả</option>
              {matrixRoomTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-vio-navy/45">
            Trạng thái
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border-0 bg-vio-white px-4 py-2.5 text-sm font-normal tracking-normal text-vio-navy ring-1 ring-vio-navy/10"
            >
              <option value="all">Tất cả</option>
              <option value="available">Trống</option>
              <option value="occupied">Có khách</option>
              <option value="dirty">Dọn dẹp</option>
              <option value="maintenance">Bảo trì</option>
              <option value="reserved">Giữ chỗ</option>
            </select>
          </label>
        </div>

        {guests.length > 0 ? (
          <div className="rounded-xl bg-vio-white/80 p-6 ring-1 ring-vio-navy/[0.06]">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-vio-navy/45">
              Chưa xếp phòng
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {guests.map((g) => (
                <InfoTip key={g.id} content="Kéo vào ô phòng trống">
                  <DraggableGuest guest={g} />
                </InfoTip>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((room) => (
            <InfoTip
              key={room.id}
              content={`${room.code} · ${room.type} · Tầng ${room.floor} · ${statusLabel[room.status]}${room.guestName ? ` · ${room.guestName}` : ''}`}
            >
              <RoomCell room={room}>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-heading text-lg text-vio-navy">
                    {room.code}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-vio-navy/45">
                    {room.type}
                  </span>
                </div>
                <p className="mt-2 text-xs text-vio-navy/50">
                  {statusLabel[room.status]}
                </p>
                {room.guestName ? (
                  <p className="mt-3 text-sm font-medium text-vio-navy/80">
                    {room.guestName}
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-vio-navy/35">
                    {canAccept(room) ? 'Thả khách vào đây' : '—'}
                  </p>
                )}
              </RoomCell>
            </InfoTip>
          ))}
        </div>
      </div>
    </DndContext>
  )
}
