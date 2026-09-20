import { currentAge, MONTH_NAMES } from '@/calculator/age'
import type { ScenarioInputs } from '@/calculator/types'
import { NumberField } from '@/components/NumberField'
import { Section } from '@/components/Section'
import { Toggle } from '@/components/Toggle'
import { Label } from '@/components/ui/label'
import type { PatchInput } from '@/components/tabs/types'

export function ProfileTab({
  inputs,
  patch,
}: {
  inputs: ScenarioInputs
  patch: PatchInput
}) {
  const age = currentAge(inputs)

  return (
    <Section
      title="Person & horizon"
      description={`Starter scenario: single homeowner, age ${age} to ${inputs.endAge}.`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="birthMonth">Birth month</Label>
          <select
            id="birthMonth"
            value={inputs.birthMonth}
            onChange={(e) => patch('birthMonth', Number(e.target.value))}
            className="w-full rounded-md border border-[var(--color-line)] bg-white px-3 py-2.5 text-[var(--color-ink)] shadow-sm"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <NumberField
          id="birthYear"
          label="Birth year"
          value={inputs.birthYear}
          min={1900}
          max={new Date().getFullYear()}
          onChange={(v) => patch('birthYear', v)}
          help={`Currently ${age} years old.`}
        />
        <NumberField
          id="endAge"
          label="Planning end age"
          value={inputs.endAge}
          min={age + 1}
          max={110}
          onChange={(v) => patch('endAge', v)}
        />
        <Toggle
          label="Single"
          checked={inputs.single}
          onChange={(v) => patch('single', v)}
        />
        <Toggle
          label="Homeowner"
          checked={inputs.homeowner}
          onChange={(v) => patch('homeowner', v)}
        />
      </div>
    </Section>
  )
}
