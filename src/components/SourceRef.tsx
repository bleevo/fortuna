import { BookMarked } from 'lucide-react'
import { getSource, type SourceId } from '@/calculator/sources'
import { cn } from '@/lib/utils'

type Props = {
  sourceId: SourceId
  /** Compact chip next to a figure; `inline` for use inside sentences. */
  variant?: 'chip' | 'inline'
  className?: string
}

/**
 * Consistent source-reference control. Links to the official page for a
 * published figure (pension rate, threshold, deeming rate, etc.).
 */
export function SourceRef({ sourceId, variant = 'chip', className }: Props) {
  const source = getSource(sourceId)
  const label =
    variant === 'inline'
      ? 'source'
      : 'Source'

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${source.publisher}: ${source.title} (as of ${source.asOf})`}
      aria-label={`Source: ${source.publisher} — ${source.title}, as of ${source.asOf}`}
      className={cn(
        'source-ref inline-flex items-center gap-1 font-semibold no-underline transition',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
        variant === 'chip' &&
          'rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-accent-soft)] px-2 py-0.5 text-[0.7rem] uppercase tracking-wide text-[var(--color-accent-deep)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]',
        variant === 'inline' &&
          'rounded px-1 text-xs text-[var(--color-accent-deep)] underline decoration-dotted underline-offset-2 hover:bg-[var(--color-accent-soft)]',
        className,
      )}
    >
      <BookMarked className="size-3.5 shrink-0" aria-hidden />
      <span>{label}</span>
      <span className="sr-only">
        {' '}
        ({source.publisher}, opens in a new tab)
      </span>
    </a>
  )
}
