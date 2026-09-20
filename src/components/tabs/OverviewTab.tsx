import type { CalculationResult, ScenarioInputs } from '@/calculator/types'
import { CashflowDiagram } from '@/components/CashflowDiagram'
import { SummaryCards } from '@/components/SummaryCards'
import { TimelineCharts } from '@/components/TimelineCharts'
import { Card } from '@/components/ui/card'
import { formatAUD } from '@/lib/utils'

export function OverviewTab({
  inputs,
  result,
}: {
  inputs: ScenarioInputs
  result: CalculationResult
}) {
  return (
    <>
      <SummaryCards
        items={[
          {
            label: 'Annual pension',
            value: result.income.pension,
            hint: `Binding test: ${result.pension.bindingTest}`,
            sourceId: 'sa-age-pension-rates',
          },
          {
            label: 'Spendable / year',
            value: result.income.spendable,
            hint: `${formatAUD(result.income.monthlySpendable)} / month`,
          },
          {
            label: 'Assessable assets',
            value: result.pension.assessableAssets,
            hint: `Exempt ${formatAUD(result.pension.exemptAssets)}`,
            sourceId: 'sa-assets-test',
          },
          {
            label: 'Liquid at end age',
            value: result.timeline.at(-1)?.liquidCapital ?? 0,
            hint: `Age ${inputs.endAge}`,
          },
        ]}
      />

      <CashflowDiagram result={result} />
      <TimelineCharts timeline={result.timeline} />

      {result.warnings.length > 0 ? (
        <Card className="border-amber-300 bg-amber-50">
          <h3 className="font-display text-xl">Notes</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {result.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Card>
      ) : null}
    </>
  )
}
