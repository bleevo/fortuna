import {
  ASSETS_CUTOFF_COUPLE_HOMEOWNER,
  ASSETS_CUTOFF_COUPLE_NON_HOMEOWNER,
  ASSETS_CUTOFF_SINGLE_HOMEOWNER,
  ASSETS_CUTOFF_SINGLE_NON_HOMEOWNER,
  ASSETS_FULL_COUPLE_HOMEOWNER,
  ASSETS_FULL_COUPLE_NON_HOMEOWNER,
  ASSETS_FULL_SINGLE_HOMEOWNER,
  ASSETS_FULL_SINGLE_NON_HOMEOWNER,
  ASSETS_TAPER_PER_1000_FORTNIGHTLY,
  FORTNIGHTS_PER_YEAR,
  MAX_PENSION_COUPLE_COMBINED_FORTNIGHTLY,
  MAX_PENSION_SINGLE_FORTNIGHTLY,
} from './rates'

export function maxPensionAnnual(single: boolean): number {
  const fn = single
    ? MAX_PENSION_SINGLE_FORTNIGHTLY
    : MAX_PENSION_COUPLE_COMBINED_FORTNIGHTLY
  return fn * FORTNIGHTS_PER_YEAR
}

export function assetsFullThreshold(single: boolean, homeowner: boolean): number {
  if (single) {
    return homeowner ? ASSETS_FULL_SINGLE_HOMEOWNER : ASSETS_FULL_SINGLE_NON_HOMEOWNER
  }
  return homeowner ? ASSETS_FULL_COUPLE_HOMEOWNER : ASSETS_FULL_COUPLE_NON_HOMEOWNER
}

export function assetsCutoff(single: boolean, homeowner: boolean): number {
  if (single) {
    return homeowner ? ASSETS_CUTOFF_SINGLE_HOMEOWNER : ASSETS_CUTOFF_SINGLE_NON_HOMEOWNER
  }
  return homeowner ? ASSETS_CUTOFF_COUPLE_HOMEOWNER : ASSETS_CUTOFF_COUPLE_NON_HOMEOWNER
}

export function indexThreshold(base: number, ratePct: number, years: number): number {
  return base * (1 + ratePct / 100) ** years
}

export function assetsTestPensionAnnual(
  assessableAssets: number,
  single: boolean,
  homeowner: boolean,
  thresholdOverride?: number,
): { pensionAnnual: number; reductionAnnual: number; threshold: number } {
  const threshold = thresholdOverride ?? assetsFullThreshold(single, homeowner)
  const maxAnnual = maxPensionAnnual(single)
  if (assessableAssets <= threshold) {
    return { pensionAnnual: maxAnnual, reductionAnnual: 0, threshold }
  }
  const excess = assessableAssets - threshold
  const reductionFortnightly = (excess / 1000) * ASSETS_TAPER_PER_1000_FORTNIGHTLY
  const reductionAnnual = reductionFortnightly * FORTNIGHTS_PER_YEAR
  const pensionAnnual = Math.max(0, maxAnnual - reductionAnnual)
  return {
    pensionAnnual,
    reductionAnnual: Math.min(reductionAnnual, maxAnnual),
    threshold,
  }
}
