# Retirement Income & Pension Optimisation Calculator — Specification

## Purpose

A private, single-user planning tool for modelling an Australian retiree's cash flow, Age Pension position, investment mix, annuity allocation, housing allocation, and drawdown strategy.

The calculator is not a commercial product. It should be simple, easy to update, and optimised for the current rules rather than attempting to predict future policy changes.

The primary objective is:

> Maximise reliable spendable income while preserving as much Age Pension entitlement as practical, subject to liquidity, simplicity, and capital-preservation preferences.

The current example scenario is an 80-year-old single homeowner in Australia with approximately $2,000,000 in starting cash.

---

## Core Planning Structure

Model the retiree's wealth as four major buckets:

1. **Principal Place of Residence**
   - Exempt from the Age Pension assets test while it qualifies as the principal home.
   - Used as the primary destination for surplus capital that would otherwise reduce pension entitlement.
   - In later aged-care scenarios, treatment changes and must be modelled separately.

2. **Investable / Assessable Portfolio**
   - Default target around the point where pension economics are attractive.
   - Current working example: approximately $330,000 assessable investment pool.
   - Default investment vehicle: Vanguard Diversified Conservative Index ETF (VDCO), unless annuity allocation is used.

3. **Lifetime Annuity**
   - Default product for modelling: Challenger Liquid Lifetime Annuity.
   - Used as a pension-efficient income stream and longevity hedge.
   - Calculator should optimise or compare annuity percentage versus VDCO / assessable investments.

4. **Prepaid / Exempt / Spent Amounts**
   - Genuine one-off or prepaid personal expenses.
   - Examples:
     - prepaid funeral costs
     - cemetery plot
     - rates paid in advance
     - insurance paid in advance
     - utilities or service charges paid in advance where accepted
     - moving costs
     - furniture / setup costs
   - Model these as reductions in available cash when they are genuinely spent.

---

## Default Personal Assumptions

- Relationship status: **Single**
- Homeowner: **Yes**
- Current age: **80**
- Planning horizon: **Age 95**
- Starting liquid assets: **$2,000,000**
- Principal residence starting value: user input
- Inflation assumption: **3.5% p.a.**
- Pension thresholds: current values at time of implementation
- Tax jurisdiction: Australia
- State: Queensland
- Tax residency: Australian resident
- No employment income by default
- No other recurring income by default
- No debt by default

---

## Age Pension Modelling

### Assets Test

For a single homeowner:

- Use the current full-pension assets threshold.
- Use the current upper cut-off.
- Apply the legislated taper:
  - currently approximately **$3 per fortnight per $1,000** of assessable assets above the lower threshold.
  - equivalent to approximately **7.8% p.a.** of the excess asset balance.

The calculator must show:

- assessable assets
- exempt assets
- pension reduction from assets test
- annual pension under assets test

### Income Test

Financial assets are subject to **deeming**, not actual investment yield.

Use current deeming rules:

- lower deeming threshold
- lower deeming rate
- upper deeming rate
- income-free area
- pension taper above income-free area

The calculator must show:

- deemed income
- actual portfolio income
- income-test pension reduction
- annual pension under income test

### Actual Pension Payable

Age Pension payable is the lower result produced by:

- assets test
- income test

Also cap at the maximum applicable pension rate.

---

## Threshold Indexation

The calculator should model threshold growth over time.

Default assumption:

- threshold indexation rate = **3.5% p.a.**

This is a modelling simplification.

The intent is to model the concept that Age Pension thresholds rise over time while nominal bond principal does not.

The calculator should allow the user to change the assumed annual indexation rate.

### Growth-Sleeve Concept

The assessable portfolio may contain a growth allocation so that portfolio value can roughly keep pace with indexed thresholds.

Example logic:

- if total assessable portfolio = $330,000
- threshold indexation = 3.5%
- growth allocation = 30%
- growth sleeve must earn roughly 11.7% to grow the entire portfolio by 3.5% if the defensive sleeve does not grow in capital value

This is illustrative only.

The calculator should show:

- required growth return to keep assessable assets in line with threshold growth
- actual expected total portfolio growth
- difference versus indexed threshold

---

## Default Investment Vehicle

### Vanguard Diversified Conservative Index ETF — VDCO

Use VDCO as the default non-annuity portfolio because it is:

- simple
- internally rebalanced
- approximately 70% defensive / 30% growth
- suitable for a low-maintenance structure

Default conceptual allocation:

- approximately 30% growth assets
- approximately 60% bonds
- approximately 10% cash

The calculator should allow:

- expected distribution yield
- expected capital growth
- expected total return
- annual management fee
- distribution frequency

Default distribution treatment:

- distributions paid as cash
- no automatic reinvestment

The tool should distinguish:

- cash income
- capital growth
- total return

For Centrelink purposes, deeming applies to the financial asset value rather than actual distributions.

---

## Government Bond Alternative

Allow comparison against a direct Australian Government bond allocation.

Default reference assumption:

- nominal yield: approximately **5.3%**
- coupon may differ from yield
- bond price may be above or below face value

The calculator should support:

- face value
- purchase price
- coupon rate
- yield to maturity
- maturity date
- annual coupon income
- maturity value
- optional sale before maturity
- capital gain/loss if sold or held to redemption

This is primarily for comparison against VDCO and annuity strategies.

---

## Lifetime Annuity

### Default Product

Use **Challenger Liquid Lifetime Annuity** as the default example product.

Reason:

- widely available Australian lifetime annuity
- designed for retirement income
- concessional Age Pension means-test treatment
- straightforward real-world reference product

### Default Assumptions

For the initial implementation use:

- age at purchase: **80**
- immediate payments
- no CPI indexation by default
- default income rate: **$9,970 per $100,000 p.a.**
- user-overridable
- starting assessable asset percentage: **60%**
- post-threshold-day assessable percentage: **30%**
- assessable income percentage: **60%** of annuity payment

These defaults should be clearly marked as assumptions and easy to update in code.

### Threshold Day

Model the threshold day as:

> the later of age 85 or 5 years after purchase

At threshold day:

- assessable annuity asset value falls from 60% of purchase price to 30%

### Annuity Outputs

Show:

- annuity purchase amount
- annual annuity payment
- Centrelink-assessed annuity income
- Centrelink-assessed annuity asset value
- pension impact
- cumulative annuity payments
- cumulative payments by age 95
- remaining / death benefit treatment as a user note rather than a guaranteed assumption unless explicitly modelled

### Allocation Comparison

Allow an annuity allocation slider:

- 0% to 100% of investable retirement capital

Show side-by-side:

- annual income
- pension
- liquidity
- assessable asset value
- assessable income
- total cash flow
- projected capital remaining at age 95

The recommended modelling focus is a **partial annuity**, not automatically 100%.

---

## Run-to-Zero Strategy

Provide an optional toggle:

**Run assessable investment assets to zero by age 95**

This applies to the approximately $330,000 liquid / assessable pool, not to the principal residence.

When enabled:

- permit planned annual drawdown of capital
- calculate sustainable annual withdrawal
- allow investment income and pension to contribute to spending
- target final assessable investment balance = $0 at age 95

The principal residence remains separate and acts as a later-life backstop.

Show:

- annual capital drawdown
- remaining liquid assets each year
- total annual spendable cash
- age at depletion if assumptions are not met

---

## Aged Care Phase

Add an optional **Aged Care at Age X** toggle.

Default:

- age 95

When triggered:

- switch to an aged-care modelling phase
- allow principal residence to be retained or sold
- allow user to enter accommodation costs
- allow RAD / accommodation payment assumptions
- allow means-tested care costs
- allow protected-person toggle
- separately model Age Pension implications

### Principal Home Treatment

Support:

- home retained
- home sold
- protected person remains in home
- no protected person

If sold:

- sale proceeds become assessable cash / investments

If retained:

- apply applicable aged-care and Age Pension home rules for the chosen scenario

Do not assume aged-care rules are identical to Age Pension rules.

---

## Protected Person Toggle

Provide a simple toggle:

**Protected person remains in former home**

Potential examples:

- spouse
- qualifying carer
- qualifying close relative
- dependent child where relevant

The calculator does not need to determine legal eligibility automatically.

Instead:

- user manually selects yes / no
- explanatory tooltip notes that eligibility depends on specific Centrelink / aged-care rules

---

## Superannuation / Downsizer Strategy

### Existing Super

If the retiree already has super:

- allow retirement-phase pension balance input
- apply current transfer balance cap rules
- investment earnings in retirement phase may be tax-free within applicable limits
- Centrelink still assesses super as an asset for someone over Age Pension age

### Downsizer Contribution

Include an optional downsizer contribution strategy after sale of an eligible home.

Default maximum:

- **$300,000 per person**

Use case:

- sell principal residence
- contribute up to eligible downsizer amount into super
- move amount into retirement phase if permitted
- invest the same assessable portfolio inside super

Benefit:

- potentially improves after-tax income

Important:

- this does **not** remove the balance from the Age Pension assets test
- this is a **tax optimisation**, not a pension-assets exemption

The calculator should show:

- personal investment tax
- super retirement-phase tax
- difference in after-tax income

---

## Tax

Model Australian personal tax using current tax brackets.

Include:

- SAPTO where applicable
- Medicare levy treatment where applicable
- tax-free retirement-phase super earnings where applicable
- franking credits where applicable

### Franked Shares

If Australian equities are held:

- allow franking percentage
- allow gross-up and refundable franking credit treatment

For Centrelink:

- do not add actual dividends and franking separately for financial assets
- use deeming rules

Treat franking primarily as a tax / after-tax-yield benefit.

---

## Gifting

Model gifting limits.

Current planning assumption:

- up to **$10,000 per financial year**
- maximum **$30,000 over 5 financial years**

Excess gifting remains assessable under deprivation rules for the applicable period.

Provide:

- annual gifting input
- rolling 5-year gifting total
- warning when limit exceeded
- excess deprived asset balance

---

## Prepaid Funeral / Cemetery Costs

Add dedicated optional fields for:

- prepaid funeral
- funeral bond if applicable
- cemetery plot
- burial rights

Treat qualifying exempt funeral arrangements separately from generic prepaid expenses.

Show:

- amount paid
- whether model treats it as exempt
- reduction in assessable assets

---

## Generic Prepaid Expenses

Provide one simple section for genuine personal expenses paid in advance.

Examples:

- council rates
- body corporate / strata
- home insurance
- utilities
- care service charges
- phone
- internet
- other recurring personal expenses

Do not overcomplicate this section.

Fields:

- description
- amount
- years prepaid
- date paid

For the current tool, allow the user to mark each item as:

- counted as spent / non-assessable
- still assessable

This keeps the tool practical without attempting to encode every Centrelink edge case.

---

## One-Off Setup Expenses

Add a single input:

**One-off setup / moving / furniture expenses**

Default: $0

Use for:

- moving into a new home
- furniture
- appliances
- setup costs
- accessibility modifications
- legal / conveyancing costs
- relocation costs

This amount is deducted from starting cash immediately.

---

## Principal Residence

Inputs:

- purchase price
- transaction costs
- renovation / improvement spend
- current value
- expected long-term capital growth
- planned sale age
- optional downsizing value at sale

The residence is excluded from the Age Pension assets test while it qualifies as the principal home.

This is the primary exempt capital bucket in the model.

---

## Cash Management / Banking Setup

Model a simple automated banking structure that is easy for an elderly user to understand.

### Accounts

1. **Income / Reserve Account**
   - high-interest savings account
   - receives:
     - pension
     - VDCO distributions
     - annuity payments
     - bond coupons
     - other income
   - pays:
     - credit card monthly balance
     - major planned expenses
     - debit-card emergency spending if required

2. **Credit Card**
   - used for normal recurring day-to-day expenditure
   - full statement balance automatically paid each month from reserve account
   - credit limit intentionally below expected monthly income to create a spending guardrail
   - default credit limit: **$3,000**
   - user-overridable

3. **Debit Card / Cash Access**
   - backup for irregular or exceptional spending
   - linked to reserve account or a small secondary account

### Visual Diagram

Show a simple flow diagram:

    Pension
    Investment Distributions
    Annuity
    Bond Coupons
          |
          v
    High-Interest Savings / Reserve
          |
          +----> Monthly Credit Card Autopay
          |
          +----> Debit Card / Exceptional Spending
          |
          +----> Large Planned Expenses

This diagram should be visible in the UI and update with calculated annual / monthly values.

### Spending Budget

Inputs:

- target annual spending
- monthly card limit
- one-off setup expenses
- annual irregular-expense allowance

Outputs:

- average monthly income
- average weekly income
- card utilisation
- reserve buffer in months
- projected reserve balance

---

## Cash Buffer

Allow a user-configurable reserve.

Possible default:

- 6 to 12 months of normal expenditure

The reserve is still assessable unless otherwise exempt.

Show the pension cost of holding excess cash versus investing it.

---

## Optimisation Modes

Provide three modes:

### 1. Maximise Reliable Income

Objective:

- maximise annual spendable cash
- maintain positive pension entitlement
- favour annuity and defensive investment income

### 2. Maximise Pension

Objective:

- keep assessable assets and deemed income as low as practical
- allocate more capital to principal residence and exempt / spent categories

### 3. Balanced / Default

Objective:

- maintain approximately the target assessable investment pool
- blend VDCO and annuity
- preserve liquidity
- keep a reasonable pension
- target age 95

---

## Scenario Controls

Inputs should include:

- age
- life expectancy / end age
- starting cash
- existing home value
- new home purchase amount
- setup expenses
- prepaid expenses
- funeral expenses
- gifting
- assessable investment amount
- annuity allocation %
- VDCO allocation %
- direct bond allocation %
- super balance
- downsizer contribution
- annual spending
- inflation
- threshold indexation
- portfolio expected return
- growth return
- bond yield
- annuity payout rate
- aged-care start age
- run-to-zero toggle

---

## Outputs

### Summary Cards

Show:

- annual pension
- annual investment income
- annual annuity income
- annual capital drawdown
- tax
- annual spendable income
- monthly spendable income
- weekly spendable income
- assessable assets
- exempt assets
- projected assets at age 95

### Pension Detail

Show:

- pension before means testing
- reduction from income test
- reduction from assets test
- binding test
- final pension

### Portfolio Detail

Show:

- VDCO value
- annuity purchase value
- bond value
- super value
- cash reserve
- principal residence
- projected capital growth
- projected capital drawdown

### Timeline

Year-by-year table from current age to age 95:

- age
- threshold
- assessable assets
- exempt assets
- deemed income
- pension
- investment distributions
- annuity income
- capital drawdown
- tax
- spendable cash
- remaining liquid capital
- home value

---

## Charts

Keep charts simple.

Recommended:

1. Annual spendable income by age
2. Pension versus private income
3. Assessable asset balance over time
4. Pension threshold versus assessable assets
5. Liquid capital run-down
6. Home value
7. Annuity versus non-annuity comparison

---

## Reset

Add a prominent **Reset to Defaults** button.

Reset should:

- restore all original default values
- clear saved local state
- reload the default scenario

Require a confirmation dialog before clearing.

---

## Local Persistence

All calculator inputs should persist automatically in browser local storage.

Requirements:

- save on every meaningful input change
- restore automatically on reload
- no login
- no server
- no external database
- no analytics required

Optionally save a schema version so old local state can be invalidated when the calculator changes.

---

## Architecture

### Front End

- React
- TypeScript
- Vite
- shadcn/ui
- Tailwind CSS

No server-side rendering.

No server components.

No backend.

The application must build to fully static assets.

### Styling

- shadcn/ui components
- Tailwind utility classes
- accessible, high-contrast design
- responsive desktop/tablet layout
- large controls and clear typography suitable for an elderly user

### Linting / Formatting

Use the newly announced Tailwind CSS CLI linting capability where practical.

Also use:

- ESLint
- TypeScript strict mode
- Prettier if useful

Document the exact Tailwind CLI lint command in the repository README once implementation begins.

### Calculation Engine

Keep calculations separate from UI.

Suggested structure:

    src/
      components/
      pages/
      calculator/
        pension.ts
        deeming.ts
        assetsTest.ts
        incomeTest.ts
        annuity.ts
        tax.ts
        super.ts
        agedCare.ts
        projection.ts
        types.ts
      storage/
      defaults/

All financial functions should be pure where possible.

Add unit tests around:

- pension taper
- deeming
- threshold indexation
- annuity assessment
- run-to-zero
- tax
- gifting limits

---

## Hosting

Host on **Cloudflare Pages**.

Requirements:

- static build only
- no Cloudflare Workers required initially
- HTTPS
- simple custom domain optional
- no server-side data storage
- all personal scenario information remains in the user's browser

Build output should be deployable directly to Cloudflare Pages.

---

## Product Philosophy

This is a tool, not a product.

Priorities:

1. Correct enough for current planning
2. Transparent calculations
3. Easy to inspect
4. Easy to update when rules change
5. Minimal maintenance
6. No unnecessary abstraction
7. No attempt to predict future policy changes

If legislation changes materially, update the calculator at that time.

---

## Important Modelling Caveats

The calculator should visibly state:

- It is a planning tool, not financial advice.
- Pension, tax, superannuation and aged-care rules change.
- Actual eligibility should be checked before transactions.
- Product annuity rates change and should be refreshed before use.
- Investment returns are uncertain.
- Equity returns should not be modelled as smooth guaranteed returns.
- Sequence-of-returns risk matters.
- Principal residence and aged-care treatment can depend on specific circumstances.
- Prepaid expenses and exemptions can depend on legal form and Centrelink treatment.

---

## Initial Default Scenario

Use these defaults on first load:

- Age: 80
- End age: 95
- Single
- Homeowner
- Starting liquid assets: $2,000,000
- Inflation: 3.5%
- Threshold indexation: 3.5%
- One-off setup costs: $0
- Annual spending target: $50,000
- Credit card limit: $3,000
- Assessable investment target: $330,000
- VDCO allocation: 70% of non-annuity assessable portfolio
- Direct bond allocation: 0% by default
- Annuity allocation: user-adjustable, default 30%
- Annuity product: Challenger Liquid Lifetime
- Annuity payout assumption: $9,970 per $100,000
- Run-to-zero by age 95: OFF by default
- Aged care start age: 95
- Gifting: $10,000 in each of the first 3 financial years
- Prepaid funeral: $0
- Downsizer contribution: $0
- Super balance: $0 unless entered
- Distribution reinvestment: OFF
- All distributions paid as cash

---

## Primary Question the Calculator Should Answer

> Given her available capital, current pension rules, tax position, housing choice, annuity allocation and investment strategy, what structure gives her the highest practical lifetime spendable income while maintaining simplicity, liquidity and as much Age Pension entitlement as reasonably possible?
