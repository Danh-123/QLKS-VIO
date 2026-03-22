import { useNavigate } from 'react-router-dom'
import { ScrollReveal } from '../components/guest/ScrollReveal'
import { Button } from '../components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { rooms } from '../data/rooms'
import { RoomCard } from '../components/guest/RoomCard'

export function RoomListPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <ScrollReveal className="mb-16 text-center md:mb-20">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-vio-navy/40">
          Tất cả phòng
        </p>
        <h1 className="mt-4 font-heading text-4xl font-medium leading-[1.12] tracking-[0.02em] text-vio-navy md:text-5xl md:leading-[1.1]">
          Không gian dành cho bạn
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.85] tracking-[0.02em] text-vio-navy/55 md:text-lg">
          Hình ảnh thật, giá công khai — chọn phòng rồi tiếp tục đặt chỗ trong
          vài bước.
        </p>
      </ScrollReveal>

      <Card className="mb-16 border-none bg-vio-white/70 p-0 md:hidden">
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

      <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onDetail={() => navigate(`/rooms/${room.id}`)}
          />
        ))}
      </div>
    </div>
  )
}
