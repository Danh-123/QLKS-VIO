import { motion } from 'framer-motion'
import type { RoomListing } from '../../data/rooms'
import { cn } from '../../lib/cn'

type RoomCardProps = {
  room: RoomListing
  onDetail?: () => void
  unavailable?: boolean
  className?: string
  featured?: boolean
}

export function RoomCard({
  room,
  onDetail,
  unavailable = false,
  className,
  featured = false,
}: RoomCardProps) {
  return (
    <motion.article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        featured ? 'md:min-h-[420px]' : '',
        className,
      )}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {room.image ? (
          <motion.img
            src={room.image}
            alt={room.name}
            className="h-full w-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">Không có ảnh</div>
        )}

        {(room.badge || featured) && (
          <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
            <span className="rounded-full bg-[#1E3A5F] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm">
              {room.badge || (featured ? 'Ưu đãi hôm nay' : 'Best Seller')}
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden />
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-vio-navy md:text-2xl">{room.name}</h3>
          <p className="line-clamp-2 text-sm text-vio-navy/60">{room.description}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-vio-navy/70">
          <div className="flex items-center gap-2"><span>👤</span><span>{room.guests || '2'} khách</span></div>
          <div className="flex items-center gap-2"><span>🛏</span><span>{room.beds || '1'} giường</span></div>
          <div className="flex items-center gap-2"><span>📐</span><span>{room.size || '—'}</span></div>
          <div className="flex items-center gap-2"><span>🌊</span><span>{room.view || '—'}</span></div>
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-vio-navy/60">Giá từ</span>
            <span className="text-xl font-semibold text-vio-navy md:text-2xl">{room.priceFrom}</span>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <motion.button
              type="button"
              onClick={onDetail}
              disabled={unavailable}
              className="w-full rounded-xl bg-[#1E3A5F] px-4 py-3 text-white shadow-sm transition hover:bg-[#162B46] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {unavailable ? 'Hết phòng' : 'Đặt ngay'}
            </motion.button>

            <motion.button
              type="button"
              onClick={onDetail}
              disabled={unavailable}
              className="w-full rounded-xl border border-vio-navy/10 bg-white px-4 py-3 text-vio-navy transition hover:border-vio-navy/20 hover:bg-vio-sand/30 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Xem chi tiết
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
