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
  nightsBetween,
  type RoomAmenity,
} from '../data/roomDetails'
import { cn } from '../lib/cn'

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
  onChangeCi,
  onChangeCo,
  onChangeGuests,
  nights,
  subtotal,
  taxEstimate,
  total,
  onBook,
  className,
}: {
  checkIn: string
  checkOut: string
  guests: string
  onChangeCi: (v: string) => void
  onChangeCo: (v: string) => void
  onChangeGuests: (v: string) => void
  nights: number
  subtotal: number
  taxEstimate: number
  total: number
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
            value={checkIn}
            onChange={(e) => onChangeCi(e.target.value)}
          />
          <Input
            id="rd-co"
            label="Trả phòng"
            type="date"
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
          className="w-full py-3.5 transition-all duration-300 hover:brightness-[1.04]"
          onClick={onBook}
        >
          Đặt phòng
        </Button>
      </div>
    </Card>
  )
}

export function RoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const room = id ? getRoomDetail(id) : undefined
  const [checkIn, setCheckIn] = useState(
    () => searchParams.get('checkIn') ?? '',
  )
  const [checkOut, setCheckOut] = useState(
    () => searchParams.get('checkOut') ?? '',
  )
  const [guests, setGuests] = useState(
    () => searchParams.get('guests') ?? '2',
  )

  const related = useMemo(
    () => (room ? getRelatedRooms(room.id) : []),
    [room],
  )

  if (!room) {
    return <Navigate to="/rooms" replace />
  }

  const nightsParam = searchParams.get('nights')
  const nights =
    nightsParam != null && nightsParam !== ''
      ? Math.max(1, parseInt(nightsParam, 10) || 1)
      : checkIn && checkOut
        ? nightsBetween(checkIn, checkOut)
        : 1

  const subtotal = room.pricePerNight * nights
  const taxEstimate = Math.round(subtotal * 0.08)
  const total = subtotal + taxEstimate

  const goBook = () => {
    const q = new URLSearchParams()
    q.set('room', room.id)
    if (checkIn) q.set('checkIn', checkIn)
    if (checkOut) q.set('checkOut', checkOut)
    q.set('guests', guests)
    navigate(`/book?${q.toString()}`)
  }

  return (
    <div className="bg-vio-cream pb-36 md:pb-0">
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

      <div className="mx-auto max-w-6xl px-6 pt-20 md:px-10 md:pt-24">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-16 xl:gap-20">
          <div className="min-w-0">
            <ScrollReveal duration={reveal} y={24} className="mb-16 lg:hidden">
              <div id="booking">
                <BookingPanel
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  onChangeCi={setCheckIn}
                  onChangeCo={setCheckOut}
                  onChangeGuests={setGuests}
                  nights={nights}
                  subtotal={subtotal}
                  taxEstimate={taxEstimate}
                  total={total}
                  onBook={goBook}
                />
              </div>
            </ScrollReveal>

            <ScrollReveal duration={reveal} y={32}>
              <div className="grid gap-16 md:grid-cols-2 md:gap-20">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/40">
                    Câu chuyện phòng
                  </p>
                  <p className="mt-6 text-lg leading-[1.85] tracking-[0.03em] text-vio-navy/70 md:text-xl">
                    {room.description}
                  </p>
                  <div className="mt-10 space-y-8">
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

            <ScrollReveal duration={reveal} y={28} className="mt-28">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/40">
                Tiện nghi
              </p>
              <h2 className="mt-4 font-heading text-3xl font-medium tracking-[0.02em] text-vio-navy md:text-4xl">
                Mọi thứ cần cho kỳ nghỉ
              </h2>
              <motion.ul
                className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
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

            <ScrollReveal duration={reveal} y={32} className="mt-28 py-24 md:mt-32 md:py-32">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-vio-gold/80">
                  Trải nghiệm
                </p>
                <h2 className="mt-8 font-heading text-3xl font-medium leading-[1.15] tracking-[0.02em] text-vio-navy md:text-5xl md:leading-[1.12]">
                  {room.experienceTitle}
                </h2>
                <p className="mt-10 text-base leading-[2] tracking-[0.03em] text-vio-navy/58 md:text-lg">
                  {room.experienceBody}
                </p>
              </div>
            </ScrollReveal>

            {related.length > 0 ? (
              <ScrollReveal duration={reveal} y={28} className="mt-8 border-t border-vio-navy/[0.06] pt-24 md:pt-28">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/40">
                  Có thể bạn thích
                </p>
                <h2 className="mt-4 font-heading text-3xl font-medium text-vio-navy md:text-4xl">
                  Phòng tương tự
                </h2>
                <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
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
                          <h3 className="font-heading text-xl tracking-[0.02em] text-vio-navy md:text-2xl">
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

          <aside className="sticky top-24 z-10 mt-0 hidden self-start lg:block">
            <BookingPanel
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onChangeCi={setCheckIn}
              onChangeCo={setCheckOut}
              onChangeGuests={setGuests}
              nights={nights}
              subtotal={subtotal}
              taxEstimate={taxEstimate}
              total={total}
              onBook={goBook}
            />
          </aside>
        </div>
      </div>

      <div
        className="fixed inset-x-0 z-[45] border-t border-vio-navy/[0.06] bg-vio-cream/95 px-4 py-3 shadow-[0_-8px_40px_-16px_rgba(30,58,95,0.12)] backdrop-blur-md lg:hidden"
        style={{
          bottom: 'calc(4.25rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-vio-navy/45">
              Tổng ước tính
            </p>
            <p className="font-heading text-lg text-vio-navy">
              {formatVnd(total)}
            </p>
          </div>
          <Button
            type="button"
            className="shrink-0 px-6 transition-all duration-300 hover:brightness-[1.04]"
            onClick={goBook}
          >
            Đặt phòng ngay
          </Button>
        </div>
      </div>
    </div>
  )
}
