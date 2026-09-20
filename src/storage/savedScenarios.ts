import { defaultScenario, SCHEMA_VERSION } from '../defaults/scenario'
import type { ScenarioInputs } from '../calculator/types'

export const SAVES_KEY = 'fortuna.saves.v1'

export type SavedScenario = {
  id: string
  name: string
  savedAt: string
  inputs: ScenarioInputs
}

function newId(): string {
  return `save-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function isSavedScenario(value: unknown): value is SavedScenario {
  if (typeof value !== 'object' || value === null) return false
  const save = value as Partial<SavedScenario>
  return (
    typeof save.id === 'string' &&
    typeof save.name === 'string' &&
    typeof save.savedAt === 'string' &&
    typeof save.inputs === 'object' &&
    save.inputs !== null &&
    save.inputs.schemaVersion === SCHEMA_VERSION
  )
}

export function listSavedScenarios(): SavedScenario[] {
  try {
    const raw = localStorage.getItem(SAVES_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isSavedScenario)
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
  } catch {
    return []
  }
}

function writeSaves(saves: SavedScenario[]): SavedScenario[] {
  localStorage.setItem(SAVES_KEY, JSON.stringify(saves))
  return saves
}

/** Saves under `name`, replacing any existing save with the same name. */
export function saveNamedScenario(
  name: string,
  inputs: ScenarioInputs,
): SavedScenario[] {
  const trimmed = name.trim()
  const existing = listSavedScenarios()
  const match = existing.find(
    (save) => save.name.toLowerCase() === trimmed.toLowerCase(),
  )
  const entry: SavedScenario = {
    id: match?.id ?? newId(),
    name: trimmed,
    savedAt: new Date().toISOString(),
    inputs: structuredClone(inputs),
  }
  const rest = existing.filter((save) => save.id !== entry.id)
  return writeSaves([entry, ...rest])
}

export function deleteSavedScenario(id: string): SavedScenario[] {
  return writeSaves(listSavedScenarios().filter((save) => save.id !== id))
}

export function savedScenarioInputs(save: SavedScenario): ScenarioInputs {
  return { ...structuredClone(defaultScenario), ...structuredClone(save.inputs) }
}
