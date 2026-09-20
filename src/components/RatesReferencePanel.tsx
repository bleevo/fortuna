import {
  DOWNSIZER_MAX_PER_PERSON,
  RATE_FIGURES,
  RATES_AS_OF,
  type RateFigure,
} from '@/calculator/rates'
import { SOURCES, type SourceId } from '@/calculator/sources'
import { SourceRef } from '@/components/SourceRef'
import { Card } from '@/components/ui/card'
import { formatAUD, formatPct } from '@/lib/utils'

/** Sources cited in the notes below the figures table. */
const NOTE_SOURCE_IDS: SourceId[] = [
  'ato-contribution-restrictions',
  'ato-downsizer',
]

function formatFigure(figure: RateFigure): string {
  switch (figure.format) {
    case 'money':
      return formatAUD(figure.value)
    case 'money-fortnight':
      return `${formatAUD(figure.value, 2)} / fortnight`
    case 'money-per-1000':
      return `${formatAUD(figure.value, 0)} per $1,000 / fortnight`
    case 'pct':
      return formatPct(figure.value)
    default:
      return String(figure.value)
  }
}

export function RatesReferencePanel() {
  const uniqueSourceIds = [
    ...new Set([...RATE_FIGURES.map((f) => f.sourceId), ...NOTE_SOURCE_IDS]),
  ] as SourceId[]

  return (
    <Card className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-[var(--color-ink)]">
          Rates &amp; sources
        </h2>
        <p className="mt-1 text-[var(--color-ink-muted)]">
          Published figures used in this model as of{' '}
          <strong>{RATES_AS_OF}</strong>. Look for the{' '}
          <SourceRef sourceId="sa-age-pension-rates" /> chip wherever a figure
          is drawn from an official page.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] text-[var(--color-ink-muted)]">
              <th className="py-2 pr-3 font-semibold">Figure</th>
              <th className="py-2 pr-3 font-semibold">Value</th>
              <th className="py-2 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {RATE_FIGURES.map((figure) => (
              <tr
                key={figure.id}
                className="border-b border-[var(--color-line)]/70 align-top"
              >
                <td className="py-2.5 pr-3">
                  <div className="font-medium text-[var(--color-ink)]">
                    {figure.label}
                  </div>
                  {figure.detail ? (
                    <div className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                      {figure.detail}
                    </div>
                  ) : null}
                </td>
                <td className="py-2.5 pr-3 font-semibold tabular-nums">
                  {formatFigure(figure)}
                </td>
                <td className="py-2.5">
                  <SourceRef sourceId={figure.sourceId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Super contributions after age 75
        </h3>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Once you turn 75, a fund can only accept a narrow set of
          contributions, so topping super up is largely off the table.{' '}
          <SourceRef sourceId="ato-contribution-restrictions" />
        </p>
        <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink)]">
          <li>
            <strong>Always accepted:</strong> compulsory employer contributions
            (super guarantee, award or trust-deed contributions) and downsizer
            contributions — up to {formatAUD(DOWNSIZER_MAX_PER_PERSON)} per
            person from the sale of a qualifying home, with no upper age limit
            and no work test. <SourceRef sourceId="ato-downsizer" />
          </li>
          <li>
            <strong>
              Cut off 28 days after the end of the month you turn 75:
            </strong>{' '}
            personal contributions, spouse contributions and salary sacrifice.
            Past that window the fund has to return them.
          </li>
          <li>
            <strong>Before 75:</strong> every contribution type is accepted,
            though claiming a deduction for a personal contribution between 67
            and 74 needs the work test — 40 hours of gainful employment in a
            consecutive 30-day period that financial year — or the one-off work
            test exemption.
          </li>
        </ul>
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
          Practical effect here: past 75, spare money stays outside super
          unless it arrives as a downsizer contribution.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Source catalogue
        </h3>
        <ul className="mt-2 space-y-2">
          {uniqueSourceIds.map((id) => {
            const source = SOURCES[id]
            return (
              <li
                key={id}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm"
              >
                <SourceRef sourceId={id} />
                <span className="text-[var(--color-ink)]">
                  {source.publisher} — {source.title}
                </span>
                <span className="text-[var(--color-ink-muted)]">
                  (as of {source.asOf})
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}
