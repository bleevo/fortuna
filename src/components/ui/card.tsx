import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-panel)] p-5 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}
