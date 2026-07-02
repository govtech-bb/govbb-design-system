# Scaffold the design-system.gov.bb documentation site (#113)

**Date:** 2026-06-29
**Branch:** `feat/113-scaffold-docs-site` → merges into `main`
**Issue:** [#113](https://github.com/govtech-bb/govbb-design-system/issues/113) (sub-issue of #4)

## What shipped

A working Storybook documentation site at `apps/docs`, slotted into the existing
pnpm workspace as `@govbb/docs`:

- Storybook 10 (`@storybook/web-components-vite`) with `addon-docs` + `addon-a11y`,
  telemetry disabled.
- MDX prose pages (`Introduction`, `Guidelines/Getting Started`) alongside stories —
  the site is the single home for both component reference and long-form guidelines.
- A single placeholder GovBB token source (`src/styles/tokens.ts`) feeding both the
  preview CSS custom properties and the Storybook manager theme.
- `dev` / `build` scripts, root `docs:dev` / `docs:build` convenience scripts, and a
  README section on running and contributing.

## Why it looks this way

**Storybook, not Astro/Starlight or Docusaurus.** The design system ships a
web-component library with 20+ components queued for accessibility audits (#87–#109).
Storybook's controls + a11y addon pay off directly on that, and the decision was to
make it the *single* site — prose lives in MDX rather than a separate content site.

**Web components + `lit-html`.** Matches the component library's stack. The renderer's
`lit-html` default is only a docs dev dependency for authoring stories; it doesn't
dictate how the real library is built.

**Single TS token source.** The Storybook manager theme runs in a separate context from
the preview iframe and needs literal colour values — it can't read the preview's CSS
variables. Rather than duplicate hex values (which would drift when real tokens land),
`tokens.ts` is the one source: the theme imports its constants and the preview injects
`tokensCss()` into the iframe. Tokens themselves are a clearly-marked placeholder
(Barbados national palette) to be replaced under #4.

**Build script allowance.** pnpm 11.9 blocks dependency build scripts by default, which
broke esbuild (used by Vite). `allowBuilds: esbuild` in `pnpm-workspace.yaml` re-enables
it — verified at runtime via a clean `--frozen-lockfile` install.

## Scope decisions

- **CI/deploy removed and deferred to #15.** Initial workflows (`docs-build.yml`,
  `docs-deploy.yml`) were dropped because the dev-tooling epic #15 explicitly owns the
  CI pipeline. **Consequence:** this no longer satisfies #113's own acceptance criteria
  ("CI builds the docs site on PRs", "baseline deploy target") — #15 must add the docs
  build check (`pnpm --filter @govbb/docs build`) when it builds the CI pipeline.
- **Button stub removed** at the user's request, leaving no component-reference example
  yet (Components section is empty until real components land).

## Verification

Typecheck (`tsc --noEmit`) and `storybook build` both pass. Driven in a headless browser
across the Introduction and Getting Started pages — GovBB branding renders from the
token source. No automated test/lint tooling exists in the repo yet (that's #15's
territory); build + typecheck are the current checks.

## Follow-ups

- #15: add the docs build check to CI; reconcile `.nvmrc` (24) vs `engines` (`>=22`).
- #4: replace placeholder tokens with official GovBB tokens; enable GitHub Pages (or
  chosen host) and DNS cutover for `design-system.gov.bb`.
