import type { CalculationResult } from '@/calculator/types'
import { Section } from '@/components/Section'
import { formatAUD } from '@/lib/utils'

export function YearByYearTab({ result }: { result: CalculationResult }) {
  return (
    <Section
      title="Year-by-year"
      description="Projection from the current age through to the planning end age."
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] text-[var(--color-ink-muted)]">
              <th className="py-2 pr-3">Age</th>
              <th className="py-2 pr-3">Pension</th>
              <th className="py-2 pr-3">Spendable</th>
              <th className="py-2 pr-3">Assessable</th>
              <th className="py-2 pr-3">Liquid</th>
              <th className="py-2">Test</th>
            </tr>
          </thead>
          <tbody>
            {result.timeline.map((row) => (
              <tr key={row.age} className="border-b border-[var(--color-line)]/70">
                <td className="py-2 pr-3 font-medium">{row.age}</td>
                <td className="py-2 pr-3">{formatAUD(row.pension)}</td>
                <td className="py-2 pr-3">{formatAUD(row.spendable)}</td>
                <td className="py-2 pr-3">{formatAUD(row.assessableAssets)}</td>
                <td className="py-2 pr-3">{formatAUD(row.liquidCapital)}</td>
                <td className="py-2 capitalize">{row.bindingTest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
