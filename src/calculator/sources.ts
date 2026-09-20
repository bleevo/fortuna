/**
 * Authoritative source catalogue for figures used in Fortuna.
 * Prefer Services Australia / ATO pages; secondary publishers used where
 * they republish the same indexed figures for the current rate period.
 */

export type SourceId =
  | 'sa-age-pension-rates'
  | 'sa-assets-test'
  | 'sa-income-test'
  | 'sa-deeming'
  | 'sa-gifting'
  | 'ato-tax-rates'
  | 'ato-sapto'
  | 'ato-downsizer'

export type SourceRefData = {
  id: SourceId
  title: string
  publisher: string
  url: string
  asOf: string
  note?: string
}

export const SOURCES: Record<SourceId, SourceRefData> = {
  'sa-age-pension-rates': {
    id: 'sa-age-pension-rates',
    title: 'How much Age Pension you can get',
    publisher: 'Services Australia',
    url: 'https://www.servicesaustralia.gov.au/how-much-age-pension-you-can-get',
    asOf: '20 September 2026',
    note: 'Maximum Age Pension rates (including supplements).',
  },
  'sa-assets-test': {
    id: 'sa-assets-test',
    title: 'Assets test for Age Pension',
    publisher: 'Services Australia',
    url: 'https://www.servicesaustralia.gov.au/assets-test-for-age-pension',
    asOf: '20 September 2026',
    note: 'Full-pension asset limits, cut-offs and $3/$1,000 taper.',
  },
  'sa-income-test': {
    id: 'sa-income-test',
    title: 'Income test for Age Pension',
    publisher: 'Services Australia',
    url: 'https://www.servicesaustralia.gov.au/income-test-for-age-pension',
    asOf: '20 September 2026',
    note: 'Income free areas and 50c taper.',
  },
  'sa-deeming': {
    id: 'sa-deeming',
    title: 'Deeming',
    publisher: 'Services Australia',
    url: 'https://www.servicesaustralia.gov.au/deeming',
    asOf: '20 September 2026',
    note: 'Deeming thresholds and lower/upper deeming rates.',
  },
  'sa-gifting': {
    id: 'sa-gifting',
    title: 'Gifting',
    publisher: 'Services Australia',
    url: 'https://www.servicesaustralia.gov.au/gifting',
    asOf: '20 September 2026',
    note: '$10,000 / year and $30,000 / 5-year deprivation limits.',
  },
  'ato-tax-rates': {
    id: 'ato-tax-rates',
    title: 'Tax rates for Australian residents',
    publisher: 'Australian Taxation Office',
    url: 'https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents',
    asOf: '2025–26 / 2026–27',
    note: 'Resident individual tax brackets used for rough private-income tax.',
  },
  'ato-sapto': {
    id: 'ato-sapto',
    title: 'Seniors and pensioners tax offset (SAPTO)',
    publisher: 'Australian Taxation Office',
    url: 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/seniors-and-pensioners-tax-offset',
    asOf: '2025–26 / 2026–27',
    note: 'Simplified single SAPTO max and shade-out used in the model.',
  },
  'ato-downsizer': {
    id: 'ato-downsizer',
    title: 'Downsizer contributions',
    publisher: 'Australian Taxation Office',
    url: 'https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-employers/super/growing-and-using-your-super/contribution-caps/downsizer-contributions',
    asOf: 'Current',
    note: 'Maximum downsizer contribution per person.',
  },
}

export function getSource(id: SourceId): SourceRefData {
  return SOURCES[id]
}
