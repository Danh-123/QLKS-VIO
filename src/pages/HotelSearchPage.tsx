import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ScrollReveal } from '../components/guest/ScrollReveal'
import { Button } from '../components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { rooms } from '../data/rooms'
import { useAppData } from '../state/AppDataContext'

export function HotelSearchPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    hotels,
    searchFilters,
    updateSearchFilters,
    setBookingDraft,
    todayIso,
    isValidDateRange,
  } = useAppData()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const state = location.state as { roomId?: string } | null
    if (state?.roomId) {
      const room = rooms.find((r) => r.id === state.roomId)
      if (room) {
        updateSearchFilters({ locationQuery: `${room.name} · VIO` })
      }
    }
    const q = new URLSearchParams(location.search).get('q')
    if (q) {
      updateSearchFilters({ locationQuery: q })
    }
  }, [location.search, location.state, updateSearchFilters])

  return (
    <div className="vio-container vio-section">
      <ScrollReveal className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-vio-navy/40">
          Tìm kiếm
        </p>
        <h1 className="mt-4 font-heading text-4xl font-medium leading-[1.12] tracking-wide text-vio-navy md:text-5xl">
          Đặt kỳ nghỉ của bạn
        </h1>
        <p className="mx-auto mt-6 text-base leading-[1.85] tracking-[0.02em] text-vio-navy/55">
          Nhập điểm đến, ngày và số khách — chúng tôi sẽ chỉ ra lựa chọn phù
          hợp.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.08} className="mt-24">
        <Card className="bg-vio-white/95">
        <CardHeader className="pb-8">
          <CardTitle>Thông tin lưu trú</CardTitle>
          <CardDescription>
            Giao diện tối giản — tập trung vào điều quan trọng.
          </CardDescription>
        </CardHeader>
        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault()
            if (!isValidDateRange(searchFilters.checkIn, searchFilters.checkOut)) {
              setError('Vui lòng chọn ngày nhận/trả phòng hợp lệ.')
              return
            }
            const safeGuests = String(Math.max(1, parseInt(searchFilters.guests, 10) || 2))
            setBookingDraft({
              roomId: '',
              checkIn: searchFilters.checkIn,
              checkOut: searchFilters.checkOut,
              guests: safeGuests,
              adults: safeGuests,
              children: '0',
            })
            setError(null)
            navigate('/rooms')
          }}
        >
          {error ? (
            <p
              className="rounded-xl bg-vio-cream/70 px-4 py-3 text-sm text-vio-navy/70 ring-1 ring-vio-gold/35"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <div>
            <label
              htmlFor="search-hotel"
              className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45"
            >
              Khách sạn
            </label>
            <select
              id="search-hotel"
              value={searchFilters.hotelId}
              onChange={(e) => {
                const hotelId = e.target.value
                const hotel = hotels.find((h) => h.id === hotelId)
                updateSearchFilters({
                  hotelId,
                  locationQuery: hotel
                    ? `${hotel.name} · ${hotel.location}`
                    : searchFilters.locationQuery,
                })
              }}
              className="w-full rounded-xl border-0 bg-vio-white px-4 py-3 text-base text-vio-navy shadow-soft-sm ring-1 ring-vio-navy/10 transition-all duration-300 focus:ring-2 focus:ring-vio-navy/20 focus:outline-none"
            >
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name} · {hotel.location}
                </option>
              ))}
            </select>
          </div>
          <Input
            id="search-location"
            label="Địa điểm"
            name="location"
            value={searchFilters.locationQuery}
            onChange={(e) =>
              updateSearchFilters({ locationQuery: e.target.value })
            }
            autoComplete="off"
          />
          <div className="grid gap-8 sm:grid-cols-2">
            <Input
              id="search-checkin"
              label="Ngày đến"
              type="date"
              name="checkIn"
              min={todayIso}
              value={searchFilters.checkIn}
              onChange={(e) => {
                const nextCheckIn = e.target.value
                const nextCheckOut =
                  searchFilters.checkOut && searchFilters.checkOut <= nextCheckIn
                    ? ''
                    : searchFilters.checkOut
                updateSearchFilters({
                  checkIn: nextCheckIn,
                  checkOut: nextCheckOut,
                })
                setError(null)
              }}
            />
            <Input
              id="search-checkout"
              label="Ngày đi"
              type="date"
              name="checkOut"
              min={searchFilters.checkIn || todayIso}
              value={searchFilters.checkOut}
              onChange={(e) => {
                updateSearchFilters({ checkOut: e.target.value })
                setError(null)
              }}
            />
          </div>
          <Input
            id="search-guests"
            label="Số khách"
            type="number"
            name="guests"
            min={1}
            max={12}
            inputMode="numeric"
            value={searchFilters.guests}
            onChange={(e) => updateSearchFilters({ guests: e.target.value })}
          />
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit">Discover Rooms</Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/rooms')}
            >
              Duyệt tất cả phòng
            </Button>
          </div>
        </form>
      </Card>
      </ScrollReveal>
    </div>
  )
}
