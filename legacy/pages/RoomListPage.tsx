import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScrollReveal } from '../components/guest/ScrollReveal'
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
    [
      getUnavailableRoomIds,
      searchFilters.checkIn,
      searchFilters.checkOut,
    ],
  )

  const { loading, data: displayedRooms } = useFakeApiData(visibleRooms, 850)

  return (
    <div className="vio-container vio-section">
      <ScrollReveal className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-vio-navy/40">
          Tất cả phòng
        </p>
        <h1 className="mt-4 font-heading text-4xl font-medium leading-[1.12] tracking-wide text-vio-navy md:text-5xl md:leading-[1.1]">
          Không gian dành cho bạn
        </h1>
        <p className="mx-auto mt-6 text-base leading-[1.85] tracking-[0.02em] text-vio-navy/55 md:text-lg">
          Hình ảnh thật, giá công khai — chọn phòng rồi tiếp tục đặt chỗ trong
          vài bước.
        </p>
      </ScrollReveal>

      <Card className="mt-24 border-none bg-vio-white/70 p-0 md:hidden">
        <CardHeader className="p-8">
          <CardTitle className="text-xl">Sẵn sàng đặt?</CardTitle>
          <CardDescription>
            Mở form tìm kiếm để chọn ngày và số khách.
          </CardDescription>
        </CardHeader>
        <div className="border-t border-vio-navy/[0.06] px-8 pb-8">
          <Button type="button" className="w-full" onClick={() => navigate('/search')}>
            Đặt phòng ngay
          </Button>
        </div>
      </Card>

      <div className="mt-10 flex items-center justify-center">
        {loading ? <LoadingSpinner label="Đang tải danh sách phòng..." /> : null}
      </div>

      <div className="mt-24 transition-opacity duration-300" style={{ opacity: loading ? 0.88 : 1 }}>
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
        ) : displayedRooms.length === 0 ? (
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
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayedRooms.map((room) => {
          const unavailable = unavailableRoomIds.has(room.id)
          return (
            <RoomCard
              key={room.id}
              room={room}
              unavailable={unavailable}
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
                navigate(
                  `/rooms/${room.id}${query.toString() ? `?${query.toString()}` : ''}`,
                )
              }}
            />
          )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
