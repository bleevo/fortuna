# Fortuna agent rules

Private, browser-only Australian retirement income & Age Pension calculator. Stack: React + TypeScript + Vite + Tailwind v4. Rates live in `src/calculator/rates.ts`. Not financial advice.

## Job queue (`features.md`)

`features.md` is the work queue. Newest jobs at the top. One line = one job.

Statuses: `queued` · `in progress` · `done`

Format:

```
[ queued ] - what to do
```

A SessionStart hook injects the next job into context for Grok (`.grok/hooks/`), Claude Code (`.claude/settings.json`), and Codex (`.codex/hooks.json`). All three run `scripts/session-start-jobs.cjs`. That script also initializes Husky (`core.hooksPath=.husky/_`) if git hooks are not wired, so the pre-commit `npm run build` still runs. Still read `features.md` yourself — the file is the source of truth.

At the start of a session, unless the user gave a different explicit task:

1. Read `features.md`.
2. If a job is `[ in progress ]`, continue that job.
3. Otherwise take the first `[ queued ]` job.
4. If that job's text says not to implement (or is only an example), leave it queued and stop. Do not promote unmarked bullets into jobs.
5. Flip the chosen job to `[ in progress ]` before changing product code.
6. Implement only that job.
7. Flip it to `[ done ]`.
8. Create exactly one git commit for that job (see Commit rules).

Do not start a second queued job in the same session unless the user asks.

## Commit rules

- One `features.md` job → one commit. That commit includes the status edit in `features.md` and the code for that job. Leave no leftover uncommitted job work.
- Do not mix unrelated changes into that commit.
- Write the message with a HEREDOC. First line is an imperative summary of the job (50–72 characters). Optional body explains why, not a file list.
- Never `git commit --amend` unless the user asked and the commit has not been pushed.
- Never `git push` unless the user asked.
- Never `git commit --no-verify`. Husky pre-commit runs `npm run build`; if the build fails, fix it and commit again.
- Do not commit secrets, `.env`, or `node_modules`.
- If there is nothing to commit, do not create an empty commit.

## Build

- `npm run build` — `tsc -b && vite build`. Husky runs this on every commit.
- `npm test` — Vitest calculation tests. Run when calculator logic changes.
- `npm run lint` — oxlint.

Prefer updating rate constants in `src/calculator/rates.ts` over adding speculative policy forecasts.
