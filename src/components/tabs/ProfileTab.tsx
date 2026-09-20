import type { ScenarioInputs } from '@/calculator/types'
import { NumberField } from '@/components/NumberField'
import { Section } from '@/components/Section'
import { Toggle } from '@/components/Toggle'
import type { PatchInput } from '@/components/tabs/types'

export function ProfileTab({
  inputs,
  patch,
}: {
  inputs: ScenarioInputs
  patch: PatchInput
}) {
  return (
    <Section
      title="Person & horizon"
      description="Starter scenario: single homeowner, age 80 to 95."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="age"
          label="Current age"
          value={inputs.age}
          min={65}
          max={100}
          onChange={(v) => patch('age', v)}
        />
        <NumberField
          id="endAge"
          label="Planning end age"
          value={inputs.endAge}
          min={inputs.age + 1}
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
