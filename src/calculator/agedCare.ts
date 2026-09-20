import type { ScenarioInputs } from './types'

export function agedCareActive(inputs: ScenarioInputs, age: number): boolean {
  return inputs.agedCareEnabled && age >= inputs.agedCareStartAge
}

export function homeAssessableInAgedCare(inputs: ScenarioInputs): boolean {
  if (inputs.agedCareHomeSold) return true
  if (inputs.protectedPersonInHome) return false
  return true
}

export function agedCareCostsAnnual(inputs: ScenarioInputs): number {
  return inputs.agedCareAccommodationAnnual + inputs.agedCareMeansTestedAnnual
}
