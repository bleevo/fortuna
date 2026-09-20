import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'

export function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
}) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-[var(--color-ink)]">{title}</h2>
        {description ? (
          <div className="mt-1 text-[var(--color-ink-muted)]">{description}</div>
        ) : null}
      </div>
      {children}
    </Card>
  )
}
