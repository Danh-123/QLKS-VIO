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
import { useEffect, useMemo, useState } from 'react'
import {
  initialMatrixRooms,
  initialUnassignedGuests,
  matrixRoomTypes,
  type MatrixRoom,
  type MatrixRoomStatus,
  type UnassignedGuest,
} from '../../admin/mockData'
import { AdminPageHero } from '../../components/admin/AdminPageHero'
import { InfoTip } from '../../components/admin/InfoTip'
import { cn } from '../../lib/cn'

function statusStyle(s: MatrixRoomStatus) {
  switch (s) {
    case 'available':
      return 'bg-vio-white text-vio-navy border border-vio-linen'
    case 'occupied':
      return 'bg-vio-dashboard-bg text-vio-navy border border-vio-linen'
    case 'dirty':
      return 'bg-vio-dashboard-bg text-vio-text-secondary border border-vio-linen'
    case 'maintenance':
      return 'bg-vio-dashboard-bg text-vio-text-secondary border border-vio-linen'
    case 'reserved':
      return 'bg-vio-gold/10 text-vio-navy border border-vio-gold/60'
    default:
      return 'bg-vio-white text-vio-navy border border-vio-linen'
  }
}

const statusLabel: Record<MatrixRoomStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  dirty: 'Cleaning',
  maintenance: 'Maintenance',
  reserved: 'Reserved',
}

const operationalStatuses: MatrixRoomStatus[] = [
  'available',
  'occupied',
  'dirty',
  'maintenance',
]

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
        'rounded-xl border border-vio-linen bg-vio-white px-4 py-2.5 text-sm font-medium text-vio-navy transition-shadow',
        isDragging && 'z-50 border-vio-gold shadow-soft',
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
        'min-h-[120px] rounded-xl p-3 transition-colors duration-200 hover:bg-vio-gold/[0.04]',
        statusStyle(room.status),
        droppable.isOver && accept && 'border-vio-gold bg-vio-gold/10',
        !accept && 'opacity-60',
      )}
    >
      {children}
    </div>
  )
}

export function RoomMatrixPage() {
  const [rooms, setRooms] = useState<MatrixRoom[]>(() =>
    initialMatrixRooms.map((room) =>
      room.status === 'reserved' ? { ...room, status: 'available' } : room,
    ),
  )
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

  useEffect(() => {
    if (rooms.length === 0) return

    const randomGuestNames = [
      'Walk-in HN',
      'Walk-in SG',
      'Late Checkin',
      'VIP Arrival',
    ]

    const timer = window.setInterval(() => {
      setRooms((prev) => {
        if (prev.length === 0) return prev
        const index = Math.floor(Math.random() * prev.length)
        const room = prev[index]

        const nextMap: Record<MatrixRoomStatus, MatrixRoomStatus[]> = {
          available: ['occupied', 'dirty', 'maintenance'],
          occupied: ['dirty', 'available'],
          dirty: ['available', 'maintenance'],
          maintenance: ['available', 'dirty'],
          reserved: ['occupied', 'available'],
        }

        const options = nextMap[room.status]
        if (!options || options.length === 0) return prev

        const nextStatus = options[Math.floor(Math.random() * options.length)]
        const updated = [...prev]
        updated[index] = {
          ...room,
          status: nextStatus,
          guestName:
            nextStatus === 'occupied'
              ? room.guestName ||
                randomGuestNames[Math.floor(Math.random() * randomGuestNames.length)]
              : undefined,
        }
        return updated
      })
    }, 5000)

    return () => {
      window.clearInterval(timer)
    }
  }, [rooms.length])

  const rotateStatus = (roomId: string) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room
        const idx = operationalStatuses.indexOf(room.status)
        const next = operationalStatuses[(idx + 1) % operationalStatuses.length]
        return {
          ...room,
          status: next,
          guestName: next === 'occupied' ? room.guestName : undefined,
        }
      }),
    )
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="space-y-8">
        <AdminPageHero
          eyebrow="Availability Intelligence"
          title="Availability Matrix"
          description="Track inventory room-by-room and assign guests with a calm, operational view."
          imageUrl="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1800&q=80"
        />

        <div className="rounded-xl bg-vio-white p-6">
        <div className="flex flex-wrap gap-6">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.08em] text-vio-text-secondary">
            Floor
            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="rounded-lg border border-vio-linen bg-vio-white px-3 py-2 text-sm text-vio-navy"
            >
              <option value="all">All</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.08em] text-vio-text-secondary">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-lg border border-vio-linen bg-vio-white px-3 py-2 text-sm text-vio-navy"
            >
              <option value="all">All</option>
              {matrixRoomTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.08em] text-vio-text-secondary">
            Status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-vio-linen bg-vio-white px-3 py-2 text-sm text-vio-navy"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="dirty">Dirty</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </label>
        </div>

        {guests.length > 0 ? (
          <div className="mt-8 rounded-xl border border-vio-linen bg-vio-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-vio-text-secondary">
              Unassigned Guests
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {guests.map((g) => (
                <InfoTip key={g.id} content="Drag into an available room">
                  <DraggableGuest guest={g} />
                </InfoTip>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-vio-text-secondary">
          <span className="font-semibold uppercase tracking-[0.08em]">Legend</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-vio-white ring-1 ring-vio-linen" />Available</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-vio-dashboard-bg ring-1 ring-vio-linen" />Booked</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-vio-gold/20 ring-1 ring-vio-gold" />Selected</span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((room) => (
            <InfoTip
              key={room.id}
              content={`${room.code} · ${room.type} · Floor ${room.floor} · ${statusLabel[room.status]}${room.guestName ? ` · ${room.guestName}` : ''}`}
            >
              <RoomCell room={room}>
                <button
                  type="button"
                  onClick={() => rotateStatus(room.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-vio-navy">
                      {room.code}
                    </span>
                    <span className="text-xs font-medium text-vio-navy">
                      {room.type}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-vio-text-secondary">
                    {statusLabel[room.status]}
                  </p>
                  {room.guestName ? (
                    <p className="mt-3 text-sm font-medium text-vio-navy">
                      {room.guestName}
                    </p>
                  ) : (
                    <p className="mt-3 text-xs text-vio-text-secondary">
                      {canAccept(room) ? 'Drop guest here' : 'Unavailable'}
                    </p>
                  )}
                </button>
              </RoomCell>
            </InfoTip>
          ))}
        </div>
        </div>
      </div>
    </DndContext>
  )
}
