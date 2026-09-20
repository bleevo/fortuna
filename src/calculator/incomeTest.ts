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

export function incomeTestPensionAnnual(
  assessableIncomeAnnual: number,
  single: boolean,
): { pensionAnnual: number; reductionAnnual: number } {
  const maxAnnual = maxPensionAnnual(single)
  const freeAnnual = incomeFreeAreaAnnual(single)
  if (assessableIncomeAnnual <= freeAnnual) {
    return { pensionAnnual: maxAnnual, reductionAnnual: 0 }
  }
  const excessAnnual = assessableIncomeAnnual - freeAnnual
  const reductionAnnual = excessAnnual * INCOME_TAPER_RATE
  const pensionAnnual = Math.max(0, maxAnnual - reductionAnnual)
  return {
    pensionAnnual,
    reductionAnnual: Math.min(reductionAnnual, maxAnnual),
  }
}
