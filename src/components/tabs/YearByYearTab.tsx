import type { CalculationResult, ScenarioInputs } from '@/calculator/types'
import { Section } from '@/components/Section'
import { formatAUD } from '@/lib/utils'

export function YearByYearTab({
  inputs,
  result,
}: {
  inputs: ScenarioInputs
  result: CalculationResult
}) {
  return (
    <Section
      title="Year-by-year"
      description={`Projection from the current age through to the planning end age. Thresholds and cut-offs are indexed forward at ${inputs.thresholdIndexationPct}% a year.`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-[var(--color-ink-muted)]">
            <tr className="border-b border-[var(--color-line)]/70">
              <th className="py-2 pr-3" rowSpan={2}>
                Age
              </th>
              <th className="py-2 pr-3" rowSpan={2}>
                Pension
              </th>
              <th className="py-2 pr-3" rowSpan={2}>
                Spendable
              </th>
              <th className="py-2 pr-3" colSpan={3}>
                Assets test
              </th>
              <th className="py-2 pr-3" colSpan={2}>
                Income test
              </th>
              <th className="py-2 pr-3" rowSpan={2}>
                Liquid
              </th>
              <th className="py-2" rowSpan={2}>
                Test
              </th>
            </tr>
            <tr className="border-b border-[var(--color-line)] text-xs">
              <th className="py-2 pr-3 font-normal">Assessable</th>
              <th className="py-2 pr-3 font-normal">Full pension</th>
              <th className="py-2 pr-3 font-normal">Cut-off</th>
              <th className="py-2 pr-3 font-normal">Assessable</th>
              <th className="py-2 pr-3 font-normal">Cut-off</th>
            </tr>
          </thead>
          <tbody>
            {result.timeline.map((row) => (
              <tr key={row.age} className="border-b border-[var(--color-line)]/70">
                <td className="py-2 pr-3 font-medium">{row.age}</td>
                <td className="py-2 pr-3">{formatAUD(row.pension)}</td>
                <td className="py-2 pr-3">{formatAUD(row.spendable)}</td>
                <td className="py-2 pr-3">{formatAUD(row.assessableAssets)}</td>
                <td className="py-2 pr-3 text-[var(--color-ink-muted)]">
                  {formatAUD(row.assetsThreshold)}
                </td>
                <td className="py-2 pr-3 text-[var(--color-ink-muted)]">
                  {formatAUD(row.assetsCutoff)}
                </td>
                <td className="py-2 pr-3">{formatAUD(row.assessableIncome)}</td>
                <td className="py-2 pr-3 text-[var(--color-ink-muted)]">
                  {formatAUD(row.incomeCutoff)}
                </td>
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
