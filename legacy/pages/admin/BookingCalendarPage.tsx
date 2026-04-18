import { useMemo } from 'react'
import {
  CALENDAR_DAYS,
  calendarBookings,
  calendarStart,
  initialMatrixRooms,
} from '../../admin/mockData'
import { AdminPageHero } from '../../components/admin/AdminPageHero'
import { cn } from '../../lib/cn'

const DAY_W = 52

export function BookingCalendarPage() {
  const views = ['Month', 'Week', 'Day'] as const
  const dayHeaders = useMemo(() => {
    return Array.from({ length: CALENDAR_DAYS }, (_, i) => {
      const d = new Date(calendarStart)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [])

  const rooms = initialMatrixRooms

  const timelineWidth = CALENDAR_DAYS * DAY_W

  return (
    <div className="space-y-8">
      <AdminPageHero
        eyebrow="Reservation Timeline"
        title="Booking Calendar"
        description="Review daily movement across rooms and bookings with a calm, detail-first timeline view."
        imageUrl="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1800&q=80"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-vio-white p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-vio-linen px-3 py-1.5 text-vio-text-primary transition-colors duration-200 hover:border-vio-gold hover:text-vio-gold"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-lg border border-vio-linen px-3 py-1.5 text-vio-text-primary transition-colors duration-200 hover:border-vio-gold hover:text-vio-gold"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {views.map((view, index) => (
            <button
              key={view}
              type="button"
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm transition-colors duration-200',
                index === 1
                  ? 'border-vio-gold bg-vio-gold text-vio-white'
                  : 'border-vio-linen text-vio-text-primary hover:border-vio-gold hover:text-vio-gold',
              )}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-vio-white p-6">
        <div style={{ minWidth: 200 + timelineWidth }} className="pb-4">
          <div className="sticky top-0 z-30 flex border-b border-vio-linen bg-vio-white/95 backdrop-blur-sm">
            <div className="sticky left-0 z-40 flex w-[200px] shrink-0 items-end border-r border-vio-linen bg-vio-white/95 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-[0.05em] text-vio-text-secondary">
                Room
              </span>
            </div>
            <div className="flex" style={{ width: timelineWidth }}>
              {dayHeaders.map((d, i) => (
                <div
                  key={i}
                  style={{ width: DAY_W }}
                  className="shrink-0 border-l border-vio-linen px-1 py-3 text-center"
                >
                    <p className="text-[11px] uppercase text-vio-text-secondary">
                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={cn(
                    'text-sm font-medium text-vio-navy',
                    i === 0 && 'text-vio-gold',
                  )}>
                    {d.getDate()}/{d.getMonth() + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {rooms.map((room) => {
            const bars = calendarBookings.filter((b) => b.roomId === room.id)
            return (
              <div
                key={room.id}
                className="flex border-b border-vio-linen last:border-0"
              >
                <div className="sticky left-0 z-20 flex w-[200px] shrink-0 items-center border-r border-vio-linen bg-vio-white px-4 py-2">
                  <div>
                    <p className="text-sm font-medium text-vio-navy">{room.code}</p>
                    <p className="text-[11px] text-vio-text-secondary">
                      {room.type} · Floor {room.floor}
                    </p>
                  </div>
                </div>
                <div
                  className="relative shrink-0 py-2"
                  style={{ width: timelineWidth }}
                >
                  <div
                    className="absolute inset-y-2 left-0 flex"
                    style={{ width: timelineWidth }}
                  >
                    {Array.from({ length: CALENDAR_DAYS }).map((_, i) => (
                      <div
                        key={i}
                        style={{ width: DAY_W }}
                        className="shrink-0 border-l border-vio-linen"
                      />
                    ))}
                  </div>
                  {bars.map((bar) => {
                    const left = bar.startDay * DAY_W
                    const span = bar.endDay - bar.startDay + 1
                    const width = span * DAY_W - 4
                    return (
                      <div
                        key={bar.id}
                        className="absolute top-1/2 z-10 h-8 -translate-y-1/2 border-l-[3px] border-vio-gold bg-vio-gold/15 px-2 text-vio-navy shadow-soft-sm"
                        style={{ left: left + 2, width: Math.max(width, 40) }}
                        title={`${bar.guest}`}
                      >
                        <span className="mt-1 block truncate text-[13px] font-medium leading-tight">
                          {bar.guest}
                        </span>
                        <span className="block truncate text-[11px] text-vio-text-secondary">
                          15:00 - 11:00
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
