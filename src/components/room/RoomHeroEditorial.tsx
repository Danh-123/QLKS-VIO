import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

const heroEase = [0.33, 0.1, 0.25, 1] as const

const overlayVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const lineVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: heroEase },
  },
}

type RoomHeroEditorialProps = {
  images: string[]
  roomName: string
  tagline: string
  priceLabel: string
  onBook: () => void
  onBack: () => void
}

export function RoomHeroEditorial({
  images,
  roomName,
  tagline,
  priceLabel,
  onBook,
  onBack,
}: RoomHeroEditorialProps) {
  const [index, setIndex] = useState(0)
  const len = images.length

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + len) % len)
    },
    [len],
  )

  useEffect(() => {
    const t = window.setInterval(() => go(1), 6000)
    return () => window.clearInterval(t)
  }, [go])

  if (len === 0) return null

  const active = images[index]

  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[80vh] md:max-h-[90vh]">
      <AnimatePresence mode="wait">
        <motion.img
          key={active}
          src={active}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: heroEase }}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </AnimatePresence>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vio-navy/85 via-vio-navy/35 to-vio-navy/15"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-vio-navy/50 via-transparent to-transparent md:from-vio-navy/40" />

      <button
        type="button"
        onClick={onBack}
        className="absolute left-6 top-6 z-20 text-sm tracking-[0.12em] text-vio-white/85 transition-colors duration-300 hover:text-vio-white md:left-10 md:top-8"
      >
        ← Quay lại
      </button>

      <button
        type="button"
        aria-label="Ảnh trước"
        className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-vio-white/90 text-vio-navy shadow-soft-lg ring-1 ring-vio-white/30 transition-all duration-300 hover:scale-[1.03] hover:brightness-105 md:left-8"
        onClick={() => go(-1)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Ảnh sau"
        className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-vio-white/90 text-vio-navy shadow-soft-lg ring-1 ring-vio-white/30 transition-all duration-300 hover:scale-[1.03] hover:brightness-105 md:right-8"
        onClick={() => go(1)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end px-6 pb-10 pt-32 md:px-10 md:pb-14 md:pt-40">
        <motion.div
          className="max-w-3xl"
          variants={overlayVariants}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={lineVariants}
            className="text-[10px] font-medium uppercase tracking-[0.38em] text-vio-white/88 md:text-[11px]"
          >
            VIO · Private Collection
          </motion.p>
          <motion.h1
            variants={lineVariants}
            className="mt-4 font-heading text-4xl font-medium leading-[1.08] tracking-[0.02em] text-vio-white md:text-6xl lg:text-7xl"
          >
            {roomName}
          </motion.h1>
          <motion.p
            variants={lineVariants}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.03em] text-vio-white/88 md:text-lg"
          >
            {tagline}
          </motion.p>
          <motion.div
            variants={lineVariants}
            className="mt-8 flex flex-wrap items-end gap-6 md:gap-10"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-vio-white/65">
                Giá từ / đêm
              </p>
              <p className="mt-2 font-heading text-2xl tracking-tight text-vio-white md:text-3xl">
                {priceLabel}
              </p>
            </div>
            <Button
              type="button"
              className="bg-vio-white px-8 text-vio-navy shadow-soft-sm transition-all duration-300 hover:brightness-[1.03]"
              onClick={onBook}
            >
              Đặt phòng ngay
            </Button>
          </motion.div>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-vio-white/15 pt-6 md:flex-row md:justify-between md:pt-8">
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1 md:gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  'relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition-all duration-500 md:h-16 md:w-24',
                  i === index
                    ? 'ring-vio-gold/80'
                    : 'ring-transparent opacity-75 hover:opacity-100',
                )}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-vio)] hover:scale-[1.05]"
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  i === index
                    ? 'w-8 bg-vio-white'
                    : 'w-1.5 bg-vio-white/40 hover:bg-vio-white/65',
                )}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
