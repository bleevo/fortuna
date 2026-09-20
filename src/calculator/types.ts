export type OptimisationMode = 'income' | 'pension' | 'balanced'

export type PrepaidItem = {
  id: string
  description: string
  amount: number
  yearsPrepaid: number
  treatedAsExempt: boolean
}

export type BondInputs = {
  faceValue: number
  purchasePrice: number
  couponRatePct: number
  yieldToMaturityPct: number
  yearsToMaturity: number
  sellBeforeMaturity: boolean
  salePrice: number
}

export type ScenarioInputs = {
  schemaVersion: number
  age: number
  endAge: number
  single: boolean
  homeowner: boolean
  startingCash: number
  homeValue: number
  homePurchasePrice: number
  homeTransactionCosts: number
  homeRenovations: number
  homeGrowthPct: number
  homeSaleAge: number | null
  setupExpenses: number
  prepaidFuneral: number
  cemeteryPlot: number
  prepaidItems: PrepaidItem[]
  /** Gift amounts for the first few financial years. */
  giftingYears: number[]
  assessableTarget: number
  /** 0–100 of investable retirement capital. */
  annuityAllocationPct: number
  /** Of the non-annuity remainder. */
  vdcoOfRemainderPct: number
  bondOfRemainderPct: number
  cashReserveMonths: number
  annualSpendingTarget: number
  creditCardLimit: number
  irregularExpenseAllowance: number
  inflationPct: number
  thresholdIndexationPct: number
  vdcoYieldPct: number
  vdcoGrowthPct: number
  vdcoFeePct: number
  bond: BondInputs
  annuityPayoutPer100k: number
  annuityAssessableAssetStartPct: number
  annuityAssessableAssetAfterPct: number
  annuityAssessableIncomePct: number
  runToZero: boolean
  agedCareEnabled: boolean
  agedCareStartAge: number
  agedCareHomeSold: boolean
  protectedPersonInHome: boolean
  agedCareAccommodationAnnual: number
  agedCareMeansTestedAnnual: number
  superBalance: number
  downsizerContribution: number
  frankingPct: number
  mode: OptimisationMode
}

export type PensionBreakdown = {
  maxAnnual: number
  assetsTestAnnual: number
  incomeTestAnnual: number
  assetsReductionAnnual: number
  incomeReductionAnnual: number
  bindingTest: 'assets' | 'income' | 'maximum'
  payableAnnual: number
  payableFortnightly: number
  deemedIncomeAnnual: number
  assessableAssets: number
  exemptAssets: number
  assessableIncomeAnnual: number
  /** Assets you can hold and still draw the full pension. */
  assetsThreshold: number
  /** Assets at which the assets test pays nothing. */
  assetsCutoff: number
  /** Annual assessable income you can have and still draw the full pension. */
  incomeFreeAreaAnnual: number
  /** Annual assessable income at which the income test pays nothing. */
  incomeCutoffAnnual: number
}

export type PortfolioSnapshot = {
  assessableInvestments: number
  vdcoValue: number
  bondMarketValue: number
  annuityPurchase: number
  annuityAssessableAsset: number
  cashReserve: number
  superValue: number
  homeValue: number
  prepaidExempt: number
  giftedDeprived: number
  surplusToHome: number
  liquidAfterSetup: number
}

export type IncomeSnapshot = {
  pension: number
  vdcoDistributions: number
  bondCoupons: number
  annuityPayment: number
  annuityAssessableIncome: number
  capitalDrawdown: number
  grossPrivateIncome: number
  tax: number
  spendable: number
  monthlySpendable: number
  weeklySpendable: number
}

export type YearRow = {
  age: number
  yearIndex: number
  /** Full-pension assets threshold, indexed to this year. */
  assetsThreshold: number
  /** Assets cut-off, indexed to this year. */
  assetsCutoff: number
  /** Full-pension income free area for the year, indexed and annualised. */
  incomeFreeArea: number
  /** Income cut-off for the year, indexed and annualised. */
  incomeCutoff: number
  assessableAssets: number
  exemptAssets: number
  deemedIncome: number
  assessableIncome: number
  pension: number
  vdcoDistributions: number
  bondCoupons: number
  annuityIncome: number
  capitalDrawdown: number
  tax: number
  spendable: number
  liquidCapital: number
  homeValue: number
  bindingTest: PensionBreakdown['bindingTest']
}

export type GrowthSleeveInsight = {
  requiredGrowthReturnPct: number
  expectedPortfolioGrowthPct: number
  gapPct: number
}

export type BankingInsight = {
  averageMonthlyIncome: number
  averageWeeklyIncome: number
  cardUtilisationPct: number
  reserveBufferMonths: number
  projectedReserve: number
}

export type CalculationResult = {
  portfolio: PortfolioSnapshot
  pension: PensionBreakdown
  income: IncomeSnapshot
  growthSleeve: GrowthSleeveInsight
  banking: BankingInsight
  timeline: YearRow[]
  warnings: string[]
  ratesAsOf: string
}
