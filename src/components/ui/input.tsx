import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-[var(--color-line)] bg-white px-3 py-2.5 text-[var(--color-ink)] shadow-sm',
        'placeholder:text-[var(--color-ink-muted)]',
        className,
      )}
      {...props}
    />
  )
}
