import Image from 'next/image'
import Link from 'next/link'
import type { Room } from '../../types/room'
import { formatVnd } from '../../lib/utils'

export function RoomCard({ room }: { room: Room }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Image
        src={room.image}
        alt={room.name}
        width={800}
        height={440}
        className="h-44 w-full object-cover"
      />
      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-slate-500">{room.code} · Floor {room.floor}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{room.name}</h3>
        <p className="mt-2 text-sm text-slate-600">{room.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-800">{formatVnd(room.pricePerNight)} / night</span>
          <Link
            href={`/rooms/${room.id}`}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  )
}
