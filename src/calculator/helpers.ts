import type { ScenarioInputs } from './types'

export function clampPct(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(100, Math.max(0, value))
}

export function money(n: number): number {
  return Math.round(n * 100) / 100
}

export function applyModeAdjustments(inputs: ScenarioInputs): ScenarioInputs {
  if (inputs.mode === 'balanced') return inputs
  if (inputs.mode === 'income') {
    return {
      ...inputs,
      annuityAllocationPct: Math.max(inputs.annuityAllocationPct, 40),
      assessableTarget: Math.max(inputs.assessableTarget, 280_000),
    }
  }
  return {
    ...inputs,
    annuityAllocationPct: Math.min(inputs.annuityAllocationPct, 20),
    assessableTarget: Math.min(inputs.assessableTarget, 333_000),
  }
}
