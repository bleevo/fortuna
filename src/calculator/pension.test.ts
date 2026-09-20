import { currentAge } from './age'
import { describe, expect, it } from 'vitest'
import {
  assetsCutoffFromThreshold,
  assetsTestPensionAnnual,
  maxPensionAnnual,
} from './assetsTest'
import { deemedIncomeAnnual } from './deeming'
import { modelGifting } from './gifting'
import { incomeCutoffAnnual, incomeTestPensionAnnual } from './incomeTest'
import { calculatePension } from './pension'
import { calculateScenario } from './projection'
import { runToZeroDrawdown } from './runToZero'
import { estimateTax } from './tax'
import { defaultScenario } from '../defaults/scenario'

describe('assets test', () => {
  it('pays full pension at or below threshold', () => {
    const max = maxPensionAnnual(true)
    const result = assetsTestPensionAnnual(333_000, true, true)
    expect(result.pensionAnnual).toBeCloseTo(max, 0)
    expect(result.reductionAnnual).toBe(0)
  })

  it('pays nothing at the derived cut-off', () => {
    const cutoff = assetsCutoffFromThreshold(333_000, true)
    // Published single homeowner cut-off is $745,750.
    expect(cutoff).toBeGreaterThan(740_000)
    expect(cutoff).toBeLessThan(750_000)
    expect(assetsTestPensionAnnual(cutoff, true, true).pensionAnnual).toBeCloseTo(0, 0)
  })

  it('tapers at $3 per fortnight per $1000', () => {
    const max = maxPensionAnnual(true)
    const result = assetsTestPensionAnnual(433_000, true, true)
    // $100k excess => 100 * $3 * 26 = $7,800
    expect(result.reductionAnnual).toBeCloseTo(7800, 0)
    expect(result.pensionAnnual).toBeCloseTo(max - 7800, 0)
  })
})

describe('deeming & income test', () => {
  it('deems at lower then upper rates', () => {
    const income = deemedIncomeAnnual(166_800, true)
    // 66800 * 1.75% + 100000 * 3.75%
    expect(income).toBeCloseTo(66800 * 0.0175 + 100000 * 0.0375, 2)
  })

  it('reduces pension 50c per dollar above free area', () => {
    const max = maxPensionAnnual(true)
    const free = 226 * 26
    const result = incomeTestPensionAnnual(free + 10_000, true)
    expect(result.reductionAnnual).toBeCloseTo(5000, 0)
    expect(result.pensionAnnual).toBeCloseTo(max - 5000, 0)
  })
})

describe('income cut-off', () => {
  it('pays nothing at the cut-off, and moves with an indexed free area', () => {
    const cutoff = incomeCutoffAnnual(true)
    expect(incomeTestPensionAnnual(cutoff, true).pensionAnnual).toBeCloseTo(0, 0)
    const indexed = incomeCutoffAnnual(true, 6_000)
    expect(indexed).toBeGreaterThan(cutoff)
    expect(incomeTestPensionAnnual(indexed, true, 6_000).pensionAnnual).toBeCloseTo(0, 0)
  })
})

describe('pension resolver', () => {
  it('uses the lower of assets and income tests', () => {
    const atThreshold = calculatePension({
      assessableAssets: 333_000,
      exemptAssets: 800_000,
      financialAssetsForDeeming: 50_000,
      extraAssessableIncomeAnnual: 0,
      single: true,
      homeowner: true,
    })
    expect(atThreshold.bindingTest).toBe('maximum')
    expect(atThreshold.payableAnnual).toBeCloseTo(maxPensionAnnual(true), 0)

    const incomeBound = calculatePension({
      assessableAssets: 333_000,
      exemptAssets: 800_000,
      financialAssetsForDeeming: 333_000,
      extraAssessableIncomeAnnual: 0,
      single: true,
      homeowner: true,
    })
    expect(incomeBound.bindingTest).toBe('income')
    expect(incomeBound.payableAnnual).toBeLessThan(maxPensionAnnual(true))
  })
})

describe('annuity / gifting / tax / run-to-zero helpers', () => {
  it('flags excess gifting as deprived', () => {
    const result = modelGifting([15_000, 10_000, 10_000])
    expect(result.deprivedAssets).toBeGreaterThanOrEqual(5_000)
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  it('estimates modest tax with SAPTO', () => {
    const tax = estimateTax({
      privateTaxableIncome: 20_000,
      frankingCredits: 0,
      inSuper: false,
    })
    expect(tax).toBeGreaterThanOrEqual(0)
    expect(tax).toBeLessThan(5_000)
  })

  it('computes a positive run-to-zero drawdown', () => {
    const draw = runToZeroDrawdown({
      startingBalance: 200_000,
      years: 15,
      expectedGrowthPct: 3,
    })
    expect(draw).toBeGreaterThan(10_000)
    expect(draw).toBeLessThan(20_000)
  })
})

describe('scenario projection', () => {
  it('produces a timeline and summary for defaults', () => {
    const result = calculateScenario(defaultScenario)
    expect(result.timeline.length).toBe(
      defaultScenario.endAge - currentAge(defaultScenario) + 1,
    )
    expect(result.income.spendable).toBeGreaterThanOrEqual(0)
    expect(result.pension.payableAnnual).toBeGreaterThanOrEqual(0)
    expect(result.ratesAsOf.length).toBeGreaterThan(0)
  })

  it('starts with the defaults unallocated: home untouched, no pension', () => {
    const result = calculateScenario(defaultScenario)
    expect(result.portfolio.surplusToHome).toBe(0)
    expect(result.portfolio.homeValue).toBe(defaultScenario.homeValue)
    expect(result.portfolio.superValue).toBe(defaultScenario.superBalance)
    // $1.6m of assessable cash is well past the single homeowner cutoff.
    expect(result.pension.payableAnnual).toBe(0)
  })

  it('indexes the assets and income cut-offs forward year by year', () => {
    const result = calculateScenario({ ...defaultScenario, thresholdIndexationPct: 2.5 })
    const [first] = result.timeline
    const last = result.timeline[result.timeline.length - 1]

    expect(first.assetsCutoff).toBeGreaterThan(first.assetsThreshold)
    expect(first.incomeCutoff).toBeGreaterThan(first.incomeFreeArea)
    expect(last.assetsThreshold).toBeGreaterThan(first.assetsThreshold)
    expect(last.assetsCutoff).toBeGreaterThan(first.assetsCutoff)
    expect(last.incomeCutoff).toBeGreaterThan(first.incomeCutoff)
  })

  it('pays a pension once enough capital is moved into the home', () => {
    const result = calculateScenario({ ...defaultScenario, assessableTarget: 500_000 })
    expect(result.portfolio.surplusToHome).toBeGreaterThan(0)
    expect(result.pension.payableAnnual).toBeGreaterThan(0)
    expect(result.income.spendable).toBeGreaterThan(0)
  })
})
