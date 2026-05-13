import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[#0f172a] text-white hover:bg-[#0f172a]/90 shadow-soft-sm focus-visible:ring-2 focus-visible:ring-vio-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-vio-cream',
  secondary:
    'border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-vio-navy/20 focus-visible:ring-offset-2 focus-visible:ring-offset-vio-cream',
  ghost:
    'bg-transparent text-vio-navy hover:bg-vio-navy/[0.06] hover:brightness-105 focus-visible:ring-2 focus-visible:ring-vio-navy/15 focus-visible:ring-offset-2 focus-visible:ring-offset-vio-cream',
}

export function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-medium tracking-[0.02em] transition-all duration-300 ease-[var(--ease-vio)] hover:scale-105 disabled:pointer-events-none disabled:opacity-45 disabled:hover:scale-100',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
