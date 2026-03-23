import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { BookingWizardState } from '../booking/types'
import { BookingSummaryPanel } from '../components/booking/BookingSummaryPanel'
import { DateRangeCalendar } from '../components/booking/DateRangeCalendar'
import { WizardProgressBar } from '../components/booking/WizardProgressBar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import {
  formatVnd,
  getRoomDetail,
} from '../data/roomDetails'
import { cn } from '../lib/cn'
import { useAppData } from '../state/AppDataContext'

const field =
  'mt-2 w-full rounded-xl border-0 bg-vio-white px-4 py-3 text-base text-vio-navy shadow-soft-sm ring-1 ring-vio-navy/10 transition-all duration-300 focus:ring-2 focus:ring-vio-navy/20 focus:outline-none'

const easeLux = [0.25, 0.1, 0.25, 1] as const

const stepMotion = {
  initial: { opacity: 0, x: 14 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.48, ease: easeLux },
}

function emptyState(): BookingWizardState {
  return {
    checkIn: '',
    checkOut: '',
    guests: '2',
    adults: '2',
    children: '0',
    roomId: '',
    floorPref: 'any',
    smoking: false,
    allergy: '',
    occasion: '',
    fullName: '',
    email: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  }
}

function initialFormFromParams(
  searchParams: URLSearchParams,
  draft: Pick<
    BookingWizardState,
    'roomId' | 'checkIn' | 'checkOut' | 'guests' | 'adults' | 'children'
  >,
): BookingWizardState {
  const g = Math.max(
    1,
    parseInt(searchParams.get('guests') ?? draft.guests ?? '2', 10) || 2,
  )
  return {
    ...emptyState(),
    roomId: searchParams.get('room') ?? draft.roomId,
    checkIn: searchParams.get('checkIn') ?? draft.checkIn,
    checkOut: searchParams.get('checkOut') ?? draft.checkOut,
    guests: String(g),
    adults: draft.adults || String(g),
    children: draft.children || '0',
  }
}

type FieldErr = Partial<Record<string, string>>

function emailOk(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

export function BookingWizardPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const {
    rooms,
    bookingDraft,
    setBookingDraft,
    createBooking,
    todayIso,
    isValidDateRange,
    isRoomAvailable,
    getUnavailableRoomIds,
    calculatePricing,
  } = useAppData()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<BookingWizardState>(() =>
    initialFormFromParams(searchParams, bookingDraft),
  )
  const [bookingRef, setBookingRef] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErr>({})
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

  const selectedRoom = useMemo(
    () => (form.roomId ? getRoomDetail(form.roomId) : undefined),
    [form.roomId],
  )

  const adultsN = Math.max(1, parseInt(form.adults, 10) || 1)
  const childrenN = Math.max(0, parseInt(form.children, 10) || 0)
  const guestTotal = adultsN + childrenN

  const pricing = useMemo(
    () =>
      selectedRoom
        ? calculatePricing(selectedRoom.id, form.checkIn, form.checkOut)
        : { nights: 1, subtotal: 0, serviceFee: 0, total: 0 },
    [selectedRoom, calculatePricing, form.checkIn, form.checkOut],
  )

  const nights = pricing.nights
  const subtotal = pricing.subtotal
  const tax = pricing.serviceFee
  const total = pricing.total

  const dateRangeValid = isValidDateRange(form.checkIn, form.checkOut)
  const unavailableRoomIds = useMemo(
    () => getUnavailableRoomIds(form.checkIn, form.checkOut),
    [getUnavailableRoomIds, form.checkIn, form.checkOut],
  )
  const selectedRoomAvailable = selectedRoom
    ? isRoomAvailable(selectedRoom.id, form.checkIn, form.checkOut)
    : false

  const update = useCallback(
    <K extends keyof BookingWizardState>(key: K, value: BookingWizardState[K]) => {
      setForm((f) => ({ ...f, [key]: value }))
      setError(null)
      setFieldErrors({})
    },
    [],
  )

  const validateStep = (s: number): boolean => {
    if (s === 1) {
      if (!form.checkIn || !form.checkOut) {
        setError('Chọn ngày đến và ngày đi để tiếp tục.')
        return false
      }
      if (!dateRangeValid) {
        setError('Ngày trả phòng phải sau ngày nhận và không ở quá khứ.')
        return false
      }
      if (guestTotal < 1 || guestTotal > 12) {
        setError('Vui lòng chọn từ 1 đến 12 khách.')
        return false
      }
    }
    if (s === 2) {
      if (!form.roomId) {
        setError('Chọn một phòng để tiếp tục.')
        return false
      }
      if (!selectedRoomAvailable) {
        setError('Phòng đã hết trong khoảng thời gian đã chọn. Vui lòng chọn phòng khác.')
        return false
      }
    }
    if (s === 4) {
      const err: FieldErr = {}
      if (!form.fullName.trim()) err.fullName = 'Nhập họ và tên.'
      if (!form.email.trim()) err.email = 'Nhập email.'
      else if (!emailOk(form.email)) err.email = 'Email chưa đúng định dạng.'
      if (!form.phone.trim()) err.phone = 'Nhập số điện thoại.'
      else if (form.phone.replace(/\D/g, '').length < 9)
        err.phone = 'Số điện thoại chưa hợp lệ.'
      if (!form.cardName.trim()) err.cardName = 'Nhập tên trên thẻ.'
      if (form.cardNumber.replace(/\s/g, '').length < 12)
        err.cardNumber = 'Số thẻ chưa đủ (demo).'
      if (!form.cardExpiry.trim()) err.cardExpiry = 'Nhập hạn thẻ.'
      if (form.cardCvc.trim().length < 3) err.cardCvc = 'Nhập mã CVC.'
      setFieldErrors(err)
      if (Object.keys(err).length) {
        setError('Vui lòng kiểm tra các trường được đánh dấu.')
        return false
      }
    }
    setError(null)
    setFieldErrors({})
    return true
  }

  const next = () => {
    if (!validateStep(step)) return
    if (step < 4) setStep((x) => x + 1)
    else if (step === 4) setStep(5)
  }

  const back = () => {
    setError(null)
    setFieldErrors({})
    if (step > 1) setStep((x) => x - 1)
  }

  const confirm = () => {
    if (!validateStep(4) || !selectedRoom) return
    const prefs = [
      form.floorPref !== 'any' ? `Tầng: ${form.floorPref}` : '',
      form.smoking ? 'Hút thuốc' : 'Không hút thuốc',
      form.allergy ? `Dị ứng: ${form.allergy}` : '',
      form.occasion ? `Dịp: ${form.occasion}` : '',
    ]
      .filter(Boolean)
      .join(' · ')
    try {
      const booking = createBooking({
        roomId: form.roomId,
        roomName: selectedRoom.name,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: guestTotal,
        totalVnd: total,
        preferencesNote: prefs || undefined,
        status: 'confirmed',
        customer: {
          name: form.fullName,
          email: form.email,
        },
      })
      setBookingRef(booking.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể xác nhận đặt phòng.')
    }
  }

  const firstName = form.fullName.trim().split(/\s+/)[0] || 'Quý'

  const canProceed = useMemo(() => {
    if (step === 1) {
      return (
        Boolean(form.checkIn && form.checkOut) &&
        dateRangeValid &&
        guestTotal >= 1 &&
        guestTotal <= 12
      )
    }
    if (step === 2) return Boolean(form.roomId && selectedRoomAvailable)
    if (step === 3) return true
    if (step === 4) {
      return (
        form.fullName.trim().length > 1 &&
        emailOk(form.email) &&
        form.phone.replace(/\D/g, '').length >= 9 &&
        form.cardName.trim() &&
        form.cardNumber.replace(/\s/g, '').length >= 12 &&
        form.cardExpiry.trim() &&
        form.cardCvc.trim().length >= 3
      )
    }
    return true
  }, [step, form, guestTotal, dateRangeValid, selectedRoomAvailable])

  const showSticky =
    step < 5 || (step === 5 && !bookingRef)

  const stickyLabel =
    step === 4
      ? 'Tiếp tục'
      : step === 5 && !bookingRef
        ? 'Xác nhận đặt phòng'
        : 'Tiếp tục'

  const summaryProps = {
    roomName: selectedRoom?.name ?? '',
    checkIn: form.checkIn,
    checkOut: form.checkOut,
    nights,
    adults: adultsN,
    children: childrenN,
    subtotal,
    tax,
    total,
  }

  useEffect(() => {
    setBookingDraft({
      roomId: form.roomId,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests: String(guestTotal),
      adults: form.adults,
      children: form.children,
    })
  }, [
    form.roomId,
    form.checkIn,
    form.checkOut,
    form.adults,
    form.children,
    guestTotal,
    setBookingDraft,
  ])

  useEffect(() => {
    if (form.roomId && unavailableRoomIds.has(form.roomId)) {
      setForm((prev) => ({ ...prev, roomId: '' }))
    }
  }, [form.roomId, unavailableRoomIds])

  return (
    <div className="vio-container vio-section pb-40 md:pb-20">
      <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-12">
        <div className="min-w-0 lg:col-span-2">
          {step < 5 || (step === 5 && !bookingRef) ? (
            <WizardProgressBar current={bookingRef ? 5 : step} className="mb-10" />
          ) : (
            <p className="mb-10 text-[11px] font-medium uppercase tracking-[0.32em] text-vio-gold/80">
              Hoàn tất
            </p>
          )}

          <div className="mb-6 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSummaryOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-xl bg-vio-white px-4 py-3.5 text-left ring-1 ring-vio-navy/[0.06] shadow-soft-sm"
            >
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-vio-navy/45">
                Tóm tắt đặt chỗ
              </span>
              <span className="font-heading text-lg text-vio-navy">
                {formatVnd(total)}
              </span>
            </button>
            <AnimatePresence>
              {mobileSummaryOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3">
                    <BookingSummaryPanel {...summaryProps} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${step}-${bookingRef ?? 'x'}`}
              {...stepMotion}
            >
              {error ? (
                <p
                  className="mb-6 rounded-xl bg-vio-white px-4 py-3 text-sm text-vio-navy/75 ring-1 ring-vio-gold/35"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              {step === 1 && (
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: easeLux }}
                  >
                    <h2 className="font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
                      Ngày & khách
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed tracking-[0.02em] text-vio-navy/50">
                      Chọn khoảng thời gian lưu trú — lịch cập nhật mềm, không giật.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.58, delay: 0.06, ease: easeLux }}
                    className="mt-10"
                  >
                    <DateRangeCalendar
                      checkIn={form.checkIn}
                      checkOut={form.checkOut}
                      minDate={todayIso}
                      onChange={(ci, co) => {
                        update('checkIn', ci)
                        update('checkOut', co)
                      }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.58, delay: 0.1, ease: easeLux }}
                    className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-vio-white px-6 py-5 ring-1 ring-vio-navy/[0.06]"
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-vio-navy/45">
                        Số đêm
                      </p>
                      <p className="mt-1 font-heading text-2xl text-vio-navy">
                        {form.checkIn && form.checkOut ? nights : '—'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-8">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-vio-navy/45">
                          Người lớn
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-vio-cream/80 text-lg text-vio-navy transition-colors hover:bg-vio-cream"
                            onClick={() =>
                              update('adults', String(Math.max(1, adultsN - 1)))
                            }
                          >
                            −
                          </button>
                          <span className="min-w-[2ch] text-center font-medium">
                            {adultsN}
                          </span>
                          <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-vio-cream/80 text-lg text-vio-navy transition-colors hover:bg-vio-cream"
                            onClick={() =>
                              update(
                                'adults',
                                String(Math.min(12 - childrenN, adultsN + 1)),
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-vio-navy/45">
                          Trẻ em
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-vio-cream/80 text-lg text-vio-navy transition-colors hover:bg-vio-cream"
                            onClick={() =>
                              update(
                                'children',
                                String(Math.max(0, childrenN - 1)),
                              )
                            }
                          >
                            −
                          </button>
                          <span className="min-w-[2ch] text-center font-medium">
                            {childrenN}
                          </span>
                          <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-vio-cream/80 text-lg text-vio-navy transition-colors hover:bg-vio-cream"
                            onClick={() =>
                              update(
                                'children',
                                String(
                                  Math.min(12 - adultsN, childrenN + 1),
                                ),
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
                    Chọn phòng
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-vio-navy/50">
                    Mỗi phòng là một cách cảm nhận VIO — chọn phù hợp nhịp của bạn.
                  </p>
                  <div className="mt-10 grid gap-8 sm:grid-cols-2">
                    {rooms.map((r) => {
                      const d = getRoomDetail(r.id)
                      const active = form.roomId === r.id
                      const unavailable = unavailableRoomIds.has(r.id)
                      return (
                        <motion.article
                          key={r.id}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.55 }}
                        >
                          <button
                            type="button"
                            disabled={unavailable}
                            onClick={() => {
                              if (unavailable) return
                              update('roomId', r.id)
                            }}
                            className={cn(
                              'group w-full overflow-hidden rounded-xl text-left ring-1 transition-all duration-300',
                              active
                                ? 'ring-2 ring-vio-navy ring-offset-2 ring-offset-vio-cream shadow-soft'
                                : 'ring-vio-navy/[0.08] hover:ring-vio-navy/18',
                              unavailable && 'cursor-not-allowed opacity-50',
                            )}
                          >
                            <div className="aspect-[5/3] overflow-hidden">
                              <img
                                src={r.image}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              />
                            </div>
                            <div className="bg-vio-white p-6">
                              <p className="font-heading text-xl text-vio-navy">
                                {r.name}
                              </p>
                              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-vio-navy/50">
                                {r.description}
                              </p>
                              <p className="mt-4 text-sm font-medium text-vio-navy/70">
                                {d
                                  ? `${formatVnd(d.pricePerNight)} / đêm`
                                  : r.priceFrom}
                              </p>
                              <span
                                className={cn(
                                  'mt-5 inline-flex rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300',
                                  unavailable
                                    ? 'bg-vio-cream/60 text-vio-navy/55'
                                    : active
                                    ? 'bg-vio-navy text-vio-white'
                                    : 'bg-vio-cream/80 text-vio-navy hover:bg-vio-cream',
                                )}
                              >
                                {unavailable ? 'Hết phòng' : 'Chọn phòng'}
                              </span>
                            </div>
                          </button>
                        </motion.article>
                      )
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <Card className="border-0 bg-vio-white/95 shadow-soft-sm">
                    <h2 className="font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
                    Sở thích lưu trú
                  </h2>
                  <p className="mt-3 text-sm text-vio-navy/50">
                    Ghi nhận nhẹ — chúng tôi sẽ cố gắng đáp ứng theo tình trạng thực tế.
                  </p>
                  <div className="mt-10 space-y-6">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-vio-navy/45">
                        Tầng
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {(
                          [
                            ['high', 'Tầng cao'],
                            ['low', 'Tầng thấp'],
                            ['any', 'Không yêu cầu'],
                          ] as const
                        ).map(([v, label]) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => update('floorPref', v)}
                            className={cn(
                              'rounded-xl px-5 py-2.5 text-sm transition-all duration-300',
                              form.floorPref === v
                                ? 'bg-vio-navy text-vio-white shadow-soft-sm'
                                : 'bg-vio-cream/50 text-vio-navy/75 ring-1 ring-vio-navy/10 hover:ring-vio-navy/20',
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-vio-navy/45">
                        Thuốc lá
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => update('smoking', false)}
                          className={cn(
                            'rounded-xl px-5 py-2.5 text-sm transition-all duration-300',
                            !form.smoking
                              ? 'bg-vio-navy text-vio-white'
                              : 'bg-vio-white ring-1 ring-vio-navy/10 text-vio-navy/70',
                          )}
                        >
                          Không hút thuốc
                        </button>
                        <button
                          type="button"
                          onClick={() => update('smoking', true)}
                          className={cn(
                            'rounded-xl px-5 py-2.5 text-sm transition-all duration-300',
                            form.smoking
                              ? 'bg-vio-navy text-vio-white'
                              : 'bg-vio-white ring-1 ring-vio-navy/10 text-vio-navy/70',
                          )}
                        >
                          Hút thuốc
                        </button>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="wiz-allergy"
                        className="text-[10px] font-medium uppercase tracking-[0.24em] text-vio-navy/45"
                      >
                        Dị ứng / lưu ý ẩm thực
                      </label>
                      <textarea
                        id="wiz-allergy"
                        rows={3}
                        value={form.allergy}
                        onChange={(e) => update('allergy', e.target.value)}
                        className={field}
                        placeholder=" "
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="wiz-occasion"
                        className="text-[10px] font-medium uppercase tracking-[0.24em] text-vio-navy/45"
                      >
                        Dịp đặc biệt
                      </label>
                      <textarea
                        id="wiz-occasion"
                        rows={2}
                        value={form.occasion}
                        onChange={(e) => update('occasion', e.target.value)}
                        className={field}
                      />
                    </div>
                  </div>
                </Card>
              )}

              {step === 4 && selectedRoom && (
                <Card className="border-0 bg-vio-white/95 shadow-soft-sm">
                  <h2 className="font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
                    Thông tin của bạn
                  </h2>
                  <p className="mt-3 text-sm text-vio-navy/50">
                    Thanh toán demo — không lưu thẻ thật.
                  </p>
                  <div className="mt-10 flex flex-col gap-6">
                    <Input
                      id="wiz-fullname"
                      label="Họ và tên"
                      value={form.fullName}
                      error={fieldErrors.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                      autoComplete="name"
                    />
                    <Input
                      id="wiz-email"
                      label="Email"
                      type="email"
                      value={form.email}
                      error={fieldErrors.email}
                      onChange={(e) => update('email', e.target.value)}
                      autoComplete="email"
                    />
                    <Input
                      id="wiz-phone"
                      label="Điện thoại"
                      type="tel"
                      value={form.phone}
                      error={fieldErrors.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      autoComplete="tel"
                    />
                    <div className="border-t border-vio-navy/[0.06] pt-8">
                      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-vio-navy/45">
                        Thẻ (giao diện)
                      </p>
                      <div className="mt-6 flex flex-col gap-6">
                        <Input
                          id="wiz-cardname"
                          label="Tên trên thẻ"
                          value={form.cardName}
                          error={fieldErrors.cardName}
                          onChange={(e) => update('cardName', e.target.value)}
                          autoComplete="cc-name"
                        />
                        <Input
                          id="wiz-cardnum"
                          label="Số thẻ"
                          inputMode="numeric"
                          value={form.cardNumber}
                          error={fieldErrors.cardNumber}
                          onChange={(e) => update('cardNumber', e.target.value)}
                          autoComplete="cc-number"
                        />
                        <div className="grid gap-6 sm:grid-cols-2">
                          <Input
                            id="wiz-exp"
                            label="Hết hạn (MM/YY)"
                            value={form.cardExpiry}
                            error={fieldErrors.cardExpiry}
                            onChange={(e) => update('cardExpiry', e.target.value)}
                            autoComplete="cc-exp"
                          />
                          <Input
                            id="wiz-cvc"
                            label="CVC"
                            inputMode="numeric"
                            value={form.cardCvc}
                            error={fieldErrors.cardCvc}
                            onChange={(e) => update('cardCvc', e.target.value)}
                            autoComplete="cc-csc"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {step === 5 && !bookingRef && selectedRoom && (
                <Card className="border-0 bg-vio-white/95 shadow-soft-sm">
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-gold/80">
                    Xác nhận
                  </p>
                  <h2 className="mt-4 font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
                    Kiểm tra trước khi xác nhận
                  </h2>
                  <div className="mt-10 space-y-4 text-sm leading-relaxed text-vio-navy/65">
                    <p>
                      <span className="text-vio-navy/45">Phòng · </span>
                      <span className="font-medium text-vio-navy">
                        {selectedRoom.name}
                      </span>
                    </p>
                    <p>
                      <span className="text-vio-navy/45">Thời gian · </span>
                      {form.checkIn} → {form.checkOut} ({nights} đêm)
                    </p>
                    <p>
                      <span className="text-vio-navy/45">Khách · </span>
                      {guestTotal} ({adultsN} người lớn
                      {childrenN ? `, ${childrenN} trẻ em` : ''})
                    </p>
                    <p>
                      <span className="text-vio-navy/45">Tổng · </span>
                      <span className="font-heading text-xl text-vio-navy">
                        {formatVnd(total)}
                      </span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="mt-10 w-full text-base sm:w-auto sm:px-12"
                    onClick={confirm}
                  >
                    Xác nhận đặt phòng
                  </Button>
                </Card>
              )}

              {step === 5 && bookingRef && selectedRoom && (
                <Card className="border-0 bg-vio-white/95 text-center shadow-soft-sm">
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-gold/90">
                    Đặt phòng thành công
                  </p>
                  <h2 className="mt-6 font-heading text-3xl font-medium tracking-wide text-vio-navy md:text-4xl">
                    Cảm ơn bạn, {firstName}
                  </h2>
                  <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-vio-navy/55">
                    Mã <span className="font-medium text-vio-navy">{bookingRef}</span>{' '}
                    · {selectedRoom.name} · {nights} đêm · {formatVnd(total)}
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm text-vio-navy/45">
                    Xác nhận gửi tới {form.email} (demo).
                  </p>
                  <div className="mt-10 flex flex-wrap justify-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate('/bookings')}
                    >
                      Lịch sử đặt phòng
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate('/')}
                    >
                      Trang chủ
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {step > 1 && step < 5 && !bookingRef ? (
            <div className="mt-10 hidden flex-wrap gap-3 md:flex">
              <Button type="button" variant="ghost" onClick={back}>
                Quay lại
              </Button>
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={next}
                  disabled={!canProceed}
                  className="disabled:opacity-40"
                >
                  Tiếp tục
                </Button>
              ) : step === 4 ? (
                <Button
                  type="button"
                  onClick={next}
                  disabled={!canProceed}
                  className="disabled:opacity-40"
                >
                  Tiếp tục
                </Button>
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="mt-10 hidden md:flex">
              <Button
                type="button"
                onClick={next}
                disabled={!canProceed}
                className="disabled:opacity-40"
              >
                Tiếp tục
              </Button>
            </div>
          ) : null}

          {step === 5 && !bookingRef ? (
            <div className="mt-10 hidden md:flex">
              <Button type="button" variant="ghost" onClick={() => setStep(4)}>
                Quay lại chỉnh sửa
              </Button>
            </div>
          ) : null}
        </div>

        <aside className="sticky top-24 z-10 hidden h-fit lg:col-span-1 lg:block">
          <BookingSummaryPanel {...summaryProps} />
        </aside>
      </div>

      {showSticky && (
        <div
          className="fixed inset-x-0 z-[45] border-t border-vio-navy/[0.06] bg-vio-cream/95 px-4 py-3 backdrop-blur-md"
          style={{
            bottom: 'calc(4.25rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="mx-auto flex items-center gap-3 md:justify-end lg:hidden">
            {step > 1 && !(step === 5 && bookingRef) ? (
              <Button
                type="button"
                variant="secondary"
                className="shrink-0 px-4"
                onClick={back}
              >
                ←
              </Button>
            ) : null}
            <div className="min-w-0 flex-1 md:text-right">
              <p className="text-[9px] uppercase tracking-[0.2em] text-vio-navy/45">
                Tổng ước tính
              </p>
              <p className="truncate font-heading text-lg text-vio-navy">
                {formatVnd(total)}
              </p>
            </div>
            <Button
              type="button"
              className="shrink-0 px-5 disabled:opacity-40"
              disabled={
                step === 5 && !bookingRef
                  ? false
                  : step < 5
                    ? !canProceed
                    : true
              }
              onClick={() => {
                if (step === 5 && !bookingRef) confirm()
                else if (step < 5) next()
              }}
            >
              {stickyLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
