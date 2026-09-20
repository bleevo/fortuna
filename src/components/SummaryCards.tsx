import { SourceRef } from '@/components/SourceRef'
import { Card } from '@/components/ui/card'
import type { SourceId } from '@/calculator/sources'
import { formatAUD } from '@/lib/utils'

export function SummaryCards({
  items,
}: {
  items: {
    label: string
    value: number
    hint?: string
    sourceId?: SourceId
  }[]
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="bg-[var(--color-accent-soft)]/50">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              {item.label}
            </p>
            {item.sourceId ? <SourceRef sourceId={item.sourceId} /> : null}
          </div>
          <p className="mt-2 font-display text-3xl text-[var(--color-accent-deep)]">
            {formatAUD(item.value)}
          </p>
          {item.hint ? (
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{item.hint}</p>
          ) : null}
        </Card>
      ))}
    </div>
  )
}
