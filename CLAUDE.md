# CLAUDE.md

Guidance for AI agents (Claude Code etc.) working in this repo. Humans: see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Project

GovBB Design System — **CSS-first single package** (vanilla CSS + custom
properties; no Sass, no Tailwind). **Node 24**, **pnpm 11** via Corepack.

```bash
corepack enable && pnpm install   # deps + git hooks
```

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
- Tokens live in `src/tokens.css`; one file per component under
  `src/components/`, imported from `src/index.css`.
- `pnpm dev` — Vite playground · `pnpm build` — Lightning CSS →
  `dist/govbb.css` · `pnpm lint` — oxlint + Stylelint.

## Tooling

pnpm (single package) · Vite (playground) · Lightning CSS (build) · oxlint +
Stylelint (lint) · Prettier (format) · Lefthook (git hooks) · commitlint
(commit-msg) · git-cliff (changelog).
