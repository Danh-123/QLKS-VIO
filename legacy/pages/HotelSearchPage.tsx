import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScrollReveal } from '../components/guest/ScrollReveal'
import { Button } from '../components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
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
    <div className="py-16 md:py-24">
      <motion.section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${rooms[0]?.image || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center text-white">
          <ScrollReveal>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/70">
              Tìm kiếm
            </p>
            <h1 className="mt-4 font-heading text-4xl font-medium leading-[1.12] tracking-wide md:text-6xl">
              Đặt kỳ nghỉ của bạn
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.9] tracking-[0.02em] text-white/85 md:text-lg">
              Nhập điểm đến, ngày và số khách — chúng tôi sẽ chỉ ra lựa chọn phù hợp.
            </p>
          </ScrollReveal>
        </div>
      </motion.section>

      <motion.section
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
      >
        <ScrollReveal delay={0.08}>
          <Card className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 border border-white/40">
            <CardHeader className="p-0 pb-6 md:pb-8">
              <CardTitle>Thông tin lưu trú</CardTitle>
              <CardDescription>
                Thiết lập hành trình của bạn và khám phá lựa chọn tốt nhất.
              </CardDescription>
            </CardHeader>

            <form
              className="flex flex-col gap-6"
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
                <motion.p
                  className="rounded-xl bg-vio-cream/70 px-4 py-3 text-sm text-vio-navy/70 ring-1 ring-vio-gold/35"
                  role="alert"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.p>
              ) : null}

              <motion.div
                className="flex flex-col md:flex-row gap-4"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08 } },
                }}
              >
                <motion.div
                  className="flex-1 min-w-0"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <label htmlFor="search-hotel" className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45">
                    Khách sạn
                  </label>
                  <motion.select
                    id="search-hotel"
                    value={searchFilters.hotelId}
                    onChange={(e) => {
                      const hotelId = e.target.value
                      const hotel = hotels.find((h) => h.id === hotelId)
                      updateSearchFilters({
                        hotelId,
                        locationQuery: hotel ? `${hotel.name} · ${hotel.location}` : searchFilters.locationQuery,
                      })
                    }}
                    className="w-full rounded-xl border border-vio-navy/15 bg-white px-4 py-3 text-base text-vio-navy shadow-soft-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    whileFocus={{ scale: 1.02 }}
                  >
                    {hotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} · {hotel.location}
                      </option>
                    ))}
                  </motion.select>
                </motion.div>

                <motion.div
                  className="flex-1 min-w-0"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <label htmlFor="search-location" className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45">
                    Địa điểm
                  </label>
                  <motion.input
                    id="search-location"
                    name="location"
                    value={searchFilters.locationQuery}
                    onChange={(e) => updateSearchFilters({ locationQuery: e.target.value })}
                    autoComplete="off"
                    className="w-full rounded-xl border border-vio-navy/15 bg-white px-4 py-3 text-base text-vio-navy shadow-soft-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="flex flex-col md:flex-row gap-4"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08 } },
                }}
              >
                <motion.div
                  className="flex-1 min-w-0"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <label htmlFor="search-checkin" className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45">
                    Ngày đến
                  </label>
                  <motion.input
                    id="search-checkin"
                    type="date"
                    name="checkIn"
                    min={todayIso}
                    value={searchFilters.checkIn}
                    onChange={(e) => {
                      const nextCheckIn = e.target.value
                      const nextCheckOut =
                        searchFilters.checkOut && searchFilters.checkOut <= nextCheckIn ? '' : searchFilters.checkOut
                      updateSearchFilters({
                        checkIn: nextCheckIn,
                        checkOut: nextCheckOut,
                      })
                      setError(null)
                    }}
                    className="w-full rounded-xl border border-vio-navy/15 bg-white px-4 py-3 text-base text-vio-navy shadow-soft-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div
                  className="flex-1 min-w-0"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <label htmlFor="search-checkout" className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45">
                    Ngày đi
                  </label>
                  <motion.input
                    id="search-checkout"
                    type="date"
                    name="checkOut"
                    min={searchFilters.checkIn || todayIso}
                    value={searchFilters.checkOut}
                    onChange={(e) => {
                      updateSearchFilters({ checkOut: e.target.value })
                      setError(null)
                    }}
                    className="w-full rounded-xl border border-vio-navy/15 bg-white px-4 py-3 text-base text-vio-navy shadow-soft-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div
                  className="w-full md:max-w-[220px]"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <label htmlFor="search-guests" className="mb-2 block text-xs uppercase tracking-[0.2em] text-vio-navy/45">
                    Số khách
                  </label>
                  <motion.input
                    id="search-guests"
                    type="number"
                    name="guests"
                    min={1}
                    max={12}
                    inputMode="numeric"
                    value={searchFilters.guests}
                    onChange={(e) => updateSearchFilters({ guests: e.target.value })}
                    className="w-full rounded-xl border border-vio-navy/15 bg-white px-4 py-3 text-base text-vio-navy shadow-soft-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="flex flex-col md:flex-row gap-3 pt-2"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.1 } },
                }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                  className="w-full md:w-auto"
                >
                  <motion.button
                    type="submit"
                    onClick={(e) => {
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
                    className="w-full md:w-auto bg-blue-900 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    Tìm phòng phù hợp
                  </motion.button>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                  className="w-full md:w-auto"
                >
                  <motion.button
                    type="button"
                    onClick={() => navigate('/rooms')}
                    className="w-full md:w-auto px-6 py-3 rounded-xl font-medium border border-vio-navy/20 text-vio-navy bg-transparent transition-all duration-300 hover:bg-vio-sand/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    Duyệt tất cả phòng
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.div
                className="grid gap-3 pt-4 text-sm text-vio-navy/75 md:grid-cols-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.1 } },
                }}
              >
                <motion.div
                  className="rounded-xl bg-white/70 px-4 py-3"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  4.8/5 từ 120+ khách
                </motion.div>
                <motion.div
                  className="rounded-xl bg-white/70 px-4 py-3"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  Còn ít phòng trong tuần này
                </motion.div>
                <motion.div
                  className="rounded-xl bg-white/70 px-4 py-3"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  Giá từ 2.400.000đ / đêm
                </motion.div>
              </motion.div>
            </form>
          </Card>
        </ScrollReveal>
      </motion.section>
    </div>
  )
}
