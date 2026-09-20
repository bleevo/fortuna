import type { CalculationResult } from '@/calculator/types'
import { Card } from '@/components/ui/card'
import { formatAUD, formatPct } from '@/lib/utils'

export function CashflowDiagram({ result }: { result: CalculationResult }) {
  const monthly = result.income.monthlySpendable
  const pension = result.income.pension / 12
  const investments =
    (result.income.vdcoDistributions + result.income.bondCoupons) / 12
  const annuity = result.income.annuityPayment / 12

  return (
    <Card>
      <h3 className="font-display text-xl">Banking flow</h3>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Simple monthly picture of income into the reserve account.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        <FlowBox
          title="Inflows"
          lines={[
            `Pension ${formatAUD(pension)}`,
            `Investments ${formatAUD(investments)}`,
            `Annuity ${formatAUD(annuity)}`,
          ]}
        />
        <div className="hidden text-center text-2xl text-[var(--color-accent)] md:block">→</div>
        <FlowBox
          title="High-interest reserve"
          lines={[
            `~${formatAUD(monthly)} / month`,
            `Buffer ${result.banking.reserveBufferMonths} months`,
            `Projected ${formatAUD(result.banking.projectedReserve)}`,
          ]}
          highlight
        />
        <div className="hidden text-center text-2xl text-[var(--color-accent)] md:block">→</div>
        <FlowBox
          title="Spending"
          lines={[
            `Card utilisation ${formatPct(result.banking.cardUtilisationPct)}`,
            'Autopay credit card',
            'Irregular / debit access',
          ]}
        />
      </div>
    </Card>
  )
}

function FlowBox({
  title,
  lines,
  highlight,
}: {
  title: string
  lines: string[]
  highlight?: boolean
}) {
  return (
    <div
      className={
        highlight
          ? 'rounded-md border-2 border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-4'
          : 'rounded-md border border-[var(--color-line)] bg-white p-4'
      }
    >
      <p className="font-semibold">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-[var(--color-ink-muted)]">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
