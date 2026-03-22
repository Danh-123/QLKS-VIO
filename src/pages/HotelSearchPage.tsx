import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ScrollReveal } from '../components/guest/ScrollReveal'
import { Button } from '../components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { rooms } from '../data/rooms'

export function HotelSearchPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [locationQuery, setLocationQuery] = useState(() => {
    const state = location.state as { roomId?: string } | null
    if (state?.roomId) {
      const room = rooms.find((r) => r.id === state.roomId)
      if (room) return `${room.name} · VIO`
    }
    const q = new URLSearchParams(location.search).get('q')
    return q ?? 'VIO · Vịnh Nam'
  })
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 md:px-10 md:py-32">
      <ScrollReveal className="mb-16 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-vio-navy/40">
          Tìm kiếm
        </p>
        <h1 className="mt-4 font-heading text-4xl font-medium leading-[1.12] tracking-[0.02em] text-vio-navy md:text-5xl">
          Đặt kỳ nghỉ của bạn
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-[1.85] tracking-[0.02em] text-vio-navy/55">
          Nhập điểm đến, ngày và số khách — chúng tôi sẽ chỉ ra lựa chọn phù
          hợp.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <Card className="bg-vio-white/95">
        <CardHeader className="pb-10">
          <CardTitle>Thông tin lưu trú</CardTitle>
          <CardDescription>
            Giao diện tối giản — tập trung vào điều quan trọng.
          </CardDescription>
        </CardHeader>
        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/rooms')
          }}
        >
          <Input
            id="search-location"
            label="Địa điểm"
            name="location"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            autoComplete="off"
          />
          <div className="grid gap-8 sm:grid-cols-2">
            <Input
              id="search-checkin"
              label="Ngày đến"
              type="date"
              name="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <Input
              id="search-checkout"
              label="Ngày đi"
              type="date"
              name="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
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
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit">Xem phòng trống</Button>
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
