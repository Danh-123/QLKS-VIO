import type { RoomListing } from '../../data/rooms'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

type RoomCardProps = {
  room: RoomListing
  onDetail?: () => void
  className?: string
}

export function RoomCard({ room, onDetail, className }: RoomCardProps) {
  return (
    <Card
      as="article"
      className={cn(
        'group flex h-full flex-col overflow-hidden p-0 transition-all duration-500 ease-[var(--ease-vio)] hover:-translate-y-1 hover:shadow-soft-2xl',
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={room.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-vio)] group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vio-navy/35 via-transparent to-transparent"
          aria-hidden
        />
      </div>
      <div className="flex flex-1 flex-col gap-6 p-8 md:p-10">
        <div className="space-y-1">
          <h3 className="font-heading text-2xl font-medium tracking-tight text-vio-navy">
            {room.name}
          </h3>
          <p className="text-sm leading-relaxed text-vio-navy/55">
            {room.description}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
          <p className="text-sm font-medium text-vio-navy/70">{room.priceFrom}</p>
          <Button type="button" variant="secondary" onClick={onDetail}>
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Card>
  )
}
