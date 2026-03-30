import { useCallback, useEffect, useState } from 'react'
import { cn } from '../../lib/cn'

type RoomGalleryCarouselProps = {
  images: string[]
  alt: string
  className?: string
}

export function RoomGalleryCarousel({
  images,
  alt,
  className,
}: RoomGalleryCarouselProps) {
  const [index, setIndex] = useState(0)
  const len = images.length

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + len) % len)
    },
    [len],
  )

  useEffect(() => {
    const t = window.setInterval(() => go(1), 6500)
    return () => window.clearInterval(t)
  }, [go])

  if (len === 0) return null

  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-vio-navy/5', className)}>
      <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? alt : ''}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-[var(--ease-vio)]',
              i === index
                ? 'opacity-100 scale-100'
                : 'pointer-events-none opacity-0 scale-[1.04]',
            )}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vio-navy/25 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      <button
        type="button"
        aria-label="Ảnh trước"
        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-vio-white/90 text-vio-navy shadow-soft-sm ring-1 ring-vio-navy/8 transition-all duration-300 hover:brightness-105 md:left-6"
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
        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-vio-white/90 text-vio-navy shadow-soft-sm ring-1 ring-vio-navy/8 transition-all duration-300 hover:brightness-105 md:right-6"
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

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:bottom-6">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ảnh ${i + 1}`}
            aria-current={i === index}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === index
                ? 'w-8 bg-vio-white'
                : 'w-1.5 bg-vio-white/45 hover:bg-vio-white/70',
            )}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
