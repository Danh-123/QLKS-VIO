import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  as?: 'div' | 'article' | 'section'
}

export function Card({
  children,
  className,
  as: Tag = 'div',
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-2xl bg-vio-white p-8 shadow-md ring-1 ring-vio-navy/[0.06] transition-all duration-300 ease-[var(--ease-vio)] hover:scale-[1.02]',
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
