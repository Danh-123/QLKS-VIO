"use client"

import { Input } from '../../../legacy/components/ui/Input'

const roomStatusOptions = [
  { label: 'Available', value: 'available' },
  { label: 'Occupied', value: 'occupied' },
  { label: 'Maintenance', value: 'maintenance' },
] as const

export type RoomStatus = (typeof roomStatusOptions)[number]['value']

export type RoomFormState = {
  name: string
  type: string
  price: string
  image: string
  description: string
  capacity: string
  status: RoomStatus
}

type Props = {
  value: RoomFormState
  onChange: (next: RoomFormState) => void
  /** Chỉ hiện khi sửa phòng; thêm mới luôn gửi status: 'available' từ payload cha. */
  showStatus: boolean
}

export function RoomForm({ value, onChange, showStatus }: Props) {
  const set = (patch: Partial<RoomFormState>) => onChange({ ...value, ...patch })

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
      <Input id="room-name" label="Tên phòng" value={value.name} onChange={(e) => set({ name: e.target.value })} />
      <Input id="room-type" label="Loại phòng" value={value.type} onChange={(e) => set({ type: e.target.value })} />
      <Input
        id="room-price"
        label="Giá (VND)"
        type="number"
        min={0}
        value={value.price}
        onChange={(e) => set({ price: e.target.value })}
      />
      <Input
        id="room-capacity"
        label="Sức chứa"
        type="number"
        min={1}
        value={value.capacity}
        onChange={(e) => set({ capacity: e.target.value })}
      />
      <div className="md:col-span-2">
        <Input id="room-image" label="Ảnh (URL)" value={value.image} onChange={(e) => set({ image: e.target.value })} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="room-description" className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45">
          Mô tả
        </label>
        <textarea
          id="room-description"
          value={value.description}
          onChange={(e) => set({ description: e.target.value })}
          rows={5}
          className="w-full rounded-2xl border border-vio-navy/10 bg-vio-white px-4 py-3 text-sm text-vio-navy outline-none focus:border-vio-navy/30"
        />
      </div>
      {showStatus ? (
        <div className="md:col-span-2">
          <label htmlFor="room-status" className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45">
            Trạng thái
          </label>
          <select
            id="room-status"
            value={value.status}
            onChange={(e) => set({ status: e.target.value as RoomStatus })}
            className="w-full rounded-2xl border border-vio-navy/10 bg-vio-white px-4 py-3 text-sm text-vio-navy outline-none focus:border-vio-navy/30"
          >
            {roomStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  )
}

export { roomStatusOptions }
