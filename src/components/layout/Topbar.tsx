import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type TopbarProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

export function Topbar({ title, subtitle, actions, className }: TopbarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex min-h-[88px] items-center justify-between gap-8 border-b border-vio-navy/[0.06] bg-vio-cream/80 px-6 py-6 backdrop-blur-md md:px-10',
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-medium tracking-tight text-vio-navy md:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-vio-navy/50">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </header>
  )
}
