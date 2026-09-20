import { defaultScenario, SCHEMA_VERSION, STORAGE_KEY } from '../defaults/scenario'
import type { ScenarioInputs } from '../calculator/types'

export function loadScenario(): ScenarioInputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultScenario)
    const parsed = JSON.parse(raw) as ScenarioInputs
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      return structuredClone(defaultScenario)
    }
    return { ...structuredClone(defaultScenario), ...parsed }
  } catch {
    return structuredClone(defaultScenario)
  }
}

export function saveScenario(inputs: ScenarioInputs): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
}

export function clearScenario(): void {
  localStorage.removeItem(STORAGE_KEY)
}
