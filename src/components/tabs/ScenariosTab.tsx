import { currentAge } from '@/calculator/age'
import { useState } from 'react'
import type { ScenarioInputs } from '@/calculator/types'
import { Section } from '@/components/Section'
import type { SetInputs } from '@/components/tabs/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatAUD } from '@/lib/utils'
import {
  deleteSavedScenario,
  listSavedScenarios,
  savedScenarioInputs,
  saveNamedScenario,
  type SavedScenario,
} from '@/storage/savedScenarios'

function formatSavedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown date'
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function summarise(inputs: ScenarioInputs): string {
  return [
    `Age ${currentAge(inputs)}–${inputs.endAge}`,
    inputs.single ? 'Single' : 'Couple',
    inputs.homeowner ? 'Homeowner' : 'Non-homeowner',
    `${formatAUD(inputs.startingCash)} starting cash`,
    `${formatAUD(inputs.annualSpendingTarget)} / year target`,
  ].join(' · ')
}

export function ScenariosTab({
  inputs,
  setInputs,
}: {
  inputs: ScenarioInputs
  setInputs: SetInputs
}) {
  const [saves, setSaves] = useState<SavedScenario[]>(listSavedScenarios)
  const [name, setName] = useState('')
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const trimmed = name.trim()
  const overwrites = saves.some(
    (save) => save.name.toLowerCase() === trimmed.toLowerCase(),
  )

  function save() {
    if (!trimmed) return
    setSaves(saveNamedScenario(trimmed, inputs))
    setStatus(`Saved “${trimmed}”.`)
    setName('')
    setPendingDelete(null)
  }

  function load(save: SavedScenario) {
    setInputs(savedScenarioInputs(save))
    setStatus(`Loaded “${save.name}” into the current scenario.`)
    setPendingDelete(null)
  }

  function remove(save: SavedScenario) {
    setSaves(deleteSavedScenario(save.id))
    setStatus(`Deleted “${save.name}”.`)
    setPendingDelete(null)
  }

  return (
    <>
      <Section
        title="Save current scenario"
        description="Named saves stay in this browser only, alongside the working scenario. Saving with an existing name replaces that save."
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-64 grow">
            <Label htmlFor="scenario-name">Save name</Label>
            <Input
              id="scenario-name"
              value={name}
              placeholder="e.g. Sell home at 85"
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') save()
              }}
            />
          </div>
          <Button type="button" disabled={!trimmed} onClick={save}>
            {overwrites ? 'Replace save' : 'Save scenario'}
          </Button>
        </div>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Current: {summarise(inputs)}
        </p>
        {status ? (
          <p className="text-sm font-semibold text-[var(--color-accent-deep)]">
            {status}
          </p>
        ) : null}
      </Section>

      <Section
        title="Saved scenarios"
        description={
          saves.length === 1 ? '1 saved scenario.' : `${saves.length} saved scenarios.`
        }
      >
        {saves.length === 0 ? (
          <p className="text-[var(--color-ink-muted)]">
            No saved scenarios yet. Name the current settings above to keep a copy
            you can come back to.
          </p>
        ) : (
          <ul className="space-y-3">
            {saves.map((save) => (
              <li
                key={save.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--color-line)] bg-white px-4 py-3"
              >
                <div className="min-w-64">
                  <p className="font-semibold text-[var(--color-ink)]">
                    {save.name}
                  </p>
                  <p className="text-sm text-[var(--color-ink-muted)]">
                    Saved {formatSavedAt(save.savedAt)}
                  </p>
                  <p className="text-sm text-[var(--color-ink-muted)]">
                    {summarise(save.inputs)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => load(save)}
                  >
                    Load
                  </Button>
                  {pendingDelete === save.id ? (
                    <>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => remove(save)}
                      >
                        Confirm delete
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setPendingDelete(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setPendingDelete(save.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
