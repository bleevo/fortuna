import type { SourceId } from '@/calculator/sources'
import { SourceRef } from '@/components/SourceRef'
import { formatAUD } from '@/lib/utils'

export function Stat({
  label,
  value,
  sourceId,
}: {
  label: string
  value: number
  sourceId?: SourceId
}) {
  return (
    <div className="rounded-md border border-[var(--color-line)] bg-white px-3 py-2">
      <dt className="flex items-start justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        <span>{label}</span>
        {sourceId ? <SourceRef sourceId={sourceId} /> : null}
      </dt>
      <dd className="mt-1 text-lg font-semibold">{formatAUD(value)}</dd>
    </div>
  )
}
