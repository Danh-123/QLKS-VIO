import { useMemo } from 'react'
import {
  CALENDAR_DAYS,
  calendarBookings,
  calendarStart,
  initialMatrixRooms,
} from '../../admin/mockData'
import { cn } from '../../lib/cn'

const DAY_W = 52

export function BookingCalendarPage() {
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
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
          Lịch đặt phòng
        </h1>
        <p className="mt-2 text-sm text-vio-navy/50">
          Trục ngang: ngày · Trục dọc: phòng · Cuộn ngang để xem toàn bộ.
        </p>
      </div>

      <div className="mt-24 overflow-x-auto rounded-xl bg-vio-white ring-1 ring-vio-navy/[0.06]">
        <div style={{ minWidth: 200 + timelineWidth }} className="pb-4">
          <div className="sticky top-0 z-30 flex border-b border-vio-navy/[0.06] bg-vio-cream/95 backdrop-blur-sm">
            <div className="sticky left-0 z-40 flex w-[200px] shrink-0 items-end border-r border-vio-navy/[0.06] bg-vio-cream/95 px-4 py-3">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-vio-navy/45">
                Phòng
              </span>
            </div>
            <div className="flex" style={{ width: timelineWidth }}>
              {dayHeaders.map((d, i) => (
                <div
                  key={i}
                  style={{ width: DAY_W }}
                  className="shrink-0 border-l border-vio-navy/[0.04] px-1 py-3 text-center"
                >
                  <p className="text-[10px] text-vio-navy/40">
                    {d.toLocaleDateString('vi-VN', { weekday: 'short' })}
                  </p>
                  <p className="text-xs font-medium text-vio-navy">
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
                className="flex border-b border-vio-navy/[0.05] last:border-0"
              >
                <div className="sticky left-0 z-20 flex w-[200px] shrink-0 items-center border-r border-vio-navy/[0.06] bg-vio-white px-4 py-2">
                  <div>
                    <p className="font-medium text-vio-navy">{room.code}</p>
                    <p className="text-[11px] text-vio-navy/45">
                      {room.type} · Tầng {room.floor}
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
                        className="shrink-0 border-l border-vio-navy/[0.04]"
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
                        className={cn(
                          'absolute top-1/2 z-10 h-7 -translate-y-1/2 rounded-lg px-2 text-[10px] leading-7 text-vio-white shadow-soft-sm',
                          bar.color,
                        )}
                        style={{ left: left + 2, width: Math.max(width, 40) }}
                        title={`${bar.guest}`}
                      >
                        <span className="block truncate">{bar.guest}</span>
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
