# Fortuna jobs

Add a line. Newest at the top. One line = one job.

The agent takes the first `[ queued ]` job, flips it to `[ in progress ]`, does it, then `[ done ]`.

Statuses: `queued` · `in progress` · `done`

```
[ queued ] - what to do
```

---

[ queued ] - example: show RATES_AS_OF as plain text in the header (from rates.ts, not hardcoded). Do not implement unless asked.

[ done ] - year by year should include the projected income and assets cut-offs (indexed forward, alongside the existing full-pension assets threshold)

[ done ] - cut the AI-slop header blurb in App.tsx down to a plain one-liner; drop the "Look for the SOURCE chip" explainer from the header (it already lives in the rates panel)

[ done ] - remove "Built for Cloudflare Pages static hosting." from the App.tsx footer

[ done ] - default assets to $1.6m cash + $25k super + $600k home value; the scenario is working out how much to put into the house, expenses and investments

[ done ] - default assets to 1.5 + 600k all cash

[ done ] - add support for https://github.com/shadcn-ui/lint
[ done ] - break the site up into tabs starting with the following tabs, overview (high level stats annual pension/spendable year/assessible assets/liquid at end), pension detail, profile (Person & horizon card atm), home, expenses, portfolio, year by year, sources
[ done ] - add a new tab called scenarios: list saved scenarios, save current as a named save, load another save, delete a save
[ done ] - change age to use birth month/year instead of age, default it to 4/1943
[ queued ] - in sources add the info about super contributions after age 75 https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/restrictions-on-voluntary-contributions
