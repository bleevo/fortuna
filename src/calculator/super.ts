import { DOWNSIZER_MAX_PER_PERSON } from './rates'

export function applyDownsizer(args: {
  saleProceeds: number
  contribution: number
  maxPerPerson?: number
}): { contributed: number; residualCash: number } {
  const max = args.maxPerPerson ?? DOWNSIZER_MAX_PER_PERSON
  const contributed = Math.min(args.contribution, max, Math.max(0, args.saleProceeds))
  return {
    contributed,
    residualCash: Math.max(0, args.saleProceeds - contributed),
  }
}
