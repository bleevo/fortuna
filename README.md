# Fortuna

Private, browser-only **Australian retirement income & Age Pension** planning calculator.

Built from the planning discussion captured in [`docs/specification.md`](docs/specification.md).

## Features

- Age Pension assets & income tests (including deeming)
- VDCO / defensive portfolio, Australian Government bond alternative, Challenger-style lifetime annuity
- Principal home as the exempt capital bucket, prepaid/exempt spends, gifting deprivation
- Optional run-to-zero drawdown and aged-care phase toggles
- Year-by-year projection, charts, and a simple banking cashflow diagram
- Local storage persistence (no server, no login)

Rates are centralised in `src/calculator/rates.ts` (currently **20 September 2026** figures) with official source links in `src/calculator/sources.ts`. In the UI, look for the **Source** chip next to pension amounts, thresholds and other published figures — each chip opens the Services Australia or ATO page for that rate.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Recharts
- Vitest
- Static build for **Cloudflare Pages** at [fortuna.pages.dev](https://fortuna.pages.dev/)

Pushes to `main` deploy production. Cloudflare Pages build settings (Settings → Build):

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Deploy command:** leave empty — Pages publishes the output directory itself
- **Node.js:** 22, from `.nvmrc`

Pages is the only deploy target. Do not also point a Worker at this repo: a Pages build ignores
Worker `assets` config, and a `wrangler deploy` deploy command stops the Pages project from ever
publishing a deployment of its own.

`public/_headers` sets security headers and `public/_redirects` sends unknown paths to
`index.html`, so the app keeps working if it ever moves off hash-based tab links.

## Scripts

```bash
npm install
npm run dev      # local app
npm test         # calculation unit tests
npm run build    # static production build → dist/
npm run preview  # preview dist/
npm run deploy   # build and wrangler pages deploy (requires Wrangler login)
```

## Lint

```bash
npm run lint     # oxlint + @shadcn/lint design-system rules
```

`.oxlintrc.json` loads [@shadcn/lint](https://github.com/shadcn-ui/lint) as an oxlint JS plugin. It
checks that `src/components/ui` primitives are not restyled at the call site:

- `shadcn/no-inline-styles` — error; the app uses classes only.
- `shadcn/no-raw-colors` — warn; prefer a theme token over `bg-amber-50`.
- `shadcn/no-restyle` — warn, with `layout` classes allowed on primitives.
- `shadcn/require-static-classes` — warn; keep class strings statically analysable.

`shadcn/no-arbitrary-values` is deliberately left off: the palette is delivered through CSS
variables such as `bg-[var(--color-accent)]`, so that rule would flag the design system itself.

Run oxlint from the repo root — a config passed from elsewhere resolves no components and reports
nothing.

Also use the project TypeScript check (`npm run build` runs `tsc -b`) and Vitest.

## Product notes

- Not financial advice — a transparent planning tool.
- All scenario data stays in the browser.
- Prefer updating rate constants over adding speculative policy forecasts.
