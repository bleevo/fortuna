import type { CalculationResult } from '@/calculator/types'
import { Section } from '@/components/Section'
import { Stat } from '@/components/Stat'

export function PensionDetailTab({ result }: { result: CalculationResult }) {
  return (
    <Section
      title="Pension detail"
      description={`Binding test: ${result.pension.bindingTest}.`}
    >
      <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Stat
          label="Maximum pension"
          value={result.pension.maxAnnual}
          sourceId="sa-age-pension-rates"
        />
        <Stat
          label="After assets test"
          value={result.pension.assetsTestAnnual}
          sourceId="sa-assets-test"
        />
        <Stat
          label="After income test"
          value={result.pension.incomeTestAnnual}
          sourceId="sa-income-test"
        />
        <Stat
          label="Deemed income"
          value={result.pension.deemedIncomeAnnual}
          sourceId="sa-deeming"
        />
        <Stat
          label="Assets reduction"
          value={result.pension.assetsReductionAnnual}
          sourceId="sa-assets-test"
        />
        <Stat
          label="Income reduction"
          value={result.pension.incomeReductionAnnual}
          sourceId="sa-income-test"
        />
        <Stat
          label="Assessable assets"
          value={result.pension.assessableAssets}
          sourceId="sa-assets-test"
        />
        <Stat label="Exempt assets" value={result.pension.exemptAssets} />
      </dl>
    </Section>
  )
}
