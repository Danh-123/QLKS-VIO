'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchBookings } from '../../../../lib/api'
import type { Booking, BookingStatus } from '../../../../types/booking'
import { cn } from '../../../../lib/utils'
import Image from 'next/image'

// Stub calendar data - migrate from legacy mock
const calendarDays = 14
const startDate = new Date()
const dayHeaders = Array.from({ length: calendarDays }, (_, i) => {
  const d = new Date(startDate)
  d.setDate(d.getDate() + i)
  return d
})

const DAY_WIDTH = 64 // DESIGN.md spacing scale

export default function BookingCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchBookings()
      setBookings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload, reloadKey])

  const timelineWidth = calendarDays * DAY_WIDTH

  const bookingsByDay = bookings.reduce((acc, b) => {
    const checkIn = new Date(b.checkIn)
    const dayIndex = Math.floor((checkIn.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    if (dayIndex >= 0 && dayIndex < calendarDays) {
      acc[dayIndex].push(b)
    }
    return acc
  }, Array.from({ length: calendarDays }, () => [] as Booking[]))

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative h-[260px] rounded-3xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c"
          alt="Booking Calendar"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30" />
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
          <p className="text-xs uppercase tracking-wider text-orange-400">Reservation Timeline</p>
          <h1 className="text-3xl md:text-4xl font-cormorant font-normal text-white mt-2">Booking Calendar</h1>
        </div>
      </section>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white/50 backdrop-blur rounded-2xl border border-orange-100/50">
        <div className="flex gap-2">
          <button className="p-2 rounded-xl border border-orange-200 hover:border-orange-300 transition-all">
            ←
          </button>
          <button className="p-2 rounded-xl border border-orange-300 bg-orange-50 font-medium px-4 hover:bg-orange-100">
            Month
          </button>
          <button className="p-2 rounded-xl border border-orange-200 hover:border-orange-300">
            Week
          </button>
          <button className="p-2 rounded-xl border border-orange-200 hover:border-orange-300">
            Day
          </button>
          <button className="p-2 rounded-xl border border-orange-200 hover:border-orange-300">
            →
          </button>
        </div>
        <button className="px-6 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-all">
          New Booking
        </button>
      </div>

      {/* Calendar Timeline */}
      <div className="overflow-x-auto rounded-2xl border border-orange-100/50 bg-white/50 backdrop-blur shadow-xl">
        <div style={{ minWidth: 240 + timelineWidth }} className="pb-8">
          {/* Header Row */}
          <div className="sticky top-0 z-20 flex bg-white/90 backdrop-blur border-b border-orange-100">
            <div className="w-60 shrink-0 p-4 border-r border-orange-100">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Room</h3>
            </div>
            <div className="flex" style={{ width: timelineWidth }}>
              {dayHeaders.map((d, i) => (
                <div key={i} style={{ width: DAY_WIDTH }} className="shrink-0 p-3 text-center border-l border-orange-100 first:border-l-0">
                  <p className="text-xs uppercase tracking-wider text-gray-500">{d.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-0.5">{d.getDate()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rooms Rows */}
          <div className="divide-y divide-orange-100">
            {Array.from({ length: 8 }, (_, roomIndex) => {
              const roomBookings = bookingsByDay.map(dayBookings => dayBookings[roomIndex] || [])
              return (
                <div key={roomIndex} className="flex">
                  <div className="w-60 shrink-0 p-4 bg-gradient-to-b from-white to-orange-50 border-r border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center font-semibold text-orange-600">
                        R{roomIndex + 101}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Deluxe King</p>
                        <p className="text-xs text-gray-500 mt-0.5">Floor 3</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: timelineWidth }} className="relative py-4 px-2">
                    {/* Day grid lines */}
                    <div className="absolute inset-y-0 left-0 flex w-full h-full">
                      {Array.from({ length: calendarDays }).map((_, i) => (
                        <div key={i} style={{ width: DAY_WIDTH }} className="shrink-0 border-l border-orange-100 h-full first:border-l-0" />
                      ))}
                    </div>
                    
                    {/* Booking bars */}
                    {roomBookings.map((booking, dayIndex) => {
                      const left = dayIndex * DAY_WIDTH + 4
                      const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))
                      const width = Math.max(nights * DAY_WIDTH - 8, 60)
                      return (
                        <div
                          key={booking.id}
                          className="absolute top-1/2 z-10 bg-gradient-to-r from-orange-500/15 to-orange-400/20 border border-orange-200 rounded-xl px-3 py-2 shadow-lg -translate-y-1/2 flex flex-col h-16 justify-center"
                          style={{ left, width }}
                        >
                          <p className="text-xs font-semibold text-gray-900 truncate">{booking.customerName}</p>
                          <p className="text-xs text-orange-700 font-medium">{booking.status.toUpperCase()}</p>
                        </div>
                      )
                    })}
                    
                    {/* Today indicator */}
                    <div className="absolute top-1/2 h-10 -translate-y-1/2 bg-gradient-to-r from-orange-400/30 to-orange-500/30 rounded-lg shadow-sm flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600">TODAY</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
