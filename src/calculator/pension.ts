import { FORTNIGHTS_PER_YEAR } from './rates'
import { assetsTestPensionAnnual, maxPensionAnnual } from './assetsTest'
import { incomeTestPensionAnnual } from './incomeTest'
import { deemedIncomeAnnual } from './deeming'
import type { PensionBreakdown } from './types'

export function calculatePension(args: {
  assessableAssets: number
  exemptAssets: number
  financialAssetsForDeeming: number
  extraAssessableIncomeAnnual: number
  single: boolean
  homeowner: boolean
  assetsThresholdOverride?: number
}): PensionBreakdown {
  const maxAnnual = maxPensionAnnual(args.single)
  const deemed = deemedIncomeAnnual(args.financialAssetsForDeeming, args.single)
  const assessableIncome = deemed + args.extraAssessableIncomeAnnual

  const assets = assetsTestPensionAnnual(
    args.assessableAssets,
    args.single,
    args.homeowner,
    args.assetsThresholdOverride,
  )
  const income = incomeTestPensionAnnual(assessableIncome, args.single)
  const payableAnnual = Math.min(assets.pensionAnnual, income.pensionAnnual)

  let bindingTest: PensionBreakdown['bindingTest'] = 'maximum'
  if (assets.pensionAnnual < income.pensionAnnual) bindingTest = 'assets'
  else if (income.pensionAnnual < assets.pensionAnnual) bindingTest = 'income'
  else if (assets.reductionAnnual > 0 || income.reductionAnnual > 0) bindingTest = 'assets'

  return {
    maxAnnual,
    assetsTestAnnual: assets.pensionAnnual,
    incomeTestAnnual: income.pensionAnnual,
    assetsReductionAnnual: assets.reductionAnnual,
    incomeReductionAnnual: income.reductionAnnual,
    bindingTest,
    payableAnnual,
    payableFortnightly: payableAnnual / FORTNIGHTS_PER_YEAR,
    deemedIncomeAnnual: deemed,
    assessableAssets: args.assessableAssets,
    exemptAssets: args.exemptAssets,
  }
}
