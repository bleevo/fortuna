import {
  MEDICARE_LEVY_RATE,
  MEDICARE_LOW_SINGLE,
  SAPTO_SHADE_IN_START,
  SAPTO_SHADE_RATE,
  SAPTO_SINGLE_MAX,
  TAX_BRACKETS,
} from './rates'

export function incomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  let lower = 0
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.upTo) {
      return bracket.base + (taxableIncome - lower) * bracket.rate
    }
    lower = bracket.upTo
  }
  return 0
}

export function saptoOffset(taxableIncome: number): number {
  if (taxableIncome <= SAPTO_SHADE_IN_START) return SAPTO_SINGLE_MAX
  const reduction = (taxableIncome - SAPTO_SHADE_IN_START) * SAPTO_SHADE_RATE
  return Math.max(0, SAPTO_SINGLE_MAX - reduction)
}

export function medicareLevy(taxableIncome: number): number {
  if (taxableIncome <= MEDICARE_LOW_SINGLE) return 0
  return taxableIncome * MEDICARE_LEVY_RATE
}

export function estimateTax(args: {
  privateTaxableIncome: number
  frankingCredits: number
  inSuper: boolean
}): number {
  if (args.inSuper) return 0
  const raw = incomeTax(args.privateTaxableIncome)
  const offset = saptoOffset(args.privateTaxableIncome)
  const levy = medicareLevy(args.privateTaxableIncome)
  return Math.max(0, raw - offset + levy - args.frankingCredits)
}
