# CLAUDE.md

Guidance for AI agents (Claude Code etc.) working in this repo. Humans: see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Project

GovBB Design System — **CSS-first, framework-agnostic** (vanilla CSS + custom
properties; no Sass, no Tailwind, no StyleX). **Node 24**, **pnpm 11** via
Corepack.

```bash
corepack enable && pnpm install   # deps + git hooks
```

## Architecture — pnpm workspace, two packages

Following the GOV.UK Frontend model: CSS + progressive-enhancement JS ship in
**one** package; the React wrapper is separate only for its `react` peer dep.

- **`packages/frontend`** (`@govtech-bb/frontend`) — tokens + component CSS
  (`build` → `dist/govbb.css`, exported as `./css`) **and** the plain-ESM PE
  runtime (`initAll()` scans `data-govbb-module` and upgrades behavioural
  components; the JS is the main export, no build). Consumed directly by
  PHP/server-rendered apps and by React. CSS-only consumers just import `./css`
  and never pull the JS.
- **`packages/react`** (`@govtech-bb/react`) — thin wrappers that emit the
  stable `govbb-*` classes; behaviour reused from `frontend`. **Never** a second
  source of truth for styling. Wrappers use **cva** (`class-variance-authority`)
  to map props → BEM classes and derive prop types — see `button.tsx` as the
  reference pattern. cva lists variant _names_; the CSS owns what they look like.
- **`apps/site`** (`@govbb/site`) — Astro docs site.

Deliberately **not** using Lit/Stencil (Shadow DOM fights global tokens + PHP
consumers) or StyleX (React-only, kills the stable-class API). One framework
(React) → hand-written cva wrappers beat a WC-compiler's codegen.

## Commit rules (enforced — do not bypass)

Use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`.

- A `commit-msg` hook runs **commitlint** and rejects non-conforming messages. Do **not** use `--no-verify` to get around it.
- **scope = the component name** (lowercase: `button`, `checkbox`, …). The changelog is grouped into per-component sections by scope, so the scope is meaningful, not decorative.
- Omit the scope only for genuinely repo-wide changes (deps, ci, tooling, docs) — those go under a `### General` section.
- `subject`: imperative, lowercase, no trailing period.

```
feat(button): add size prop
fix(checkbox): correct focus ring offset
docs: update readme
```

## Changelog — never hand-edit

`CHANGELOG.md` is generated from commit messages by **git-cliff**. The commit subject becomes the changelog line, so write subjects as user-facing release notes. Regenerate with `pnpm changelog`. Do not edit `CHANGELOG.md` directly.

## CSS conventions (enforced by Stylelint)

- Class names: `govbb-`-prefixed BEM (`govbb-block__element--modifier`).
- Custom properties: `--govbb-*` kebab-case.
- Tokens live in `packages/frontend/src/tokens.css` (primitive tier mirrors the
  Figma variable ramp, then a small semantic tier we add); one file per
  component under `packages/frontend/src/components/`, imported from
  `packages/frontend/src/index.css`.
- `pnpm dev` — Vite playground (frontend) · `pnpm build` — recursive
  (`pnpm -r build`; frontend CSS → `dist/govbb.css`) · `pnpm lint` — oxlint +
  Stylelint (source only, `packages/*/src/**/*.css`).

## Tooling

pnpm workspace · Vite (frontend playground) · Lightning CSS (CSS build) ·
cva (React variant wrappers) · oxlint + Stylelint (lint) · Prettier (format) ·
Lefthook (git hooks) · commitlint (commit-msg) · git-cliff (changelog).
