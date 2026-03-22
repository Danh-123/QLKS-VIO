import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  id: string
  error?: string
}

export function Input({
  label,
  id,
  className,
  error,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={id}
          className={cn(
            'peer block w-full rounded-xl border-0 bg-vio-white px-4 pb-3.5 pt-7 text-base leading-relaxed tracking-[0.02em] text-vio-navy shadow-soft-sm ring-1 ring-vio-navy/10 transition-all duration-300 ease-[var(--ease-vio)] placeholder:text-transparent focus:ring-2 focus:ring-vio-navy/20 focus:outline-none',
            error && 'ring-vio-gold/50 focus:ring-vio-gold/40',
            className,
          )}
          placeholder=" "
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 origin-[0] -translate-y-1/2 text-base text-vio-navy/45 transition-all duration-300 ease-[var(--ease-vio)]',
            'peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-vio-navy/55',
            'peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-vio-navy/55',
          )}
        >
          {label}
        </label>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-vio-navy/60" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
