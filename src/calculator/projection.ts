import {
  agedCareActive,
  agedCareCostsAnnual,
  homeAssessableInAgedCare,
} from './agedCare'
import {
  annuityAnnualPayment,
  annuityAssessableAsset,
  annuityAssessableIncome,
} from './annuity'
import { assetsFullThreshold, indexThreshold } from './assetsTest'
import { modelGifting } from './gifting'
import { applyModeAdjustments, money } from './helpers'
import { calculatePension } from './pension'
import { RATES_AS_OF } from './rates'
import { runToZeroDrawdown } from './runToZero'
import { estimateTax } from './tax'
import type {
  CalculationResult,
  IncomeSnapshot,
  PortfolioSnapshot,
  ScenarioInputs,
  YearRow,
} from './types'

function prepaidExemptTotal(inputs: ScenarioInputs): number {
  const items = inputs.prepaidItems
    .filter((p) => p.treatedAsExempt)
    .reduce((sum, p) => sum + p.amount, 0)
  return inputs.prepaidFuneral + inputs.cemeteryPlot + items
}

function bondCoupons(bondAllocation: number, inputs: ScenarioInputs): number {
  if (bondAllocation <= 0) return 0
  const face =
    inputs.bond.purchasePrice > 0
      ? bondAllocation * (inputs.bond.faceValue / inputs.bond.purchasePrice)
      : bondAllocation
  return face * (inputs.bond.couponRatePct / 100)
}

export function calculateScenario(raw: ScenarioInputs): CalculationResult {
  const inputs = applyModeAdjustments(raw)
  const warnings: string[] = []

  const gifting = modelGifting(inputs.giftingYears)
  warnings.push(...gifting.warnings)

  const prepaidExempt = prepaidExemptTotal(inputs)
  const nonExemptPrepaid = inputs.prepaidItems
    .filter((p) => !p.treatedAsExempt)
    .reduce((s, p) => s + p.amount, 0)
  const setupDrain = inputs.setupExpenses + prepaidExempt + nonExemptPrepaid

  const liquidAfterSetup = Math.max(0, inputs.startingCash - setupDrain)
  const spendProxy = Math.max(inputs.annualSpendingTarget, 1)
  const cashReserveTarget = Math.min(
    liquidAfterSetup,
    (inputs.cashReserveMonths / 12) * spendProxy,
  )

  const available = Math.max(0, liquidAfterSetup - cashReserveTarget)
  const assessableTarget = Math.min(inputs.assessableTarget, available)
  const surplusToHome = Math.max(0, available - assessableTarget)

  const annuityPurchase = assessableTarget * (inputs.annuityAllocationPct / 100)
  const remainder = Math.max(0, assessableTarget - annuityPurchase)

  let vdcoPct = inputs.vdcoOfRemainderPct
  let bondPct = inputs.bondOfRemainderPct
  const sleeveTotal = vdcoPct + bondPct
  if (sleeveTotal > 100) {
    warnings.push('VDCO + bond remainder allocations exceed 100%; scaled down.')
    vdcoPct = (vdcoPct / sleeveTotal) * 100
    bondPct = (bondPct / sleeveTotal) * 100
  }
  const cashSleevePct = Math.max(0, 100 - vdcoPct - bondPct)

  const initialVdco = remainder * (vdcoPct / 100)
  const initialBond = remainder * (bondPct / 100)
  const initialCash = cashReserveTarget + remainder * (cashSleevePct / 100)
  const initialHome =
    inputs.homeValue +
    surplusToHome +
    inputs.homeRenovations +
    inputs.homeTransactionCosts
  const initialSuper = inputs.superBalance + inputs.downsizerContribution

  const portfolio: PortfolioSnapshot = {
    assessableInvestments: money(assessableTarget),
    vdcoValue: money(initialVdco),
    bondMarketValue: money(initialBond),
    annuityPurchase: money(annuityPurchase),
    annuityAssessableAsset: money(
      annuityAssessableAsset(
        annuityPurchase,
        inputs.age,
        inputs.age,
        inputs.annuityAssessableAssetStartPct,
        inputs.annuityAssessableAssetAfterPct,
      ),
    ),
    cashReserve: money(initialCash),
    superValue: money(initialSuper),
    homeValue: money(initialHome),
    prepaidExempt: money(prepaidExempt),
    giftedDeprived: money(gifting.deprivedAssets),
    surplusToHome: money(surplusToHome),
    liquidAfterSetup: money(liquidAfterSetup),
  }

  let vdcoValue = initialVdco
  let bondValue = initialBond
  let cash = initialCash
  let home = initialHome
  const superValue = initialSuper

  const netVdcoGrowth = inputs.vdcoGrowthPct - inputs.vdcoFeePct
  const years = Math.max(0, inputs.endAge - inputs.age)
  const nonAnnuity = initialVdco + initialBond
  const expectedGrowthPct =
    nonAnnuity > 0 ? (initialVdco * netVdcoGrowth) / nonAnnuity : 0
  const growthWeight = nonAnnuity > 0 ? (initialVdco / nonAnnuity) * 0.3 : 0
  const requiredGrowthReturnPct =
    growthWeight > 0
      ? inputs.thresholdIndexationPct / growthWeight
      : inputs.thresholdIndexationPct

  const baseDrawdown = inputs.runToZero
    ? runToZeroDrawdown({
        startingBalance: nonAnnuity,
        years: Math.max(years, 1),
        expectedGrowthPct,
      })
    : 0

  const timeline: YearRow[] = []
  let year0Income: IncomeSnapshot | null = null
  let year0Pension = calculatePension({
    assessableAssets: assessableTarget + gifting.deprivedAssets,
    exemptAssets: prepaidExempt + (inputs.homeowner ? initialHome : 0),
    financialAssetsForDeeming: assessableTarget,
    extraAssessableIncomeAnnual: 0,
    single: inputs.single,
    homeowner: inputs.homeowner,
  })

  for (let i = 0; i <= years; i++) {
    const age = inputs.age + i
    const inAgedCare = agedCareActive(inputs, age)

    if (inputs.homeSaleAge != null && age === inputs.homeSaleAge && home > 0) {
      cash += home
      home = 0
      warnings.push(`Age ${age}: principal home sold; proceeds added to cash.`)
    }

    if (i > 0) {
      home *= 1 + inputs.homeGrowthPct / 100
      vdcoValue *= 1 + netVdcoGrowth / 100
    }

    const annuityPayment = annuityAnnualPayment(
      annuityPurchase,
      inputs.annuityPayoutPer100k,
    )
    const annuityAsset = annuityAssessableAsset(
      annuityPurchase,
      age,
      inputs.age,
      inputs.annuityAssessableAssetStartPct,
      inputs.annuityAssessableAssetAfterPct,
    )
    const annuityIncomeAssessable = annuityAssessableIncome(
      annuityPayment,
      inputs.annuityAssessableIncomePct,
    )

    const vdcoDistributions = vdcoValue * (inputs.vdcoYieldPct / 100)
    const coupons = bondCoupons(bondValue, inputs)

    const liquidInvestments = vdcoValue + bondValue + cash + superValue
    let assessable = liquidInvestments + annuityAsset + gifting.deprivedAssets
    let exempt = prepaidExempt

    if (home > 0) {
      if (inputs.homeowner && !(inAgedCare && homeAssessableInAgedCare(inputs))) {
        exempt += home
      } else {
        assessable += home
      }
    }

    const threshold = indexThreshold(
      assetsFullThreshold(inputs.single, inputs.homeowner),
      inputs.thresholdIndexationPct,
      i,
    )

    const pension = calculatePension({
      assessableAssets: assessable,
      exemptAssets: exempt,
      financialAssetsForDeeming: liquidInvestments + annuityAsset,
      extraAssessableIncomeAnnual: annuityIncomeAssessable,
      single: inputs.single,
      homeowner:
        inputs.homeowner && !(inAgedCare && homeAssessableInAgedCare(inputs)),
      assetsThresholdOverride: threshold,
    })

    let remainingDraw = Math.min(baseDrawdown, vdcoValue + bondValue)
    const fromVdco = Math.min(vdcoValue, remainingDraw)
    vdcoValue -= fromVdco
    remainingDraw -= fromVdco
    const fromBond = Math.min(bondValue, remainingDraw)
    bondValue -= fromBond
    const capitalDrawdown = fromVdco + fromBond

    const grossPrivate =
      vdcoDistributions + coupons + annuityPayment + capitalDrawdown
    const frankingCredits =
      vdcoDistributions * 0.25 * (inputs.frankingPct / 100)
    const tax = estimateTax({
      privateTaxableIncome: Math.max(0, vdcoDistributions + coupons),
      frankingCredits,
      inSuper: false,
    })

    const careCosts = inAgedCare ? agedCareCostsAnnual(inputs) : 0
    const spendable = pension.payableAnnual + grossPrivate - tax - careCosts

    cash +=
      pension.payableAnnual +
      vdcoDistributions +
      coupons +
      annuityPayment +
      capitalDrawdown -
      tax -
      careCosts -
      inputs.annualSpendingTarget
    cash = Math.max(0, cash)

    const row: YearRow = {
      age,
      yearIndex: i,
      assetsThreshold: money(threshold),
      assessableAssets: money(assessable),
      exemptAssets: money(exempt),
      deemedIncome: money(pension.deemedIncomeAnnual),
      pension: money(pension.payableAnnual),
      vdcoDistributions: money(vdcoDistributions),
      bondCoupons: money(coupons),
      annuityIncome: money(annuityPayment),
      capitalDrawdown: money(capitalDrawdown),
      tax: money(tax),
      spendable: money(spendable),
      liquidCapital: money(vdcoValue + bondValue + cash + superValue),
      homeValue: money(home),
      bindingTest: pension.bindingTest,
    }
    timeline.push(row)

    if (i === 0) {
      year0Pension = pension
      year0Income = {
        pension: money(pension.payableAnnual),
        vdcoDistributions: money(vdcoDistributions),
        bondCoupons: money(coupons),
        annuityPayment: money(annuityPayment),
        annuityAssessableIncome: money(annuityIncomeAssessable),
        capitalDrawdown: money(capitalDrawdown),
        grossPrivateIncome: money(grossPrivate),
        tax: money(tax),
        spendable: money(spendable),
        monthlySpendable: money(spendable / 12),
        weeklySpendable: money(spendable / 52),
      }
    }
  }

  const income = year0Income!
  const cardUtilisationPct =
    inputs.creditCardLimit > 0
      ? Math.min(100, (income.monthlySpendable / inputs.creditCardLimit) * 100)
      : 0

  return {
    portfolio,
    pension: year0Pension,
    income,
    growthSleeve: {
      requiredGrowthReturnPct: money(requiredGrowthReturnPct),
      expectedPortfolioGrowthPct: money(expectedGrowthPct),
      gapPct: money(expectedGrowthPct - inputs.thresholdIndexationPct),
    },
    banking: {
      averageMonthlyIncome: income.monthlySpendable,
      averageWeeklyIncome: income.weeklySpendable,
      cardUtilisationPct: money(cardUtilisationPct),
      reserveBufferMonths: inputs.cashReserveMonths,
      projectedReserve: portfolio.cashReserve,
    },
    timeline,
    warnings,
    ratesAsOf: RATES_AS_OF,
  }
}
