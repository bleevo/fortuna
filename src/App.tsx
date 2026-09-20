import { useEffect, useMemo, useState } from 'react'
import { calculateScenario } from '@/calculator/projection'
import { RATES_AS_OF } from '@/calculator/rates'
import type { SourceId } from '@/calculator/sources'
import type { OptimisationMode, ScenarioInputs } from '@/calculator/types'
import { CashflowDiagram } from '@/components/CashflowDiagram'
import { NumberField } from '@/components/NumberField'
import { RatesReferencePanel } from '@/components/RatesReferencePanel'
import { Section } from '@/components/Section'
import { SourceRef } from '@/components/SourceRef'
import { SummaryCards } from '@/components/SummaryCards'
import { TimelineCharts } from '@/components/TimelineCharts'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { defaultScenario } from '@/defaults/scenario'
import { formatAUD, formatPct } from '@/lib/utils'
import {
  clearScenario,
  loadScenario,
  saveScenario,
} from '@/storage/scenarioStorage'

export default function App() {
  const [inputs, setInputs] = useState<ScenarioInputs>(() => loadScenario())
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    saveScenario(inputs)
  }, [inputs])

  const result = useMemo(() => calculateScenario(inputs), [inputs])

  function patch<K extends keyof ScenarioInputs>(
    key: K,
    value: ScenarioInputs[K],
  ) {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  function reset() {
    clearScenario()
    setInputs(structuredClone(defaultScenario))
    setConfirmReset(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 overflow-hidden rounded-[1rem] border border-[var(--color-line)] bg-[var(--color-panel)] shadow-sm">
        <div className="relative isolate px-6 py-10 sm:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,#d7efe9,transparent_55%),linear-gradient(135deg,#f7faf8,#e8f2ef)]"
          />
          <div className="relative">
            <p className="font-display text-5xl tracking-tight text-[var(--color-accent-deep)] sm:text-6xl">
              Fortuna
            </p>
            <h1 className="mt-3 max-w-3xl text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
              Australian retirement income &amp; Age Pension planner
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-[var(--color-ink-muted)]">
              Private, browser-only modelling for Age Pension, VDCO, government
              bonds, lifetime annuity, housing and drawdown choices. Rates as of{' '}
              {RATES_AS_OF}. Look for the{' '}
              <SourceRef sourceId="sa-age-pension-rates" /> chip next to
              published figures — each links to the official source.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmReset(true)}
              >
                Reset to defaults
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  document
                    .getElementById('rates-sources')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                View rates &amp; sources
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Planning tool only — not financial advice. Centrelink, tax, super and
        aged-care rules change; confirm eligibility before acting.
      </div>

      <SummaryCards
        items={[
          {
            label: 'Annual pension',
            value: result.income.pension,
            hint: `Binding test: ${result.pension.bindingTest}`,
            sourceId: 'sa-age-pension-rates',
          },
          {
            label: 'Spendable / year',
            value: result.income.spendable,
            hint: `${formatAUD(result.income.monthlySpendable)} / month`,
          },
          {
            label: 'Assessable assets',
            value: result.pension.assessableAssets,
            hint: `Exempt ${formatAUD(result.pension.exemptAssets)}`,
            sourceId: 'sa-assets-test',
          },
          {
            label: 'Liquid at end age',
            value: result.timeline.at(-1)?.liquidCapital ?? 0,
            hint: `Age ${inputs.endAge}`,
          },
        ]}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)]">
        <div className="space-y-6">
          <Section
            title="Person & horizon"
            description="Starter scenario: single homeowner, age 80 to 95."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                id="age"
                label="Current age"
                value={inputs.age}
                min={65}
                max={100}
                onChange={(v) => patch('age', v)}
              />
              <NumberField
                id="endAge"
                label="Planning end age"
                value={inputs.endAge}
                min={inputs.age + 1}
                max={110}
                onChange={(v) => patch('endAge', v)}
              />
              <Toggle
                label="Single"
                checked={inputs.single}
                onChange={(v) => patch('single', v)}
              />
              <Toggle
                label="Homeowner"
                checked={inputs.homeowner}
                onChange={(v) => patch('homeowner', v)}
              />
            </div>
          </Section>

          <Section title="Capital & home">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                id="startingCash"
                label="Starting liquid cash"
                value={inputs.startingCash}
                step={1000}
                onChange={(v) => patch('startingCash', v)}
              />
              <NumberField
                id="assessableTarget"
                label="Assessable investment target"
                value={inputs.assessableTarget}
                step={1000}
                onChange={(v) => patch('assessableTarget', v)}
                help="Surplus above this is modelled into the principal home."
              />
              <NumberField
                id="homeValue"
                label="Home value"
                value={inputs.homeValue}
                step={1000}
                onChange={(v) => patch('homeValue', v)}
              />
              <NumberField
                id="homeGrowthPct"
                label="Home growth"
                value={inputs.homeGrowthPct}
                step={0.1}
                suffix="%"
                onChange={(v) => patch('homeGrowthPct', v)}
              />
              <NumberField
                id="setupExpenses"
                label="One-off setup / moving costs"
                value={inputs.setupExpenses}
                step={500}
                onChange={(v) => patch('setupExpenses', v)}
              />
              <NumberField
                id="prepaidFuneral"
                label="Prepaid funeral"
                value={inputs.prepaidFuneral}
                step={500}
                onChange={(v) => patch('prepaidFuneral', v)}
              />
              <NumberField
                id="cemeteryPlot"
                label="Cemetery plot"
                value={inputs.cemeteryPlot}
                step={500}
                onChange={(v) => patch('cemeteryPlot', v)}
              />
              <NumberField
                id="superBalance"
                label="Super balance"
                value={inputs.superBalance}
                step={1000}
                onChange={(v) => patch('superBalance', v)}
              />
            </div>
          </Section>

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

          <Section
            title="Spending, gifting & modes"
            description={
              <>
                Gifting above Centrelink limits remains assessable as a deprived
                asset for five years.{' '}
                <SourceRef sourceId="sa-gifting" />
              </>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                id="annualSpendingTarget"
                label="Annual spending target"
                value={inputs.annualSpendingTarget}
                step={500}
                onChange={(v) => patch('annualSpendingTarget', v)}
              />
              <NumberField
                id="cashReserveMonths"
                label="Cash reserve"
                value={inputs.cashReserveMonths}
                step={1}
                suffix="months"
                onChange={(v) => patch('cashReserveMonths', v)}
              />
              <NumberField
                id="creditCardLimit"
                label="Credit card limit"
                value={inputs.creditCardLimit}
                step={100}
                onChange={(v) => patch('creditCardLimit', v)}
              />
              <NumberField
                id="thresholdIndexationPct"
                label="Inflation / threshold indexation"
                value={inputs.thresholdIndexationPct}
                step={0.1}
                suffix="%"
                onChange={(v) => {
                  patch('thresholdIndexationPct', v)
                  patch('inflationPct', v)
                }}
              />
              <NumberField
                id="gift0"
                label="Gift year 1"
                value={inputs.giftingYears[0] ?? 0}
                step={500}
                onChange={(v) =>
                  setInputs((prev) => ({
                    ...prev,
                    giftingYears: [
                      v,
                      prev.giftingYears[1] ?? 0,
                      prev.giftingYears[2] ?? 0,
                    ],
                  }))
                }
              />
              <NumberField
                id="gift1"
                label="Gift year 2"
                value={inputs.giftingYears[1] ?? 0}
                step={500}
                onChange={(v) =>
                  setInputs((prev) => ({
                    ...prev,
                    giftingYears: [
                      prev.giftingYears[0] ?? 0,
                      v,
                      prev.giftingYears[2] ?? 0,
                    ],
                  }))
                }
              />
            </div>

            <div className="mt-4">
              <Label>Optimisation mode</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    ['balanced', 'Balanced'],
                    ['income', 'Maximise income'],
                    ['pension', 'Maximise pension'],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant={inputs.mode === value ? 'primary' : 'secondary'}
                    onClick={() => patch('mode', value as OptimisationMode)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Toggle
                label="Run assessable investments to zero by end age"
                checked={inputs.runToZero}
                onChange={(v) => patch('runToZero', v)}
              />
              <Toggle
                label="Model aged care phase"
                checked={inputs.agedCareEnabled}
                onChange={(v) => patch('agedCareEnabled', v)}
              />
            </div>

            {inputs.agedCareEnabled ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="agedCareStartAge"
                  label="Aged care start age"
                  value={inputs.agedCareStartAge}
                  onChange={(v) => patch('agedCareStartAge', v)}
                />
                <Toggle
                  label="Home sold in aged care"
                  checked={inputs.agedCareHomeSold}
                  onChange={(v) => patch('agedCareHomeSold', v)}
                />
                <Toggle
                  label="Protected person remains in home"
                  checked={inputs.protectedPersonInHome}
                  onChange={(v) => patch('protectedPersonInHome', v)}
                />
                <NumberField
                  id="agedCareAccommodationAnnual"
                  label="Accommodation costs / year"
                  value={inputs.agedCareAccommodationAnnual}
                  step={1000}
                  onChange={(v) => patch('agedCareAccommodationAnnual', v)}
                />
              </div>
            ) : null}
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Pension detail">
            <dl className="grid gap-3 sm:grid-cols-2">
              <Stat
                label="Maximum pension"
                value={result.pension.maxAnnual}
                sourceId="sa-age-pension-rates"
              />
              <Stat
                label="After assets test"
                value={result.pension.assetsTestAnnual}
                sourceId="sa-assets-test"
              />
              <Stat
                label="After income test"
                value={result.pension.incomeTestAnnual}
                sourceId="sa-income-test"
              />
              <Stat
                label="Deemed income"
                value={result.pension.deemedIncomeAnnual}
                sourceId="sa-deeming"
              />
              <Stat
                label="Assets reduction"
                value={result.pension.assetsReductionAnnual}
                sourceId="sa-assets-test"
              />
              <Stat
                label="Income reduction"
                value={result.pension.incomeReductionAnnual}
                sourceId="sa-income-test"
              />
            </dl>
          </Section>

          <Section title="Portfolio snapshot">
            <dl className="grid gap-3 sm:grid-cols-2">
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
              <Stat
                label="Surplus to home"
                value={result.portfolio.surplusToHome}
              />
              <Stat
                label="Prepaid exempt"
                value={result.portfolio.prepaidExempt}
              />
            </dl>
            <div className="mt-4 rounded-md bg-[var(--color-paper-deep)] p-3 text-sm">
              Growth sleeve: need about{' '}
              {formatPct(result.growthSleeve.requiredGrowthReturnPct)} on the
              growth portion to track thresholds; expected portfolio growth{' '}
              {formatPct(result.growthSleeve.expectedPortfolioGrowthPct)} (gap{' '}
              {formatPct(result.growthSleeve.gapPct)}).
            </div>
          </Section>

          <CashflowDiagram result={result} />
          <TimelineCharts timeline={result.timeline} />

          <Section title="Year-by-year">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-line)] text-[var(--color-ink-muted)]">
                    <th className="py-2 pr-3">Age</th>
                    <th className="py-2 pr-3">Pension</th>
                    <th className="py-2 pr-3">Spendable</th>
                    <th className="py-2 pr-3">Assessable</th>
                    <th className="py-2 pr-3">Liquid</th>
                    <th className="py-2">Test</th>
                  </tr>
                </thead>
                <tbody>
                  {result.timeline.map((row) => (
                    <tr
                      key={row.age}
                      className="border-b border-[var(--color-line)]/70"
                    >
                      <td className="py-2 pr-3 font-medium">{row.age}</td>
                      <td className="py-2 pr-3">{formatAUD(row.pension)}</td>
                      <td className="py-2 pr-3">{formatAUD(row.spendable)}</td>
                      <td className="py-2 pr-3">
                        {formatAUD(row.assessableAssets)}
                      </td>
                      <td className="py-2 pr-3">
                        {formatAUD(row.liquidCapital)}
                      </td>
                      <td className="py-2 capitalize">{row.bindingTest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {result.warnings.length > 0 ? (
            <Card className="border-amber-300 bg-amber-50">
              <h3 className="font-display text-xl">Notes</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {result.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      </div>

      <div id="rates-sources" className="mt-8 scroll-mt-6">
        <RatesReferencePanel />
      </div>

      {confirmReset ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="max-w-md space-y-4">
            <h3 className="font-display text-2xl">Reset to defaults?</h3>
            <p className="text-[var(--color-ink-muted)]">
              This clears saved local scenario data and restores the starter
              assumptions.
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="danger" onClick={reset}>
                Reset
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      <footer className="mt-10 border-t border-[var(--color-line)] pt-6 text-sm text-[var(--color-ink-muted)]">
        Fortuna stores scenarios only in this browser. Built for Cloudflare Pages
        static hosting. Rates as of {result.ratesAsOf}. Official figures are
        linked via the <SourceRef sourceId="sa-age-pension-rates" variant="inline" />{' '}
        chips above.
      </footer>
    </div>
  )
}

function Stat({
  label,
  value,
  sourceId,
}: {
  label: string
  value: number
  sourceId?: SourceId
}) {
  return (
    <div className="rounded-md border border-[var(--color-line)] bg-white px-3 py-2">
      <dt className="flex items-start justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        <span>{label}</span>
        {sourceId ? <SourceRef sourceId={sourceId} /> : null}
      </dt>
      <dd className="mt-1 text-lg font-semibold">{formatAUD(value)}</dd>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-md border border-[var(--color-line)] bg-white px-3 py-3">
      <input
        type="checkbox"
        className="size-5 accent-[var(--color-accent)]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="font-medium">{label}</span>
    </label>
  )
}
