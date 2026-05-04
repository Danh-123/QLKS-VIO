import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Skeleton } from '../components/ui/Skeleton'
import { getRoomDetail } from '../data/roomDetails'
import { useFakeApiData } from '../lib/useFakeApiData'
import { RoomCard } from '../components/guest/RoomCard'
import { useAppData } from '../state/AppDataContext'

export function RoomListPage() {
  const navigate = useNavigate()
  const { rooms, searchFilters, setBookingDraft, getUnavailableRoomIds } = useAppData()
  const [sort, setSort] = useState<'low' | 'high' | 'popular'>('popular')
  const [filterOpen, setFilterOpen] = useState(false)

  const guestCount = Math.max(1, parseInt(searchFilters.guests, 10) || 2)
  const visibleRooms = useMemo(
    () =>
      rooms.filter((room) => {
        const detail = getRoomDetail(room.id)
        return detail ? detail.keyFacts.maxGuests >= guestCount : true
      }),
    [rooms, guestCount],
  )

  const unavailableRoomIds = useMemo(
    () => getUnavailableRoomIds(searchFilters.checkIn, searchFilters.checkOut),
    [getUnavailableRoomIds, searchFilters.checkIn, searchFilters.checkOut],
  )

  const { loading, data: displayedRooms } = useFakeApiData(visibleRooms, 850)

  const sortedRooms = useMemo(() => {
    if (!displayedRooms) return []
    const copy = [...displayedRooms]
    if (sort === 'low') return copy.sort((a, b) => (a.priceFromRaw || 0) - (b.priceFromRaw || 0))
    if (sort === 'high') return copy.sort((a, b) => (b.priceFromRaw || 0) - (a.priceFromRaw || 0))
    return copy
  }, [displayedRooms, sort])

  return (
    <div className="vio-container vio-section">
      <motion.section
        className="relative w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div
          className="relative min-h-[420px] w-full overflow-hidden rounded-[2rem] bg-cover bg-center shadow-soft"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(6,8,15,0.25), rgba(6,8,15,0.35)), url(${(rooms[0] && rooms[0].image) || ''})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 mx-auto flex min-h-[420px] max-w-6xl flex-col justify-center gap-5 px-6 py-12 text-left text-white sm:px-10 lg:px-12">
            <p className="text-sm font-medium uppercase tracking-[0.32em] text-white/75">Tất cả phòng</p>
            <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.02] md:text-6xl">Không gian dành cho bạn</h1>
            <p className="max-w-2xl text-sm leading-7 text-white/80 md:text-base">Hình ảnh thật, giá công khai — chọn phòng rồi tiếp tục đặt chỗ trong vài bước.</p>

            <div className="mt-3 flex w-full max-w-4xl flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-white/12 p-4 backdrop-blur-xl md:flex-row md:items-center">
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <input aria-label="checkin" type="date" className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none ring-0 focus:border-white/35" />
                <input aria-label="checkout" type="date" className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none ring-0 focus:border-white/35" />
                <select aria-label="guests" className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none ring-0 focus:border-white/35">
                  <option>1 khách</option>
                  <option>2 khách</option>
                  <option>3 khách</option>
                </select>
              </div>
              <Button type="button" className="w-full shrink-0 md:w-auto md:px-8">
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      <Card className="mt-24 border-none bg-vio-white/70 p-0 md:hidden">
        <CardHeader className="p-8">
          <CardTitle className="text-xl">Sẵn sàng đặt?</CardTitle>
          <CardDescription>Mở form tìm kiếm để chọn ngày và số khách.</CardDescription>
        </CardHeader>
        <div className="border-t border-vio-navy/[0.06] px-8 pb-8">
          <Button type="button" className="w-full" onClick={() => navigate('/search')}>
            Đặt phòng ngay
          </Button>
        </div>
      </Card>

      <motion.div
        className="mt-10 flex items-center justify-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {loading ? <LoadingSpinner label="Đang tải danh sách phòng..." /> : null}
      </motion.div>

      <motion.div
        className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className="mb-6 flex flex-col gap-4 rounded-[1.5rem] border border-vio-navy/10 bg-white/80 p-4 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-vio-navy/70">Sắp xếp:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="rounded-xl border border-vio-navy/10 bg-white px-4 py-2.5 text-sm text-vio-navy shadow-sm outline-none focus:border-vio-navy/30"
              >
                <option value="low">Giá thấp → cao</option>
                <option value="high">Giá cao → thấp</option>
                <option value="popular">Phổ biến</option>
              </select>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="rounded-xl border border-vio-navy/10 bg-white px-4 py-2.5 text-sm text-vio-navy shadow-sm transition-colors hover:bg-vio-sand/40"
              >
                Bộ lọc
              </button>
              <div className={`overflow-hidden transition-all ${filterOpen ? 'max-h-40' : 'max-h-0'}`}>
                <div className="flex gap-2 p-2">
                  <select className="rounded-xl border border-vio-navy/10 px-3 py-2 text-sm">
                    <option>Loại phòng</option>
                  </select>
                  <select className="rounded-xl border border-vio-navy/10 px-3 py-2 text-sm">
                    <option>Giá</option>
                  </select>
                  <select className="rounded-xl border border-vio-navy/10 px-3 py-2 text-sm">
                    <option>Số người</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="md:ml-auto">
            <p className="text-sm font-medium text-vio-navy/75">⭐ 4.8/5 từ 120+ khách</p>
          </div>
        </motion.div>

        <motion.div
          className="transition-opacity duration-300"
          style={{ opacity: loading ? 0.9 : 1 }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="overflow-hidden p-0">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-4 p-8 md:p-10">
                    <Skeleton className="h-7 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex items-end justify-between pt-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : sortedRooms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <EmptyState
                className="mt-10 p-10 text-center"
                title="Không có phòng phù hợp"
                description="Hãy thử giảm số khách hoặc đổi ngày để xem thêm lựa chọn."
                action={
                  <Button type="button" onClick={() => navigate('/search')}>
                    Điều chỉnh tìm kiếm
                  </Button>
                }
              />
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            >
              {sortedRooms.map((room) => {
                const unavailable = unavailableRoomIds.has(room.id)
                return (
                  <motion.div
                    key={room.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                    }}
                    className="h-full"
                  >
                    <RoomCard
                      room={room}
                      unavailable={unavailable}
                      featured={room.featured}
                      onDetail={() => {
                        if (unavailable) return
                        const query = new URLSearchParams()
                        if (searchFilters.checkIn) query.set('checkIn', searchFilters.checkIn)
                        if (searchFilters.checkOut) query.set('checkOut', searchFilters.checkOut)
                        query.set('guests', searchFilters.guests)
                        setBookingDraft({
                          roomId: room.id,
                          checkIn: searchFilters.checkIn,
                          checkOut: searchFilters.checkOut,
                          guests: searchFilters.guests,
                          adults: searchFilters.guests,
                          children: '0',
                        })
                        navigate(`/rooms/${room.id}${query.toString() ? `?${query.toString()}` : ''}`)
                      }}
                      className="h-full"
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
