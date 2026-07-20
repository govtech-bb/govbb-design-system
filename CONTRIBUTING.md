# Contributing

How to set up the project, make changes, and get them into a release. If you've
never worked in this repo before, start here.

## Getting started

You need **Node 24** and **pnpm 11**. pnpm comes via [Corepack](https://nodejs.org/api/corepack.html), so you don't install it globally.

```bash
nvm use         # picks Node 24 from .nvmrc (install it first if prompted: nvm install)
corepack enable # makes the pinned pnpm 11 available
pnpm install    # installs dependencies and sets up git hooks
```

That's it — `pnpm install` also installs the git hooks (via Lefthook), so commit checks work automatically from your first commit.

## Making a change

1. Branch off `main` (e.g. `feat/button-size-prop`).
2. Make your change. Components are vanilla CSS under `src/components/` —
   check it in the playground with `pnpm dev`.
3. Commit using the format below. A `pre-commit` hook runs lint + format
   checks; class names and custom properties must be `govbb-`-prefixed
   (Stylelint enforces this).
4. Open a PR into `main`.

Every component ships CSS in `packages/frontend`, usually a thin wrapper in
`packages/react`, a typed Storybook story, and a guidance page in `apps/site`.
If a surface intentionally omits one of those pieces, document and test the
exception.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/). A `commit-msg`
hook runs **commitlint** and will **reject** a commit that doesn't follow the format —
so this isn't optional, it's enforced.

Format:

```
type(scope): subject
```

- **type** — `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`, `build`, `revert`
- **scope** — the **component** the change touches: `button`, `checkbox`, `radio`, … (lowercase). Optional, but see below.
- **subject** — short, imperative, no trailing period (e.g. "add size prop", not "Added size prop.").

Examples:

```
feat(button): add size prop
fix(checkbox): correct focus ring offset
docs: update contributing guide        # no scope — repo-wide change
chore(deps): bump lightningcss to 1.31
```

### Why the scope matters

The changelog is grouped into **per-component sections by scope**. A commit scoped
`feat(button):` shows up under a `### button` heading; `fix(checkbox):` under `### checkbox`.
Commits with **no scope** land in a catch-all **`### General`** section.

So: **use the component name as the scope whenever your change touches a component.**
Leave the scope off only for genuinely repo-wide changes (CI, deps, tooling, docs).

## Changelog

You don't edit the changelog by hand. It's generated from commit messages with
[git-cliff](https://git-cliff.org), which is why good commit messages matter — your
commit subject becomes the changelog line.

```bash
pnpm changelog            # regenerate CHANGELOG.md from all commits
pnpm changelog:unreleased # preview entries not yet in a release
```

Do **not** manually edit `CHANGELOG.md` — fix the commit message instead and regenerate.

## Releasing

Releases are one button: the **Release** workflow in GitHub Actions
(`workflow_dispatch`). Give it a version (e.g. `0.1.0`, no leading `v`) and it:

1. re-runs the full CI gate (lint, typecheck, test, build);
2. bumps `@govtech-bb/frontend` and `@govtech-bb/react` to that version
   (lockstep — the two always share a version);
3. regenerates `CHANGELOG.md` with git-cliff, commits
   `chore: release vX.Y.Z` and tags `vX.Y.Z` on `main`;
4. publishes both packages to npm with provenance (the `workspace:^` dep in
   react is rewritten to `^X.Y.Z` at publish time);
5. creates a GitHub release with the changelog section as notes.

Requires the `NPM_TOKEN` repo secret (npm automation token with publish
rights on the `@govtech-bb` scope). Don't publish from a laptop — both
packages have `prepublishOnly` builds as a backstop, but the workflow is the
source of truth.

## Tooling at a glance

| Tool               | Purpose                                                            |
| ------------------ | ------------------------------------------------------------------ |
| pnpm               | workspace package management                                       |
| Vite               | playground dev server (`pnpm dev`)                                 |
| Lightning CSS      | bundles/minifies `src/index.css` → `dist/govbb.css` (`pnpm build`) |
| oxlint + Stylelint | linting; Stylelint enforces the `govbb-` prefix (`pnpm lint`)      |
| Prettier           | formatting (`pnpm format`)                                         |
| Lefthook           | runs git hooks; installed on `pnpm install`                        |
| commitlint         | enforces the commit format (`commit-msg` hook)                     |
| git-cliff          | generates `CHANGELOG.md` from commits                              |
