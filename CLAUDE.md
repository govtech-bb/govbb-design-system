# CLAUDE.md

Guidance for AI agents (Claude Code etc.) working in this repo. Humans: see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Project

GovBB Design System — pnpm **workspace** monorepo (`packages/*`, `apps/*`). **Node 24**, **pnpm 11** via Corepack.

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

## Tooling

pnpm workspace · Lefthook (git hooks) · commitlint (commit-msg) · git-cliff (changelog).
