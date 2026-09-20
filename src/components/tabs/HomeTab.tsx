import type { ScenarioInputs } from '@/calculator/types'
import { NumberField } from '@/components/NumberField'
import { Section } from '@/components/Section'
import type { PatchInput } from '@/components/tabs/types'

export function HomeTab({
  inputs,
  patch,
}: {
  inputs: ScenarioInputs
  patch: PatchInput
}) {
  return (
    <Section
      title="Capital & home"
      description="Starting capital, the principal home and exempt prepaid items."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="startingCash"
          label="Starting liquid cash"
          value={inputs.startingCash}
          step={1000}
          onChange={(v) => patch('startingCash', v)}
        />
        <NumberField
          id="assessableTarget"
          label="Assessable investment target"
          value={inputs.assessableTarget}
          step={1000}
          onChange={(v) => patch('assessableTarget', v)}
          help="Surplus above this is modelled into the principal home."
        />
        <NumberField
          id="homeValue"
          label="Home value"
          value={inputs.homeValue}
          step={1000}
          onChange={(v) => patch('homeValue', v)}
        />
        <NumberField
          id="homeGrowthPct"
          label="Home growth"
          value={inputs.homeGrowthPct}
          step={0.1}
          suffix="%"
          onChange={(v) => patch('homeGrowthPct', v)}
        />
        <NumberField
          id="setupExpenses"
          label="One-off setup / moving costs"
          value={inputs.setupExpenses}
          step={500}
          onChange={(v) => patch('setupExpenses', v)}
        />
        <NumberField
          id="prepaidFuneral"
          label="Prepaid funeral"
          value={inputs.prepaidFuneral}
          step={500}
          onChange={(v) => patch('prepaidFuneral', v)}
        />
        <NumberField
          id="cemeteryPlot"
          label="Cemetery plot"
          value={inputs.cemeteryPlot}
          step={500}
          onChange={(v) => patch('cemeteryPlot', v)}
        />
        <NumberField
          id="superBalance"
          label="Super balance"
          value={inputs.superBalance}
          step={1000}
          onChange={(v) => patch('superBalance', v)}
        />
      </div>
    </Section>
  )
}
