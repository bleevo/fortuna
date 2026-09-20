import {
  FORTNIGHTS_PER_YEAR,
  INCOME_FREE_COUPLE_FORTNIGHTLY,
  INCOME_FREE_SINGLE_FORTNIGHTLY,
  INCOME_TAPER_RATE,
} from './rates'
import { maxPensionAnnual } from './assetsTest'

export function incomeFreeAreaAnnual(single: boolean): number {
  const fn = single ? INCOME_FREE_SINGLE_FORTNIGHTLY : INCOME_FREE_COUPLE_FORTNIGHTLY
  return fn * FORTNIGHTS_PER_YEAR
}

/** Annual assessable income at which the income test pays nothing. */
export function incomeCutoffAnnual(single: boolean, freeAreaOverride?: number): number {
  const freeAnnual = freeAreaOverride ?? incomeFreeAreaAnnual(single)
  return freeAnnual + maxPensionAnnual(single) / INCOME_TAPER_RATE
}

export function incomeTestPensionAnnual(
  assessableIncomeAnnual: number,
  single: boolean,
  freeAreaOverride?: number,
): { pensionAnnual: number; reductionAnnual: number; freeAreaAnnual: number } {
  const maxAnnual = maxPensionAnnual(single)
  const freeAnnual = freeAreaOverride ?? incomeFreeAreaAnnual(single)
  if (assessableIncomeAnnual <= freeAnnual) {
    return { pensionAnnual: maxAnnual, reductionAnnual: 0, freeAreaAnnual: freeAnnual }
  }
  const excessAnnual = assessableIncomeAnnual - freeAnnual
  const reductionAnnual = excessAnnual * INCOME_TAPER_RATE
  const pensionAnnual = Math.max(0, maxAnnual - reductionAnnual)
  return {
    pensionAnnual,
    reductionAnnual: Math.min(reductionAnnual, maxAnnual),
    freeAreaAnnual: freeAnnual,
  }
}
