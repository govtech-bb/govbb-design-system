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

## Tooling at a glance

| Tool               | Purpose                                                            |
| ------------------ | ------------------------------------------------------------------ |
| pnpm               | single package (no workspace yet)                                  |
| Vite               | playground dev server (`pnpm dev`)                                 |
| Lightning CSS      | bundles/minifies `src/index.css` → `dist/govbb.css` (`pnpm build`) |
| oxlint + Stylelint | linting; Stylelint enforces the `govbb-` prefix (`pnpm lint`)      |
| Prettier           | formatting (`pnpm format`)                                         |
| Lefthook           | runs git hooks; installed on `pnpm install`                        |
| commitlint         | enforces the commit format (`commit-msg` hook)                     |
| git-cliff          | generates `CHANGELOG.md` from commits                              |
