import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { YearRow } from '@/calculator/types'
import { Card } from '@/components/ui/card'
import { formatAUD } from '@/lib/utils'
import type { ReactNode } from 'react'

export function TimelineCharts({ timeline }: { timeline: YearRow[] }) {
  const data = timeline.map((row) => ({
    age: row.age,
    spendable: Math.round(row.spendable),
    pension: Math.round(row.pension),
    privateIncome: Math.round(
      row.vdcoDistributions + row.bondCoupons + row.annuityIncome + row.capitalDrawdown,
    ),
    assessable: Math.round(row.assessableAssets),
    threshold: Math.round(row.assetsThreshold),
    liquid: Math.round(row.liquidCapital),
    home: Math.round(row.homeValue),
  }))

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Spendable income by age">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5d2cc" />
            <XAxis dataKey="age" />
            <YAxis tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} width={56} />
            <Tooltip formatter={(v) => formatAUD(Number(v))} />
            <Legend />
            <Line type="monotone" dataKey="spendable" name="Spendable" stroke="#0f6b5c" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="pension" name="Pension" stroke="#1d4e89" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="privateIncome" name="Private" stroke="#b45309" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Assessable assets vs threshold">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5d2cc" />
            <XAxis dataKey="age" />
            <YAxis tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} width={56} />
            <Tooltip formatter={(v) => formatAUD(Number(v))} />
            <Legend />
            <Line type="monotone" dataKey="assessable" name="Assessable" stroke="#0f6b5c" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="threshold" name="Full-pension threshold" stroke="#1d4e89" strokeWidth={2} strokeDasharray="6 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Liquid capital run-down">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5d2cc" />
            <XAxis dataKey="age" />
            <YAxis tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} width={56} />
            <Tooltip formatter={(v) => formatAUD(Number(v))} />
            <Line type="monotone" dataKey="liquid" name="Liquid capital" stroke="#0f6b5c" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Home value">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5d2cc" />
            <XAxis dataKey="age" />
            <YAxis tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} width={56} />
            <Tooltip formatter={(v) => formatAUD(Number(v))} />
            <Line type="monotone" dataKey="home" name="Home" stroke="#b45309" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h3 className="mb-3 font-display text-xl">{title}</h3>
      {children}
    </Card>
  )
}
