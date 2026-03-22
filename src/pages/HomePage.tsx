import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/guest/ScrollReveal'
import { featuredRooms } from '../data/rooms'
import { cn } from '../lib/cn'

const heroImage =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=80'

const storyImage =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80'

const bannerImage =
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2400&q=80'

const heroEase = [0.33, 0.1, 0.25, 1] as const

const heroContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
}

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: heroEase,
    },
  },
}

const amenities = [
  {
    title: 'Spa & wellness',
    text: 'Liệu pháp theo mùa, không gian yên tĩnh.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v4M9 8h6M8 14c0 2.21 1.79 4 4 4s4-1.79 4-4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M6 20h12"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Ẩm thực tinh tế',
    text: 'Bữa sáng tại phòng, thực đơn theo ngày.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 10h8M8 14h5M6 4h12v16H6V4z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Hồ bơi vô cực',
    text: 'Tầm nhìn mở, nước trong và ánh sáng nhẹ.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 14c2.5 2 5.5 2 8 0s5.5-2 8 0"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M4 18c2.5 2 5.5 2 8 0s5.5-2 8 0"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Concierge riêng',
    text: 'Đặt tour, xe, bàn — một tin nhắn là đủ.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M5 20a7 7 0 0114 0"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Phòng tập & yoga',
    text: 'Không gian mở, thảm và ánh sáng tự nhiên.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Đưa đón',
    text: 'Xe sang trọng theo lịch — sân bay & điểm đến.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 14h2l1.5-4h9l1.5 4h2M6 14v4M18 14v4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="8" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="16" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    ),
  },
] as const

function FeaturedRoomCard({
  image,
  name,
  onExplore,
}: {
  image: string
  name: string
  onExplore: () => void
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-vio-white shadow-soft-lg ring-1 ring-vio-navy/[0.06] transition-all duration-500 ease-[var(--ease-vio)] hover:-translate-y-1 hover:shadow-soft-2xl">
      <button
        type="button"
        onClick={onExplore}
        className="relative block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vio-navy/25"
      >
        <div className="relative aspect-[3/4] overflow-hidden md:aspect-[4/5]">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 ease-[var(--ease-vio)] group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vio-navy/65 via-vio-navy/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
            <p className="font-heading text-2xl font-medium tracking-[0.02em] text-vio-white md:text-3xl">
              {name}
            </p>
            <span className="mt-4 inline-flex items-center text-xs font-medium uppercase tracking-[0.28em] text-vio-white/90">
              Khám phá
              <span className="ml-2 text-vio-gold" aria-hidden>
                →
              </span>
            </span>
          </div>
        </div>
      </button>
    </article>
  )
}

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="pb-40 md:pb-0">
      <section className="relative flex min-h-[100dvh] min-h-screen w-full flex-col justify-end overflow-hidden">
        <motion.img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.15, ease: heroEase }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-vio-navy/85 via-vio-navy/38 to-vio-navy/[0.18]"
          aria-hidden
        />
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl flex-col justify-end px-6 pb-16 pt-28 md:px-10 md:pb-24"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={heroItem}
            className="mb-6 max-w-xl text-[11px] font-medium uppercase tracking-[0.42em] text-vio-white/92 md:text-xs"
          >
            WELCOME TO VIO
          </motion.p>
          <motion.h1
            variants={heroItem}
            className="max-w-4xl font-heading text-[2.35rem] font-medium leading-[1.08] tracking-[0.01em] text-vio-white sm:text-5xl md:text-6xl md:leading-[1.05] lg:text-7xl"
          >
            A Sanctuary of Calm and Luxury
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="mt-8 max-w-xl text-base leading-[1.75] tracking-[0.02em] text-vio-white/88 md:text-lg md:leading-[1.8]"
          >
            Nơi thời gian chậm lại — giữa vườn nhiệt đới, ánh sáng mờ và dịch vụ
            thầm lặng.
          </motion.p>
          <motion.div variants={heroItem} className="mt-12">
            <Button
              type="button"
              className="min-h-12 bg-vio-white px-8 text-vio-navy transition-all duration-300 ease-[var(--ease-vio)] hover:brightness-[1.03] hover:shadow-none"
              onClick={() => navigate('/search')}
            >
              Đặt phòng ngay
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-vio-cream">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <ScrollReveal className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/45">
              Phòng nổi bật
            </p>
            <h2 className="mt-6 font-heading text-4xl font-medium leading-[1.12] tracking-[0.02em] text-vio-navy md:text-5xl lg:text-6xl">
              Không gian mở, ánh sáng tự nhiên
            </h2>
            <p className="mt-8 text-base leading-[1.85] tracking-[0.02em] text-vio-navy/55 md:text-lg">
              Ba phong cách lưu trú — hình ảnh lớn, chữ ít, mỗi phòng là một
              nhịp riêng.
            </p>
          </ScrollReveal>

          <div className="mt-20 grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {featuredRooms.map((room, i) => (
              <ScrollReveal key={room.id} delay={i * 0.08} y={32}>
                <FeaturedRoomCard
                  image={room.image}
                  name={room.name}
                  onExplore={() =>
                    navigate(`/rooms/${room.id}`)
                  }
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-vio-navy/[0.05] bg-vio-white">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-2 md:items-center md:gap-20 md:px-10 md:py-32">
          <ScrollReveal className="order-2 md:order-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/45">
              Triết lý VIO
            </p>
            <h2 className="mt-6 font-heading text-4xl font-medium leading-[1.15] tracking-[0.02em] text-vio-navy md:text-5xl lg:text-[3.25rem]">
              Chậm rãi, tinh giản, chân thành
            </h2>
            <div className="mt-10 space-y-6 text-base leading-[1.9] tracking-[0.02em] text-vio-navy/58 md:text-lg">
              <p>
                Chúng tôi tin vào sự im lặng của vật liệu tự nhiên — gỗ, đá,
                linen — và vào những khoảnh khắc không cần gắng gượng. Mỗi
                chi tiết được chọn để bạn cảm thấy nhẹ nhõm ngay khi bước vào.
              </p>
              <p>
                Tại VIO, sang trọng không phô trương: là ánh đèn ấm, là gió từ
                biển, là tiếng lá rất khẽ ngoài ban công.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal className="order-1 md:order-2" delay={0.06} y={36}>
            <div className="overflow-hidden rounded-2xl shadow-soft-lg ring-1 ring-vio-navy/[0.06]">
              <img
                src={storyImage}
                alt=""
                className="aspect-[4/5] w-full object-cover transition-transform duration-300 ease-[var(--ease-vio)] hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-vio-cream">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/45">
              Tiện ích
            </p>
            <h2 className="mt-6 font-heading text-4xl font-medium leading-[1.12] tracking-[0.02em] text-vio-navy md:text-5xl">
              Mọi thứ cần thiết, không thừa
            </h2>
          </ScrollReveal>
          <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-16">
            {amenities.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.05} y={28}>
                <div className="flex flex-col gap-5">
                  <span className="text-vio-navy/35 transition-colors duration-300 hover:text-vio-gold/90">
                    {item.icon}
                  </span>
                  <h3 className="font-heading text-xl font-medium tracking-[0.02em] text-vio-navy md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-[1.85] tracking-[0.02em] text-vio-navy/55 md:text-base">
                    {item.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[min(72vh,820px)] w-full overflow-hidden">
        <img
          src={bannerImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-vio-navy/45"
          aria-hidden
        />
        <div className="relative flex min-h-[min(72vh,820px)] items-center justify-center px-6 py-24 md:px-10">
          <ScrollReveal className="max-w-3xl text-center" y={32}>
            <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-vio-white/88">
              VIO Experiences
            </p>
            <h2 className="mt-8 font-heading text-3xl font-medium leading-[1.2] tracking-[0.02em] text-vio-white md:text-5xl md:leading-[1.15]">
              Một buổi chiều bên hồ — một buổi tối bên bàn
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-base leading-[1.85] text-vio-white/85 md:text-lg">
              Cocktail, spa, hoặc chỉ là không làm gì cả. Chúng tôi sắp xếp theo
              nhịp của bạn.
            </p>
            <div className="mt-12">
              <Button
                type="button"
                className="bg-vio-white px-8 text-vio-navy transition-all duration-300 hover:brightness-[1.03]"
                onClick={() => navigate('/rooms')}
              >
                Khám phá trải nghiệm
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-t border-vio-navy/[0.05] bg-vio-white">
        <ScrollReveal className="mx-auto max-w-4xl px-6 py-24 text-center md:px-10 md:py-32">
          <h2 className="font-heading text-4xl font-medium leading-[1.15] tracking-[0.02em] text-vio-navy md:text-5xl lg:text-6xl">
            Ready to experience VIO?
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-[1.9] tracking-[0.02em] text-vio-navy/55 md:text-lg">
            Đặt chỗ trong vài bước — chúng tôi giữ phòng cho bạn với sự trân
            trọng âm thầm.
          </p>
          <div className="mt-14 flex justify-center">
            <Button
              type="button"
              className="min-h-12 px-10 transition-all duration-300 hover:brightness-[1.06]"
              onClick={() => navigate('/search')}
            >
              Đặt phòng ngay
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <div
        className={cn(
          'fixed inset-x-0 z-[45] border-t border-vio-navy/[0.06] bg-vio-cream/92 p-4 backdrop-blur-md md:hidden',
          'bottom-[calc(4.25rem+env(safe-area-inset-bottom))]',
        )}
      >
        <Button
          type="button"
          className="w-full bg-vio-navy py-3.5 text-vio-white shadow-soft-sm transition-all duration-300 hover:brightness-110"
          onClick={() => navigate('/search')}
        >
          Đặt phòng ngay
        </Button>
      </div>
    </div>
  )
}
