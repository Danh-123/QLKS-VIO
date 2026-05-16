import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Skeleton } from '../components/ui/Skeleton'
import { formatVnd } from '../data/roomDetails'
import { roomApi, API_BASE_URL } from '../../lib/api'
import { getStoredUser } from '../../hooks/useAuth'

type ApiRoom = {
  id: string
  name: string
  type?: string
  price?: number
  basePriceVnd?: number
  priceFrom?: string
  status?: string
  image?: string
  description?: string
  capacity?: number
  guests?: number
}

export function RoomListPage() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<ApiRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<'low' | 'high' | 'popular'>('popular')

  useEffect(() => {
    let active = true

    async function loadRooms() {
      setLoading(true)
      setError(null)
      setDebugInfo(null)

      try {
        const data = await roomApi.getAll()
        if (!active) return
        setRooms(Array.isArray(data) ? (data as ApiRoom[]) : [])
        // expose debug info on success
        setDebugInfo({ apiBase: API_BASE_URL })
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách phòng.')
        setDebugInfo({ apiBase: API_BASE_URL, fetchError: err instanceof Error ? err.message : String(err) })
        setRooms([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadRooms()

    return () => {
      active = false
    }
  }, [])

  const [debugInfo, setDebugInfo] = useState<{ apiBase?: string; fetchError?: string } | null>(null)

  const sortedRooms = useMemo(() => {
    const copy = [...rooms]
    if (sort === 'low') {
      return copy.sort((a, b) => (a.basePriceVnd || a.price || 0) - (b.basePriceVnd || b.price || 0))
    }
    if (sort === 'high') {
      return copy.sort((a, b) => (b.basePriceVnd || b.price || 0) - (a.basePriceVnd || a.price || 0))
    }
    return copy
  }, [rooms, sort])

  const heroRoom = sortedRooms[0]

  const handleBook = (roomId: string) => {
    const user = getStoredUser()
    const bookingPath = `/booking/${roomId}`

    if (!user) {
      navigate(`/login?reason=auth&redirect=${encodeURIComponent(bookingPath)}&from=${encodeURIComponent(bookingPath)}`)
      return
    }

    navigate(bookingPath)
  }

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
            backgroundImage: `linear-gradient(to bottom, rgba(6,8,15,0.25), rgba(6,8,15,0.35)), url(${heroRoom?.image || ''})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 mx-auto flex min-h-[420px] max-w-6xl flex-col justify-center gap-5 px-6 py-12 text-left text-white sm:px-10 lg:px-12">
            <p className="text-sm font-medium uppercase tracking-[0.32em] text-white/75">Tất cả phòng</p>
            <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.02] md:text-6xl">Không gian dành cho bạn</h1>
            <p className="max-w-2xl text-sm leading-7 text-white/80 md:text-base">Hình ảnh thật, giá công khai — chọn phòng rồi tiếp tục đặt chỗ trong vài bước.</p>
          </div>
        </div>
      </motion.section>

      <div className="mt-24 flex flex-col gap-4 rounded-[1.5rem] border border-vio-navy/10 bg-white/80 p-4 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/40">Danh sách phòng</p>
          <h2 className="mt-2 font-heading text-3xl font-medium text-vio-navy md:text-4xl">Chọn phòng phù hợp với kỳ nghỉ của bạn</h2>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-vio-navy/70">Sắp xếp:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'low' | 'high' | 'popular')}
            className="rounded-xl border border-vio-navy/10 bg-white px-4 py-2.5 text-sm text-vio-navy shadow-sm outline-none focus:border-vio-navy/30"
          >
            <option value="popular">Phổ biến</option>
            <option value="low">Giá thấp → cao</option>
            <option value="high">Giá cao → thấp</option>
          </select>
        </div>
      </div>

      <motion.div
        className="mt-10 flex items-center justify-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {loading ? <LoadingSpinner label="Đang tải danh sách phòng..." /> : null}
      </motion.div>

      {error ? (
        <EmptyState
          className="mt-8 p-8 text-center"
          title="Không tải được danh sách phòng"
          description={error}
        />
      ) : null}

      {debugInfo ? (
        <div className="mt-6 text-sm text-vio-navy/60">
          <p>API Base: <strong>{debugInfo.apiBase || '(empty)'}</strong></p>
          {debugInfo.fetchError ? <p>Error: {debugInfo.fetchError}</p> : null}
          <div className="mt-3">
            <button
              className="rounded-xl border px-3 py-2 text-sm"
              onClick={() => {
                setLoading(true)
                setError(null)
                setRooms([])
                // re-run the effect's loader
                ;(async () => {
                  try {
                    const data = await roomApi.getAll()
                    setRooms(Array.isArray(data) ? (data as ApiRoom[]) : [])
                    setDebugInfo({ apiBase: API_BASE_URL })
                  } catch (e) {
                    setError(e instanceof Error ? e.message : String(e))
                    setDebugInfo({ apiBase: API_BASE_URL, fetchError: e instanceof Error ? e.message : String(e) })
                  } finally {
                    setLoading(false)
                  }
                })()
              }}
            >Retry</button>
          </div>
        </div>
      ) : null}

      <motion.div
        className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
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
            <EmptyState
              className="mt-10 p-10 text-center"
              title="Không có phòng phù hợp"
              description="Hiện chưa có phòng nào để hiển thị."
            />
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            >
              {sortedRooms.map((room) => {
                const price = room.basePriceVnd || room.price || 0
                const capacity = room.capacity || room.guests || 2

                return (
                  <motion.article
                    key={room.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                    }}
                    className="h-full"
                  >
                    <Card className="group flex h-full flex-col overflow-hidden border-vio-navy/10 p-0 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-2xl">
                      <div className="relative aspect-[4/3] overflow-hidden bg-vio-sand/40">
                        {room.image ? (
                          <img
                            src={room.image}
                            alt={room.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                        <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-vio-navy shadow-soft-sm">
                          {room.type || 'Room'}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6 md:p-7">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-heading text-2xl font-medium text-vio-navy">{room.name}</h3>
                              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-vio-navy/40">{room.type || 'Phòng'}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-xs uppercase tracking-[0.2em] text-vio-navy/35">Từ</p>
                              <p className="mt-1 font-heading text-xl text-vio-navy">{formatVnd(price)}</p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-sm text-vio-navy/55">
                            <span className="rounded-full bg-vio-gold/15 px-3 py-1 font-medium text-vio-navy">{capacity} khách</span>
                            {room.status ? <span className="rounded-full bg-vio-navy/5 px-3 py-1">{room.status}</span> : null}
                          </div>

                          <p className="mt-4 text-sm leading-7 text-vio-navy/65">
                            {room.description || 'Mô tả phòng chưa được cập nhật.'}
                          </p>
                        </div>

                        <div className="mt-6">
                          <Button type="button" className="w-full" onClick={() => handleBook(room.id)}>
                            Đặt phòng
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.article>
                )
              })}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
