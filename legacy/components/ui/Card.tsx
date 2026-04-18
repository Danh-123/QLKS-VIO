import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  as?: 'div' | 'article' | 'section'
  variant?: 'default' | 'gold' | 'elevated'
  goldBorder?: boolean
}

export function Card({
  children,
  className,
  as: Tag = 'div',
  variant = 'default',
  goldBorder = false,
  ...props
}: CardProps) {
  const useGoldBorder = goldBorder || variant === 'gold'

  return (
    <Tag
      className={cn(
        'rounded-xl bg-vio-white p-6 transition-all duration-200 ease-[var(--ease-vio)] hover:shadow-soft-lg',
        variant === 'elevated' ? 'shadow-soft-2xl' : 'shadow-soft',
        useGoldBorder ? 'border-t-2 border-vio-gold' : 'border-t-2 border-transparent',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mb-8 flex flex-col gap-2', className)}
      {...props}
    />
  )
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-heading text-2xl font-medium leading-[1.25] tracking-wide text-vio-navy',
        className,
      )}
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-sm leading-[1.7] tracking-[0.02em] text-vio-navy/[0.55]',
        className,
      )}
      {...props}
    />
  )
}
