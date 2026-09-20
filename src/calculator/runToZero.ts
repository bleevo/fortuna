export function runToZeroDrawdown(args: {
  startingBalance: number
  years: number
  expectedGrowthPct: number
}): number {
  const { startingBalance, years, expectedGrowthPct } = args
  if (years <= 0 || startingBalance <= 0) return 0
  const r = expectedGrowthPct / 100
  if (Math.abs(r) < 1e-9) return startingBalance / years
  return (startingBalance * r) / (1 - (1 + r) ** -years)
}
