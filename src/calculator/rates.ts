/**
 * Centrelink / ATO planning rates used by Fortuna.
 * Update when Services Australia / ATO publish new figures.
 * Figures as of 20 September 2026 unless noted.
 *
 * Each exported figure is paired with a SourceId in RATE_FIGURES so the UI
 * can show a consistent source chip linking to the official page.
 */

import type { SourceId } from './sources'

export const RATES_AS_OF = '20 September 2026'
export const FORTNIGHTS_PER_YEAR = 26

export const MAX_PENSION_SINGLE_FORTNIGHTLY = 1237.7
export const MAX_PENSION_COUPLE_COMBINED_FORTNIGHTLY = 1866.0

export const ASSETS_FULL_SINGLE_HOMEOWNER = 333_000
export const ASSETS_FULL_SINGLE_NON_HOMEOWNER = 600_000
export const ASSETS_FULL_COUPLE_HOMEOWNER = 499_000
export const ASSETS_FULL_COUPLE_NON_HOMEOWNER = 766_000

export const ASSETS_CUTOFF_SINGLE_HOMEOWNER = 745_750
export const ASSETS_CUTOFF_SINGLE_NON_HOMEOWNER = 1_012_750
export const ASSETS_CUTOFF_COUPLE_HOMEOWNER = 1_121_000
export const ASSETS_CUTOFF_COUPLE_NON_HOMEOWNER = 1_388_000

export const ASSETS_TAPER_PER_1000_FORTNIGHTLY = 3

export const INCOME_FREE_SINGLE_FORTNIGHTLY = 226
export const INCOME_FREE_COUPLE_FORTNIGHTLY = 396
export const INCOME_TAPER_RATE = 0.5

export const DEEMING_THRESHOLD_SINGLE = 66_800
export const DEEMING_THRESHOLD_COUPLE = 110_600
/** Updated 20 September 2026. */
export const DEEMING_LOWER_RATE = 0.0175
/** Updated 20 September 2026. */
export const DEEMING_UPPER_RATE = 0.0375

export const GIFTING_ANNUAL_LIMIT = 10_000
export const GIFTING_FIVE_YEAR_LIMIT = 30_000

export const TAX_BRACKETS: { upTo: number; rate: number; base: number }[] = [
  { upTo: 18_200, rate: 0, base: 0 },
  { upTo: 45_000, rate: 0.16, base: 0 },
  { upTo: 135_000, rate: 0.3, base: 4_288 },
  { upTo: 190_000, rate: 0.37, base: 31_288 },
  { upTo: Infinity, rate: 0.45, base: 51_638 },
]

export const SAPTO_SINGLE_MAX = 2_230
export const SAPTO_SHADE_IN_START = 32_279
export const SAPTO_SHADE_RATE = 0.125

export const MEDICARE_LEVY_RATE = 0.02
export const MEDICARE_LOW_SINGLE = 26_000

export const DOWNSIZER_MAX_PER_PERSON = 300_000

export type RateFigure = {
  id: string
  label: string
  value: number
  format: 'money' | 'money-fortnight' | 'pct' | 'money-per-1000'
  sourceId: SourceId
  detail?: string
}

/** Key published figures shown in the Rates & sources panel. */
export const RATE_FIGURES: RateFigure[] = [
  {
    id: 'max-pension-single',
    label: 'Max Age Pension — single',
    value: MAX_PENSION_SINGLE_FORTNIGHTLY,
    format: 'money-fortnight',
    sourceId: 'sa-age-pension-rates',
    detail: 'Includes pension + pension supplement + energy supplement.',
  },
  {
    id: 'max-pension-couple',
    label: 'Max Age Pension — couple combined',
    value: MAX_PENSION_COUPLE_COMBINED_FORTNIGHTLY,
    format: 'money-fortnight',
    sourceId: 'sa-age-pension-rates',
  },
  {
    id: 'assets-full-single-home',
    label: 'Assets full pension — single homeowner',
    value: ASSETS_FULL_SINGLE_HOMEOWNER,
    format: 'money',
    sourceId: 'sa-assets-test',
  },
  {
    id: 'assets-cutoff-single-home',
    label: 'Assets cut-off — single homeowner',
    value: ASSETS_CUTOFF_SINGLE_HOMEOWNER,
    format: 'money',
    sourceId: 'sa-assets-test',
  },
  {
    id: 'assets-taper',
    label: 'Assets taper',
    value: ASSETS_TAPER_PER_1000_FORTNIGHTLY,
    format: 'money-per-1000',
    sourceId: 'sa-assets-test',
    detail: '$3 reduction per fortnight for each $1,000 of assets above the lower limit.',
  },
  {
    id: 'income-free-single',
    label: 'Income free area — single',
    value: INCOME_FREE_SINGLE_FORTNIGHTLY,
    format: 'money-fortnight',
    sourceId: 'sa-income-test',
  },
  {
    id: 'income-taper',
    label: 'Income taper',
    value: INCOME_TAPER_RATE * 100,
    format: 'pct',
    sourceId: 'sa-income-test',
    detail: '50 cents reduction per $1 of assessable income above the free area.',
  },
  {
    id: 'deeming-threshold-single',
    label: 'Deeming threshold — single',
    value: DEEMING_THRESHOLD_SINGLE,
    format: 'money',
    sourceId: 'sa-deeming',
  },
  {
    id: 'deeming-lower',
    label: 'Lower deeming rate',
    value: DEEMING_LOWER_RATE * 100,
    format: 'pct',
    sourceId: 'sa-deeming',
  },
  {
    id: 'deeming-upper',
    label: 'Upper deeming rate',
    value: DEEMING_UPPER_RATE * 100,
    format: 'pct',
    sourceId: 'sa-deeming',
  },
  {
    id: 'gifting-annual',
    label: 'Gifting limit — per year',
    value: GIFTING_ANNUAL_LIMIT,
    format: 'money',
    sourceId: 'sa-gifting',
  },
  {
    id: 'gifting-five-year',
    label: 'Gifting limit — 5 years',
    value: GIFTING_FIVE_YEAR_LIMIT,
    format: 'money',
    sourceId: 'sa-gifting',
  },
  {
    id: 'downsizer',
    label: 'Downsizer contribution max / person',
    value: DOWNSIZER_MAX_PER_PERSON,
    format: 'money',
    sourceId: 'ato-downsizer',
  },
]
