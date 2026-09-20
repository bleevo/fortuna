import type { ScenarioInputs } from './types'

export type BirthDate = Pick<ScenarioInputs, 'birthMonth' | 'birthYear'>

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/**
 * Whole years completed as at `asOf`. Only month precision is known, so
 * someone is treated as turning their new age at the start of their birth
 * month.
 */
export function currentAge(birth: BirthDate, asOf: Date = new Date()): number {
  const months =
    (asOf.getFullYear() - birth.birthYear) * 12 +
    (asOf.getMonth() + 1 - birth.birthMonth)
  return Math.max(0, Math.floor(months / 12))
}
