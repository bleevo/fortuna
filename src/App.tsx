import { useEffect, useMemo, useState } from 'react'
import { calculateScenario } from '@/calculator/projection'
import { RATES_AS_OF } from '@/calculator/rates'
import type { ScenarioInputs } from '@/calculator/types'
import { RatesReferencePanel } from '@/components/RatesReferencePanel'
import { SourceRef } from '@/components/SourceRef'
import { ExpensesTab } from '@/components/tabs/ExpensesTab'
import { HomeTab } from '@/components/tabs/HomeTab'
import { OverviewTab } from '@/components/tabs/OverviewTab'
import { PensionDetailTab } from '@/components/tabs/PensionDetailTab'
import { PortfolioTab } from '@/components/tabs/PortfolioTab'
import { ProfileTab } from '@/components/tabs/ProfileTab'
import { YearByYearTab } from '@/components/tabs/YearByYearTab'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { defaultScenario } from '@/defaults/scenario'
import {
  clearScenario,
  loadScenario,
  saveScenario,
} from '@/storage/scenarioStorage'

const TABS = [
  'overview',
  'pension',
  'profile',
  'home',
  'expenses',
  'portfolio',
  'year-by-year',
  'sources',
] as const

type TabId = (typeof TABS)[number]

const TAB_LABELS: Record<TabId, string> = {
  overview: 'Overview',
  pension: 'Pension detail',
  profile: 'Profile',
  home: 'Home',
  expenses: 'Expenses',
  portfolio: 'Portfolio',
  'year-by-year': 'Year by year',
  sources: 'Sources',
}

function tabFromHash(): TabId {
  const hash = window.location.hash.replace(/^#/, '')
  return (TABS as readonly string[]).includes(hash) ? (hash as TabId) : 'overview'
}

export default function App() {
  const [inputs, setInputs] = useState<ScenarioInputs>(() => loadScenario())
  const [confirmReset, setConfirmReset] = useState(false)
  const [tab, setTab] = useState<TabId>(tabFromHash)

  useEffect(() => {
    saveScenario(inputs)
  }, [inputs])

  useEffect(() => {
    function sync() {
      setTab(tabFromHash())
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const result = useMemo(() => calculateScenario(inputs), [inputs])

  function selectTab(next: string) {
    setTab(next as TabId)
    window.history.replaceState(null, '', `#${next}`)
  }

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
                onClick={() => selectTab('sources')}
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

      <Tabs value={tab} onValueChange={selectTab}>
        <TabsList aria-label="Scenario sections">
          {TABS.map((id) => (
            <TabsTrigger key={id} value={id}>
              {TAB_LABELS[id]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab inputs={inputs} result={result} />
        </TabsContent>

        <TabsContent value="pension">
          <PensionDetailTab result={result} />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileTab inputs={inputs} patch={patch} />
        </TabsContent>

        <TabsContent value="home">
          <HomeTab inputs={inputs} patch={patch} />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpensesTab inputs={inputs} patch={patch} setInputs={setInputs} />
        </TabsContent>

        <TabsContent value="portfolio">
          <PortfolioTab
            inputs={inputs}
            patch={patch}
            setInputs={setInputs}
            result={result}
          />
        </TabsContent>

        <TabsContent value="year-by-year">
          <YearByYearTab result={result} />
        </TabsContent>

        <TabsContent value="sources">
          <RatesReferencePanel />
        </TabsContent>
      </Tabs>

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
        linked via the{' '}
        <SourceRef sourceId="sa-age-pension-rates" variant="inline" /> chips on
        each tab.
      </footer>
    </div>
  )
}
