import { GIFTING_ANNUAL_LIMIT, GIFTING_FIVE_YEAR_LIMIT } from './rates'

export type GiftingResult = {
  annualAmounts: number[]
  rollingFiveYearTotal: number
  deprivedAssets: number
  warnings: string[]
}

export function modelGifting(annualGifts: number[]): GiftingResult {
  const warnings: string[] = []
  let deprived = 0

  annualGifts.forEach((gift, i) => {
    const yearExcess = Math.max(0, gift - GIFTING_ANNUAL_LIMIT)
    if (yearExcess > 0) {
      deprived += yearExcess
      warnings.push(
        `Year ${i + 1}: gift of $${gift.toLocaleString()} exceeds $${GIFTING_ANNUAL_LIMIT.toLocaleString()} annual limit.`,
      )
    }
  })

  const window = annualGifts.slice(0, 5)
  const rolling = window.reduce((a, b) => a + b, 0)
  if (rolling > GIFTING_FIVE_YEAR_LIMIT) {
    const excess = rolling - GIFTING_FIVE_YEAR_LIMIT
    const alreadyCounted = annualGifts
      .slice(0, 5)
      .reduce((a, g) => a + Math.max(0, g - GIFTING_ANNUAL_LIMIT), 0)
    deprived += Math.max(0, excess - alreadyCounted)
    warnings.push(
      `Five-year gifting total $${rolling.toLocaleString()} exceeds $${GIFTING_FIVE_YEAR_LIMIT.toLocaleString()} limit.`,
    )
  }

  return {
    annualAmounts: annualGifts,
    rollingFiveYearTotal: rolling,
    deprivedAssets: deprived,
    warnings,
  }
}
