import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { ScrollReveal } from '../components/guest/ScrollReveal'
import { RoomHeroEditorial } from '../components/room/RoomHeroEditorial'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import {
  formatVnd,
  getRelatedRooms,
  getRoomDetail,
  type RoomAmenity,
} from '../data/roomDetails'
import { cn } from '../lib/cn'
import { useAppData } from '../state/AppDataContext'

const reveal = 0.72
const amenityEase = [0.25, 0.1, 0.25, 1] as const

function AmenityTile({ item }: { item: RoomAmenity }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-vio-white/70 p-6 shadow-soft-sm ring-1 ring-vio-navy/[0.05] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-soft-lg">
      <span className="text-vio-gold/90" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v3M12 18v3M5 12H2M22 12h-3M6.3 6.3L4.2 4.2M19.8 19.8l-2.1-2.1M6.3 17.7l-2.1 2.1M19.8 4.2l-2.1 2.1"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-sm leading-relaxed tracking-[0.04em] text-vio-navy/65">
        {item.label}
      </span>
    </div>
  )
}

function BookingPanel({
  checkIn,
  checkOut,
  guests,
  minCheckIn,
  minCheckOut,
  onChangeCi,
  onChangeCo,
  onChangeGuests,
  nights,
  subtotal,
  taxEstimate,
  total,
  canBook,
  onBook,
  className,
}: {
  checkIn: string
  checkOut: string
  guests: string
  minCheckIn: string
  minCheckOut: string
  onChangeCi: (v: string) => void
  onChangeCo: (v: string) => void
  onChangeGuests: (v: string) => void
  nights: number
  subtotal: number
  taxEstimate: number
  total: number
  canBook: boolean
  onBook: () => void
  className?: string
}) {
  return (
    <Card
      className={cn(
        'overflow-hidden p-0 shadow-soft-lg ring-vio-navy/[0.06]',
        className,
      )}
    >
      <div className="border-b border-vio-navy/[0.06] bg-vio-cream/40 px-8 py-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-vio-navy/45">
          Đặt chỗ
        </p>
        <p className="mt-2 text-sm leading-relaxed text-vio-navy/50">
          Chọn ngày và số khách — giá cập nhật theo đêm.
        </p>
      </div>
      <div className="space-y-6 px-8 py-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            id="rd-ci"
            label="Nhận phòng"
            type="date"
            min={minCheckIn}
            value={checkIn}
            onChange={(e) => onChangeCi(e.target.value)}
          />
          <Input
            id="rd-co"
            label="Trả phòng"
            type="date"
            min={minCheckOut}
            value={checkOut}
            onChange={(e) => onChangeCo(e.target.value)}
          />
        </div>
        <Input
          id="rd-guests"
          label="Khách"
          type="number"
          min={1}
          max={12}
          value={guests}
          onChange={(e) => onChangeGuests(e.target.value)}
        />
        <div className="space-y-3 border-t border-vio-navy/[0.06] pt-6 text-sm text-vio-navy/65">
          <div className="flex justify-between">
            <span>
              {nights} đêm · ước tính
            </span>
            <span className="tabular-nums text-vio-navy/80">
              {formatVnd(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-vio-navy/55">
            <span>Phí & dịch vụ</span>
            <span className="tabular-nums">{formatVnd(taxEstimate)}</span>
          </div>
          <div className="flex justify-between border-t border-vio-navy/[0.06] pt-3 font-medium text-vio-navy">
            <span>Tổng</span>
            <span className="tabular-nums">{formatVnd(total)}</span>
          </div>
        </div>
        <Button
          type="button"
          className="w-full"
          disabled={!canBook}
          aria-disabled={!canBook}
          title={!canBook ? 'Vui lòng chọn ngày hợp lệ hoặc phòng đang hết' : undefined}
          onClick={onBook}
        >
          Đặt phòng ngay
        </Button>
      </div>
    </Card>
  )
}

import { useEffect } from 'react'

export function RoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const {
    bookingDraft,
    setBookingDraft,
    todayIso,
    isValidDateRange,
    isRoomAvailable,
    calculatePricing,
  } = useAppData()

  // Scroll to top when id (room) changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const room = id ? getRoomDetail(id) : undefined
  const [checkIn, setCheckIn] = useState(
    () => searchParams.get('checkIn') ?? bookingDraft.checkIn,
  )
  const [checkOut, setCheckOut] = useState(
    () => searchParams.get('checkOut') ?? bookingDraft.checkOut,
  )
  const [guests, setGuests] = useState(
    () => searchParams.get('guests') ?? bookingDraft.guests,
  )

  const related = useMemo(
    () => (room ? getRelatedRooms(room.id) : []),
    [room],
  )

  if (!room) {
    return <Navigate to="/rooms" replace />
  }

  const nightsParam = searchParams.get('nights')
  const pricing = calculatePricing(room.id, checkIn, checkOut)
  const nights =
    nightsParam != null && nightsParam !== ''
      ? Math.max(1, parseInt(nightsParam, 10) || 1)
      : pricing.nights

  const subtotal = pricing.subtotal
  const taxEstimate = pricing.serviceFee
  const total = pricing.total
  const datesValid = isValidDateRange(checkIn, checkOut)
  const available = datesValid
    ? isRoomAvailable(room.id, checkIn, checkOut)
    : false
  const canBook = datesValid && available

  const goBook = () => {
    if (!canBook) return
    const q = new URLSearchParams()
    q.set('room', room.id)
    if (checkIn) q.set('checkIn', checkIn)
    if (checkOut) q.set('checkOut', checkOut)
    q.set('guests', guests)
    setBookingDraft({
      roomId: room.id,
      checkIn,
      checkOut,
      guests,
      adults: guests,
      children: '0',
    })
    navigate(`/book?${q.toString()}`)
  }

  const updateCheckIn = (value: string) => {
    setCheckIn(value)
    if (checkOut && checkOut <= value) {
      setCheckOut('')
      setBookingDraft({ checkOut: '' })
    }
    setBookingDraft({ checkIn: value })
  }

  const updateCheckOut = (value: string) => {
    setCheckOut(value)
    setBookingDraft({ checkOut: value })
  }

  const updateGuests = (value: string) => {
    const safe = String(Math.max(1, parseInt(value, 10) || 1))
    setGuests(safe)
    setBookingDraft({ guests: safe, adults: safe, children: '0' })
  }

  return (
    <div className="overflow-x-clip bg-vio-cream">
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
        <RoomHeroEditorial
          images={room.gallery}
          roomName={room.name}
          tagline={room.tagline}
          priceLabel={formatVnd(room.pricePerNight)}
          onBook={goBook}
          onBack={() => navigate(-1)}
        />
      </div>

      <div className="vio-container py-16 md:py-24">
        <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-12">
          <div className="min-w-0 lg:col-span-2">
            <ScrollReveal duration={reveal} y={24} className="mb-24 lg:hidden">
              <div id="booking">
                <BookingPanel
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  minCheckIn={todayIso}
                  minCheckOut={checkIn || todayIso}
                  onChangeCi={updateCheckIn}
                  onChangeCo={updateCheckOut}
                  onChangeGuests={updateGuests}
                  nights={nights}
                  subtotal={subtotal}
                  taxEstimate={taxEstimate}
                  total={total}
                  canBook={canBook}
                  onBook={goBook}
                />
              </div>
            </ScrollReveal>

            <ScrollReveal duration={reveal} y={32}>
              <div className="grid gap-12 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/40">
                    Câu chuyện phòng
                  </p>
                  <p className="mt-6 text-lg leading-[1.85] tracking-[0.03em] text-vio-navy/70 md:text-xl">
                    {room.description}
                  </p>
                  <div className="mt-10 space-y-6">
                    {room.story.map((p, idx) => (
                      <p
                        key={idx}
                        className="text-base leading-[1.95] tracking-[0.03em] text-vio-navy/58 md:text-lg"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/40">
                    Thông tin chính
                  </p>
                  <dl className="mt-8 space-y-6 border-t border-vio-navy/[0.06] pt-8">
                    {[
                      ['Diện tích', room.keyFacts.size],
                      ['Giường', room.keyFacts.bed],
                      ['Tối đa', `${room.keyFacts.maxGuests} khách`],
                      ['Tầm nhìn', room.keyFacts.view],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between gap-6 border-b border-vio-navy/[0.05] pb-6 last:border-0 last:pb-0"
                      >
                        <dt className="text-xs uppercase tracking-[0.22em] text-vio-navy/40">
                          {k}
                        </dt>
                        <dd className="text-right font-medium tracking-[0.02em] text-vio-navy/85">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </ScrollReveal>

            {room.breakImages.map((src, i) => (
              <ScrollReveal
                key={src}
                duration={reveal}
                y={24}
                className={cn(i > 0 && 'mt-24', i === 0 && 'mt-24')}
              >
                <div className="overflow-hidden rounded-2xl shadow-soft-lg ring-1 ring-vio-navy/[0.06]">
                  <img
                    src={src}
                    alt=""
                    className="aspect-[21/9] w-full object-cover transition-transform duration-700 ease-[var(--ease-vio)] hover:scale-[1.03] md:aspect-[2.4/1]"
                    loading="lazy"
                  />
                </div>
              </ScrollReveal>
            ))}

            <ScrollReveal duration={reveal} y={28} className="mt-24">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/40">
                Tiện nghi
              </p>
              <h2 className="mt-4 font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
                Mọi thứ cần cho kỳ nghỉ
              </h2>
              <motion.ul
                className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-10%' }}
                variants={{
                  show: {
                    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
                  },
                }}
              >
                {room.amenities.map((a) => (
                  <motion.li
                    key={a.id}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.68, ease: amenityEase },
                      },
                    }}
                  >
                    <AmenityTile item={a} />
                  </motion.li>
                ))}
              </motion.ul>
            </ScrollReveal>

            <ScrollReveal duration={reveal} y={32} className="mt-24 py-16 md:py-24">
              <div className="text-center">
                <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-vio-gold/80">
                  Trải nghiệm
                </p>
                <h2 className="mt-8 font-heading text-3xl font-medium leading-[1.15] tracking-wide text-vio-navy md:text-5xl md:leading-[1.12]">
                  {room.experienceTitle}
                </h2>
                <p className="mt-10 text-base leading-[2] tracking-[0.03em] text-vio-navy/58 md:text-lg">
                  {room.experienceBody}
                </p>
              </div>
            </ScrollReveal>

            {related.length > 0 ? (
              <ScrollReveal duration={reveal} y={28} className="mt-24 border-t border-vio-navy/[0.06] pt-16 md:pt-24">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/40">
                  Có thể bạn thích
                </p>
                <h2 className="mt-4 font-heading text-3xl font-medium text-vio-navy md:text-4xl">
                  Phòng tương tự
                </h2>
                <div className="mt-24 grid gap-8 md:grid-cols-3">
                  {related.map((r, idx) => (
                    <ScrollReveal
                      key={r.id}
                      delay={idx * 0.06}
                      duration={reveal}
                      y={22}
                    >
                      <article className="group overflow-hidden rounded-2xl bg-vio-white shadow-soft-lg ring-1 ring-vio-navy/[0.06] transition-all duration-500 hover:-translate-y-1 hover:shadow-soft-2xl">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={r.image}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-6 md:p-8">
                          <h3 className="font-heading text-xl tracking-wide text-vio-navy md:text-2xl">
                            {r.name}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-vio-navy/50">
                            {r.description}
                          </p>
                          <p className="mt-4 text-sm font-medium text-vio-navy/65">
                            {formatVnd(r.pricePerNight)} / đêm
                          </p>
                          <Button
                            type="button"
                            variant="secondary"
                            className="mt-6 w-full transition-all duration-300 hover:brightness-[1.03]"
                            onClick={() => navigate(`/rooms/${r.id}`)}
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </article>
                    </ScrollReveal>
                  ))}
                </div>
              </ScrollReveal>
            ) : null}
          </div>

          <aside className="sticky top-24 z-10 mt-0 hidden self-start lg:col-span-1 lg:block">
            <BookingPanel
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              minCheckIn={todayIso}
              minCheckOut={checkIn || todayIso}
              onChangeCi={updateCheckIn}
              onChangeCo={updateCheckOut}
              onChangeGuests={updateGuests}
              nights={nights}
              subtotal={subtotal}
              taxEstimate={taxEstimate}
              total={total}
              canBook={canBook}
              onBook={goBook}
            />
          </aside>
        </div>
      </div>

      {/* Đã bỏ panel đặt phòng fixed ở mobile để tránh ghim dưới đáy, panel đặt phòng chỉ xuất hiện phía trên */}
    </div>
  )
}
