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
- Static build for **Cloudflare Pages** at [fortuna.pages.dev](https://fortuna.pages.dev)

Pushes to `main` deploy production. Cloudflare Pages settings: build command `npm run build`, output directory `dist`, Node.js 22.

## Scripts

```bash
npm install
npm run dev      # local app
npm test         # calculation unit tests
npm run build    # static production build → dist/
npm run preview        # preview dist/
npm run pages:deploy   # build and upload dist/ to Pages (requires Wrangler login)
```

## Tailwind lint

When available via the Tailwind CSS CLI:

```bash
npx @tailwindcss/cli lint ./src
```

Also use the project TypeScript check (`npm run build` runs `tsc -b`) and Vitest.

## Product notes

- Not financial advice — a transparent planning tool.
- All scenario data stays in the browser.
- Prefer updating rate constants over adding speculative policy forecasts.
