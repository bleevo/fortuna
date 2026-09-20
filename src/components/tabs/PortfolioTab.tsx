import type { CalculationResult, ScenarioInputs } from '@/calculator/types'
import { NumberField } from '@/components/NumberField'
import { Section } from '@/components/Section'
import { Stat } from '@/components/Stat'
import type { PatchInput, SetInputs } from '@/components/tabs/types'
import { formatPct } from '@/lib/utils'

export function PortfolioTab({
  inputs,
  patch,
  setInputs,
  result,
}: {
  inputs: ScenarioInputs
  patch: PatchInput
  setInputs: SetInputs
  result: CalculationResult
}) {
  return (
    <>
      <Section
        title="Portfolio mix"
        description="Annuity first, then split the remainder between VDCO and bonds."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="annuityAllocationPct"
            label="Annuity allocation"
            value={inputs.annuityAllocationPct}
            min={0}
            max={100}
            suffix="%"
            onChange={(v) => patch('annuityAllocationPct', v)}
          />
          <NumberField
            id="annuityPayoutPer100k"
            label="Annuity payout / $100k"
            value={inputs.annuityPayoutPer100k}
            step={10}
            onChange={(v) => patch('annuityPayoutPer100k', v)}
          />
          <NumberField
            id="vdcoOfRemainderPct"
            label="VDCO of remainder"
            value={inputs.vdcoOfRemainderPct}
            min={0}
            max={100}
            suffix="%"
            onChange={(v) => patch('vdcoOfRemainderPct', v)}
          />
          <NumberField
            id="bondOfRemainderPct"
            label="Bonds of remainder"
            value={inputs.bondOfRemainderPct}
            min={0}
            max={100}
            suffix="%"
            onChange={(v) => patch('bondOfRemainderPct', v)}
          />
          <NumberField
            id="vdcoYieldPct"
            label="VDCO distribution yield"
            value={inputs.vdcoYieldPct}
            step={0.1}
            suffix="%"
            onChange={(v) => patch('vdcoYieldPct', v)}
          />
          <NumberField
            id="vdcoGrowthPct"
            label="VDCO capital growth"
            value={inputs.vdcoGrowthPct}
            step={0.1}
            suffix="%"
            onChange={(v) => patch('vdcoGrowthPct', v)}
          />
          <NumberField
            id="bondCoupon"
            label="Bond coupon rate"
            value={inputs.bond.couponRatePct}
            step={0.1}
            suffix="%"
            onChange={(v) =>
              setInputs((prev) => ({
                ...prev,
                bond: { ...prev.bond, couponRatePct: v },
              }))
            }
          />
          <NumberField
            id="bondYtm"
            label="Bond yield to maturity"
            value={inputs.bond.yieldToMaturityPct}
            step={0.1}
            suffix="%"
            onChange={(v) =>
              setInputs((prev) => ({
                ...prev,
                bond: { ...prev.bond, yieldToMaturityPct: v },
              }))
            }
          />
        </div>
      </Section>

      <Section title="Portfolio snapshot">
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="VDCO" value={result.portfolio.vdcoValue} />
          <Stat label="Bonds" value={result.portfolio.bondMarketValue} />
          <Stat
            label="Annuity purchase"
            value={result.portfolio.annuityPurchase}
          />
          <Stat
            label="Annuity assessable asset"
            value={result.portfolio.annuityAssessableAsset}
          />
          <Stat label="Cash reserve" value={result.portfolio.cashReserve} />
          <Stat label="Home" value={result.portfolio.homeValue} />
          <Stat label="Surplus to home" value={result.portfolio.surplusToHome} />
          <Stat label="Prepaid exempt" value={result.portfolio.prepaidExempt} />
        </dl>
        <div className="mt-4 rounded-md bg-[var(--color-paper-deep)] p-3 text-sm">
          Growth sleeve: need about{' '}
          {formatPct(result.growthSleeve.requiredGrowthReturnPct)} on the growth
          portion to track thresholds; expected portfolio growth{' '}
          {formatPct(result.growthSleeve.expectedPortfolioGrowthPct)} (gap{' '}
          {formatPct(result.growthSleeve.gapPct)}).
        </div>
      </Section>
    </>
  )
}
