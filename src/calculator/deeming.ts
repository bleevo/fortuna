import {
  DEEMING_LOWER_RATE,
  DEEMING_THRESHOLD_COUPLE,
  DEEMING_THRESHOLD_SINGLE,
  DEEMING_UPPER_RATE,
} from './rates'

export function deemingThreshold(single: boolean): number {
  return single ? DEEMING_THRESHOLD_SINGLE : DEEMING_THRESHOLD_COUPLE
}

export function deemedIncomeAnnual(financialAssets: number, single: boolean): number {
  const threshold = deemingThreshold(single)
  const lower = Math.min(financialAssets, threshold) * DEEMING_LOWER_RATE
  const upper = Math.max(0, financialAssets - threshold) * DEEMING_UPPER_RATE
  return lower + upper
}
