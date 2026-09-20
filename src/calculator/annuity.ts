export function annuityAnnualPayment(purchaseAmount: number, payoutPer100k: number): number {
  return (purchaseAmount / 100_000) * payoutPer100k
}

export function annuityThresholdAge(purchaseAge: number): number {
  return Math.max(85, purchaseAge + 5)
}

export function annuityAssessableAsset(
  purchaseAmount: number,
  currentAge: number,
  purchaseAge: number,
  startPct: number,
  afterPct: number,
): number {
  const thresholdAge = annuityThresholdAge(purchaseAge)
  const pct = currentAge >= thresholdAge ? afterPct : startPct
  return purchaseAmount * (pct / 100)
}

export function annuityAssessableIncome(annualPayment: number, assessableIncomePct: number): number {
  return annualPayment * (assessableIncomePct / 100)
}
