import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-vio-navy text-vio-white shadow-soft-sm hover:bg-vio-navy/[0.94] hover:shadow-soft hover:brightness-[1.03] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-vio-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-vio-cream',
  secondary:
    'bg-vio-white text-vio-navy shadow-soft-sm ring-1 ring-vio-navy/8 hover:bg-vio-cream/70 hover:shadow-soft hover:brightness-[1.02] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-vio-navy/20 focus-visible:ring-offset-2 focus-visible:ring-offset-vio-cream',
  ghost:
    'bg-transparent text-vio-navy hover:bg-vio-navy/[0.06] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-vio-navy/15 focus-visible:ring-offset-2 focus-visible:ring-offset-vio-cream',
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
        'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium tracking-[0.02em] transition-all duration-500 ease-[var(--ease-vio)] hover:scale-[1.03] disabled:pointer-events-none disabled:opacity-45 disabled:hover:scale-100',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
