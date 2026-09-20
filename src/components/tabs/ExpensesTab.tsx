import type { OptimisationMode, ScenarioInputs } from '@/calculator/types'
import { NumberField } from '@/components/NumberField'
import { Section } from '@/components/Section'
import { SourceRef } from '@/components/SourceRef'
import { Toggle } from '@/components/Toggle'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { PatchInput, SetInputs } from '@/components/tabs/types'

export function ExpensesTab({
  inputs,
  patch,
  setInputs,
}: {
  inputs: ScenarioInputs
  patch: PatchInput
  setInputs: SetInputs
}) {
  return (
    <Section
      title="Spending, gifting & modes"
      description={
        <>
          Gifting above Centrelink limits remains assessable as a deprived asset
          for five years. <SourceRef sourceId="sa-gifting" />
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="annualSpendingTarget"
          label="Annual spending target"
          value={inputs.annualSpendingTarget}
          step={500}
          onChange={(v) => patch('annualSpendingTarget', v)}
        />
        <NumberField
          id="cashReserveMonths"
          label="Cash reserve"
          value={inputs.cashReserveMonths}
          step={1}
          suffix="months"
          onChange={(v) => patch('cashReserveMonths', v)}
        />
        <NumberField
          id="creditCardLimit"
          label="Credit card limit"
          value={inputs.creditCardLimit}
          step={100}
          onChange={(v) => patch('creditCardLimit', v)}
        />
        <NumberField
          id="thresholdIndexationPct"
          label="Inflation / threshold indexation"
          value={inputs.thresholdIndexationPct}
          step={0.1}
          suffix="%"
          onChange={(v) => {
            patch('thresholdIndexationPct', v)
            patch('inflationPct', v)
          }}
        />
        <NumberField
          id="gift0"
          label="Gift year 1"
          value={inputs.giftingYears[0] ?? 0}
          step={500}
          onChange={(v) =>
            setInputs((prev) => ({
              ...prev,
              giftingYears: [
                v,
                prev.giftingYears[1] ?? 0,
                prev.giftingYears[2] ?? 0,
              ],
            }))
          }
        />
        <NumberField
          id="gift1"
          label="Gift year 2"
          value={inputs.giftingYears[1] ?? 0}
          step={500}
          onChange={(v) =>
            setInputs((prev) => ({
              ...prev,
              giftingYears: [
                prev.giftingYears[0] ?? 0,
                v,
                prev.giftingYears[2] ?? 0,
              ],
            }))
          }
        />
      </div>

      <div className="mt-4">
        <Label>Optimisation mode</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ['balanced', 'Balanced'],
              ['income', 'Maximise income'],
              ['pension', 'Maximise pension'],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              type="button"
              variant={inputs.mode === value ? 'primary' : 'secondary'}
              onClick={() => patch('mode', value as OptimisationMode)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Toggle
          label="Run assessable investments to zero by end age"
          checked={inputs.runToZero}
          onChange={(v) => patch('runToZero', v)}
        />
        <Toggle
          label="Model aged care phase"
          checked={inputs.agedCareEnabled}
          onChange={(v) => patch('agedCareEnabled', v)}
        />
      </div>

      {inputs.agedCareEnabled ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <NumberField
            id="agedCareStartAge"
            label="Aged care start age"
            value={inputs.agedCareStartAge}
            onChange={(v) => patch('agedCareStartAge', v)}
          />
          <Toggle
            label="Home sold in aged care"
            checked={inputs.agedCareHomeSold}
            onChange={(v) => patch('agedCareHomeSold', v)}
          />
          <Toggle
            label="Protected person remains in home"
            checked={inputs.protectedPersonInHome}
            onChange={(v) => patch('protectedPersonInHome', v)}
          />
          <NumberField
            id="agedCareAccommodationAnnual"
            label="Accommodation costs / year"
            value={inputs.agedCareAccommodationAnnual}
            step={1000}
            onChange={(v) => patch('agedCareAccommodationAnnual', v)}
          />
        </div>
      ) : null}
    </Section>
  )
}
