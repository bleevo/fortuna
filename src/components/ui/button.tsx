import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'lg'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:opacity-50',
        size === 'md' && 'px-4 py-2.5 text-base',
        size === 'lg' && 'px-5 py-3 text-lg',
        variant === 'primary' &&
          'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-deep)]',
        variant === 'secondary' &&
          'border border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:bg-[var(--color-paper-deep)]',
        variant === 'ghost' && 'text-[var(--color-ink-muted)] hover:bg-black/5',
        variant === 'danger' && 'bg-[var(--color-warn)] text-white hover:opacity-90',
        className,
      )}
      {...props}
    />
  )
}
