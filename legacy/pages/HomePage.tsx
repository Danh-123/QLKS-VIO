'use client'

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/guest/ScrollReveal'
import { rooms as allRooms, featuredRooms } from '../data/rooms'
import { cn } from '../lib/cn'

const heroImage =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=80'

const storyImage =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80'

const bannerImage =
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2400&q=80'

const heroEase = [0.33, 0.1, 0.25, 1] as const

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
} as const

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

const bookingFields = [
  { label: 'Check-in', value: '14 Jun 2026' },
  { label: 'Check-out', value: '16 Jun 2026' },
  { label: 'Guests', value: '2 guests' },
] as const

const trustStats = [
  { value: '4.8/5', label: 'từ 120+ khách' },
  { value: 'Top retreat', label: 'tại Vịnh Hạ Long' },
  { value: '24/7', label: 'concierge & hỗ trợ' },
] as const

const whyChooseUs = [
  {
    title: 'Riêng tư',
    text: 'Không gian tách biệt, yên tĩnh và được thiết kế để bạn thật sự nghỉ ngơi.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3c4.5 0 8 3.5 8 8 0 5.5-8 10-8 10S4 16.5 4 11c0-4.5 3.5-8 8-8z"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle cx="12" cy="11" r="2.25" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    ),
  },
  {
    title: 'Thiết kế độc bản',
    text: 'Chất liệu tự nhiên, ánh sáng ấm và tỷ lệ hài hòa tạo nên dấu ấn rất riêng.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 19V5l8 4 8-4v14l-8 4-8-4z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path d="M12 9v10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Dịch vụ cá nhân hóa',
    text: 'Từ bữa sáng tới trải nghiệm địa phương, mọi chi tiết đều theo nhịp của bạn.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7 7h10v10H7V7z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path d="M4 12h3M17 12h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M12 4v3M12 17v3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
] as const

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
        <path d="M6 20h12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
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
        <path d="M5 20a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
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

const testimonials = [
  {
    quote: 'Mọi thứ được chăm chút rất tinh tế. Phòng yên tĩnh, nhân viên nhớ cả sở thích của chúng tôi.',
    name: 'Ngọc Anh',
    detail: '2 đêm tại Suite Hướng biển',
  },
  {
    quote: 'Bữa sáng, spa và view biển đều vượt kỳ vọng. Rất đáng để quay lại vào cuối tuần.',
    name: 'Minh Khang',
    detail: 'Kỳ nghỉ gia đình',
  },
  {
    quote: 'Từ lúc đặt phòng đến khi nhận phòng đều mượt. Cảm giác như một retreat riêng tư thật sự.',
    name: 'Sarah Chen',
    detail: 'Khách quốc tế',
  },
] as const

const roomMeta: Record<string, { guests: string; size: string; view: string }> = {
  'ocean-suite': { guests: '2 khách', size: '58m²', view: 'View vịnh' },
  'garden-villa': { guests: '4 khách', size: '96m²', view: 'Vườn riêng' },
  'sky-penthouse': { guests: '2 khách', size: '128m²', view: 'Panorama' },
  'garden-deluxe': { guests: '2 khách', size: '42m²', view: 'Vườn nhiệt đới' },
  harbour: { guests: '2 khách', size: '36m²', view: 'Hướng cảng' },
  studio: { guests: '1–2 khách', size: '32m²', view: 'Skyline' },
}

const featuredOffer = {
  title: 'Ưu đãi mùa hè - Giảm 20%',
  text: 'Áp dụng cho kỳ lưu trú từ 2 đêm trở lên, tặng thêm bữa sáng cho 2 khách.',
}

function RoomCard({
  room,
  featured = false,
  onExplore,
  onBook,
}: {
  room: (typeof featuredRooms)[number]
  featured?: boolean
  onExplore: () => void
  onBook: () => void
}) {
  const meta = roomMeta[room.id] ?? { guests: '2 khách', size: '40m²', view: 'View đẹp' }
  const badge = featured ? 'Luxury' : room.featured ? 'Best Seller' : 'Value'

  return (
    <motion.article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
      )}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <motion.img
          src={room.image || '/fallback.jpg'}
          alt={room.name}
          className="h-full w-full object-cover"
          loading="lazy"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" aria-hidden />
        <div className="absolute left-4 top-4 rounded-full bg-vio-navy/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white shadow-sm">
          {badge}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 md:p-6">
        <div>
          <h3 className="line-clamp-2 font-heading text-2xl font-semibold leading-tight tracking-wide text-vio-navy">
            {room.name}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
            {room.description}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-vio-navy/65 sm:grid-cols-4">
            <span className="rounded-full bg-vio-cream px-3 py-2 text-center">👤 {meta.guests}</span>
            <span className="rounded-full bg-vio-cream px-3 py-2 text-center">🛏 {meta.size}</span>
            <span className="rounded-full bg-vio-cream px-3 py-2 text-center">📐 {meta.view}</span>
            <span className="rounded-full bg-vio-cream px-3 py-2 text-center">🌊 View</span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-vio-navy/40">Giá</p>
              <p className="mt-1 text-lg font-semibold text-vio-navy md:text-2xl">{room.priceFrom}</p>
            </div>
            {featured ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Giảm 20%
              </span>
            ) : null}
          </div>
        </div>
        <div className="mt-auto flex gap-3 pt-5">
          <motion.button
            type="button"
            className="w-full sm:w-auto rounded-xl border border-vio-navy/10 bg-white px-8 py-4 text-sm font-medium tracking-[0.02em] text-vio-navy transition-all duration-300 ease-[var(--ease-vio)] hover:bg-vio-navy/[0.04]"
            onClick={onExplore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Xem chi tiết
          </motion.button>
          <motion.button
            type="button"
            className="w-full sm:w-auto rounded-xl bg-[#1E3A5F] px-8 py-4 text-sm font-medium tracking-[0.02em] text-vio-white shadow-soft-sm transition-all duration-300 ease-[var(--ease-vio)] hover:brightness-105"
            onClick={onBook}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Đặt ngay
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-vio-cream text-vio-navy">
      <motion.section
        className="relative flex min-h-[100dvh] min-h-screen w-full flex-col justify-end overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          initial={{ opacity: 0, y: 20, scale: 1.06 }}
          animate={{ opacity: 1, y: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,26,38,0.28)_0%,rgba(15,26,38,0.6)_48%,rgba(15,26,38,0.86)_100%)]"
          aria-hidden
        />
        <motion.div
          className="vio-container relative z-10 flex w-full flex-col justify-end pb-20 pt-28 md:pb-28"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={heroItem}
            className="mb-6 max-w-xl text-[11px] font-medium uppercase tracking-[0.42em] text-vio-white/86 md:text-xs"
          >
            WELCOME TO VIO
          </motion.p>
          <motion.h1
            variants={heroItem}
            className="max-w-4xl font-heading text-5xl font-medium leading-[1.02] tracking-[0.03em] text-vio-white sm:text-6xl md:text-7xl lg:text-[5.6rem]"
          >
            A Sanctuary of Stillness
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="mt-8 max-w-2xl text-base leading-[1.9] tracking-[0.02em] text-vio-white/88 md:text-lg"
          >
            Time slows between sea breeze, soft light, and quiet rituals.
          </motion.p>

          <motion.div variants={heroItem} className="mt-10 flex flex-wrap gap-4">
            <Button
              type="button"
              className="min-h-12 px-6"
              onClick={() => navigate('/search')}
            >
              Đặt phòng ngay
            </Button>
            <Button
              type="button"
              className="min-h-12 bg-vio-white/10 px-6 text-vio-white ring-1 ring-inset ring-vio-white/18 backdrop-blur hover:bg-vio-white/16"
              onClick={() => navigate('/rooms')}
            >
              Khám phá phòng
            </Button>
          </motion.div>

          <motion.div
            variants={heroItem}
            className="mt-10 rounded-[1.75rem] border border-vio-white/12 bg-vio-white/10 p-4 backdrop-blur-xl md:p-5"
          >
            <div className="grid gap-4 lg:grid-cols-[1.15fr_1.15fr_0.85fr_auto]">
              {bookingFields.map((field) => (
                <div
                  key={field.label}
                  className="rounded-[1.2rem] border border-vio-white/10 bg-vio-white/8 px-4 py-4"
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-vio-white/65">
                    {field.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-vio-white">{field.value}</p>
                </div>
              ))}
              <Button
                type="button"
                className="min-h-12 self-stretch px-7 text-sm"
                onClick={() => navigate('/search')}
              >
                Search
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className="border-b border-vio-navy/[0.06] bg-vio-white/92"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="vio-container py-8 md:py-10">
          <ScrollReveal>
            <div className="grid gap-4 rounded-[1.75rem] border border-vio-navy/[0.06] bg-vio-cream p-5 shadow-soft-sm md:grid-cols-[1.2fr_1fr] md:items-center md:p-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-vio-navy/42">
                  Social proof
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-base font-medium text-vio-navy md:text-lg">
                  <span>⭐ 4.8/5 từ 120+ khách</span>
                  <span className="hidden h-1 w-1 rounded-full bg-vio-navy/20 md:inline-block" />
                  <span>Top retreat tại Vịnh Hạ Long</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {trustStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.25rem] border border-vio-navy/[0.06] bg-vio-white px-4 py-4 text-center"
                  >
                    <p className="font-heading text-2xl font-medium text-vio-navy md:text-[1.9rem]">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-vio-navy/44">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </motion.section>

      <motion.section
        className="bg-vio-cream"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="vio-container vio-section">
          <ScrollReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/45">
              Phòng nổi bật
            </p>
            <h2 className="mt-6 font-heading text-4xl font-medium leading-[1.08] tracking-[0.03em] text-vio-navy md:text-5xl lg:text-[3.4rem]">
              Không gian mở, ánh sáng tự nhiên
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-[1.9] tracking-[0.02em] text-vio-navy/58 md:text-lg">
              Ba phong cách lưu trú — hình ảnh lớn, chữ ít, mỗi phòng là một nhịp riêng.
            </p>
          </ScrollReveal>

          <motion.div
            className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            <motion.div className="grid grid-cols-1 gap-8 items-stretch sm:grid-cols-2 lg:grid-cols-3">
              {allRooms.map((room, index) => (
                <motion.div key={room.id} variants={staggerItem} className="h-full">
                  <RoomCard
                    room={room}
                    featured={index === 0 || featuredRooms.some((item) => item.id === room.id)}
                    onExplore={() => navigate(`/rooms/${room.id}`)}
                    onBook={() => navigate('/search')}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="bg-vio-white"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="vio-container vio-section">
          <ScrollReveal className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/45">
              Vì sao chọn VIO
            </p>
            <h2 className="mt-6 font-heading text-4xl font-medium leading-[1.08] tracking-[0.03em] text-vio-navy md:text-5xl lg:text-[3.2rem]">
              Tinh tế từ trải nghiệm đến dịch vụ
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {whyChooseUs.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.06} y={24}>
                <div className="group h-full rounded-[1.75rem] border border-vio-navy/[0.06] bg-vio-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:border-vio-gold/25 hover:bg-vio-white hover:shadow-soft-lg">
                  <span className="inline-flex rounded-2xl border border-vio-navy/[0.07] bg-vio-white p-4 text-vio-navy transition-colors duration-300 group-hover:text-vio-gold">
                    {item.icon}
                  </span>
                  <h3 className="mt-6 font-heading text-2xl font-medium text-vio-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.9] text-vio-navy/58 md:text-base">
                    {item.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="bg-vio-cream"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="vio-container vio-section">
          <ScrollReveal className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/45">
              Tiện ích
            </p>
            <h2 className="mt-6 font-heading text-4xl font-medium leading-[1.08] tracking-[0.03em] text-vio-navy md:text-5xl lg:text-[3.2rem]">
              Mọi thứ cần thiết, không thừa
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.04} y={24}>
                <div className="group h-full rounded-[1.6rem] border border-vio-navy/[0.06] bg-vio-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-vio-gold/20 hover:shadow-soft-lg">
                  <span className="inline-flex rounded-2xl bg-vio-cream p-4 text-vio-navy transition-colors duration-300 group-hover:bg-vio-navy group-hover:text-vio-white">
                    {item.icon}
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-medium text-vio-navy md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.9] text-vio-navy/56 md:text-base">
                    {item.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="relative min-h-[min(72vh,820px)] w-full overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.img
          src={bannerImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          initial={{ opacity: 0, y: 24, scale: 1.04 }}
          whileInView={{ opacity: 1, y: 0, scale: 1.02 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,26,38,0.2)_0%,rgba(15,26,38,0.56)_100%)]" aria-hidden />
        <div className="relative flex min-h-[min(72vh,820px)] items-center justify-center px-6 py-16 md:py-24">
          <ScrollReveal className="text-center" y={32}>
            <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-vio-white/88">
              VIO Experiences
            </p>
            <h2 className="mt-6 font-heading text-3xl font-medium leading-[1.18] tracking-wide text-vio-white md:text-5xl md:leading-[1.12]">
              Một buổi chiều bên hồ — một buổi tối bên bàn
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.9] text-vio-white/84 md:text-lg">
              Cocktail, spa, hoặc chỉ là không làm gì cả. Chúng tôi sắp xếp theo nhịp của bạn.
            </p>
            <div className="mt-10">
              <Button
                type="button"
                className="min-h-12 px-8"
                onClick={() => navigate('/rooms')}
              >
                Khám phá trải nghiệm
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </motion.section>

      <section className="bg-vio-white">
        <div className="vio-container vio-section">
          <ScrollReveal className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-vio-navy/45">
              Khách nói gì
            </p>
            <h2 className="mt-6 font-heading text-4xl font-medium leading-[1.08] tracking-[0.03em] text-vio-navy md:text-5xl lg:text-[3.2rem]">
              Review được ghi nhớ bởi cảm giác thư thái
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((review, index) => (
              <ScrollReveal key={review.name} delay={index * 0.05} y={24}>
                <figure className="h-full rounded-[1.75rem] border border-vio-navy/[0.06] bg-vio-cream p-7 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
                  <div className="flex items-center gap-1 text-vio-gold" aria-hidden>
                    {'★★★★★'.split('').map((star, starIndex) => (
                      <span key={`${review.name}-${starIndex}`}>{star}</span>
                    ))}
                  </div>
                  <blockquote className="mt-5 text-sm leading-[1.95] text-vio-navy/66 md:text-base">
                    “{review.quote}”
                  </blockquote>
                  <figcaption className="mt-6">
                    <p className="font-heading text-xl font-medium text-vio-navy">{review.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-vio-navy/42">
                      {review.detail}
                    </p>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        className="bg-vio-cream"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="vio-container vio-section">
          <ScrollReveal>
            <div className="overflow-hidden rounded-[2rem] border border-vio-navy/[0.06] bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(246,240,225,0.96)_100%)] p-8 shadow-soft-lg md:p-10 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-10">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-vio-navy/42">
                  Special offer
                </p>
                <h2 className="mt-4 font-heading text-4xl font-medium leading-[1.08] tracking-[0.03em] text-vio-navy md:text-5xl">
                  {featuredOffer.title}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-[1.9] text-vio-navy/58 md:text-lg">
                  {featuredOffer.text}
                </p>
                <div className="mt-8">
                  <Button type="button" onClick={() => navigate('/search')}>
                    Nhận ưu đãi ngay
                  </Button>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 lg:mt-0">
                {[heroImage, storyImage, bannerImage].map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="overflow-hidden rounded-[1.5rem] border border-vio-navy/[0.06] bg-vio-white shadow-soft-sm"
                  >
                    <img
                      src={image}
                      alt=""
                      className="aspect-[3/4] w-full object-cover transition-transform duration-300 hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </motion.section>

      <motion.section
        className="bg-vio-navy text-vio-white"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="vio-container vio-section">
          <ScrollReveal className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-vio-white/72">
              Limited availability
            </p>
            <h2 className="mt-6 font-heading text-4xl font-medium leading-[1.12] tracking-[0.03em] md:text-5xl lg:text-[3.6rem]">
              Số lượng phòng có hạn mỗi ngày
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.9] text-vio-white/82 md:text-lg">
              Đặt ngay để giữ mức giá tốt nhất và trải nghiệm được cá nhân hóa từ lúc chạm tới.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                type="button"
                variant="ghost"
                className="min-h-12 px-6 bg-white text-black hover:bg-[#f2f2f2]"
                onClick={() => navigate('/search')}
              >
                Đặt phòng ngay
              </Button>
              <Button
                type="button"
                className="min-h-12 px-6 bg-transparent text-black ring-1 ring-inset ring-vio-white/22 hover:bg-vio-white/12"
                onClick={() => navigate('/contact')}
              >
                Liên hệ tư vấn
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </motion.section>

      <motion.footer
        className="border-t border-vio-navy/[0.06] bg-vio-cream"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="vio-container py-10 md:py-14 lg:py-16">
          <ScrollReveal>
            <div className="overflow-hidden rounded-[2rem] border border-vio-navy/[0.06] bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(246,240,225,0.98)_52%,rgba(235,225,203,0.96)_100%)] shadow-soft-lg">
              <div className="grid gap-10 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12 lg:py-12">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-vio-navy/38">
                    VIO Private Collection
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-vio-gold/20 bg-vio-white px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-vio-navy/65 shadow-soft-sm">
                    <span className="h-2 w-2 rounded-full bg-vio-gold" />
                    Thank you section
                  </div>
                  <h3 className="mt-5 font-heading text-4xl font-medium leading-[1.08] tracking-[0.03em] text-vio-navy md:text-5xl lg:text-[3.6rem]">
                    Cảm ơn bạn đã ghé thăm
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-[1.9] text-vio-navy/62 md:text-lg">
                    Một kỳ nghỉ được chọn lọc kỹ lưỡng, từ ánh sáng buổi sáng đến lời chào buổi tối.
                  </p>
                  <p className="mt-6 max-w-xl border-l-2 border-vio-gold/50 pl-4 text-sm italic leading-[1.9] text-vio-navy/52 md:text-base">
                    “Quiet luxury, thoughtfully hosted.”
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      type="button"
                      className="min-h-12 bg-vio-navy px-6 text-vio-white hover:bg-vio-navy/90"
                      onClick={() => navigate('/rooms')}
                    >
                      Khám phá phòng
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="min-h-12 px-6 bg-white text-vio-navy hover:bg-vio-navy/[0.04]"
                      onClick={() => navigate('/contact')}
                    >
                      Liên hệ tư vấn
                    </Button>
                  </div>

                  <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                    {[
                      { value: '24/7', label: 'Hỗ trợ' },
                      { value: '120+', label: 'Khách hài lòng' },
                      { value: 'Top', label: 'Trải nghiệm nghỉ dưỡng' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1.35rem] border border-vio-navy/[0.06] bg-vio-white/80 px-4 py-4 text-center shadow-soft-sm"
                      >
                        <p className="font-heading text-2xl font-medium text-vio-navy md:text-[1.9rem]">
                          {item.value}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-vio-navy/42">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 md:gap-4">
                  <div className="col-span-7 overflow-hidden rounded-[1.5rem] border border-vio-navy/[0.06] shadow-soft-sm">
                    <img
                      src={heroImage}
                      alt=""
                      className="aspect-[4/5] w-full object-cover transition-transform duration-300 hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  <div className="col-span-5 flex flex-col gap-3 md:gap-4">
                    {[storyImage, bannerImage].map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-[1.5rem] border border-vio-navy/[0.06] shadow-soft-sm"
                      >
                        <img
                          src={image}
                          alt=""
                          className="aspect-[4/5] w-full object-cover transition-transform duration-300 hover:scale-[1.04]"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </motion.footer>
    </div>
  )
}
