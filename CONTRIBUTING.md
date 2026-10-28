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

## AI documentation and skills

Public skills live in `skills/<name>/SKILL.md` and install through
`npx skills add govtech-bb/govbb-design-system`. Keep each skill's references
and helpers inside its own directory so it can be installed independently.
Run helpers from the consumer project, resolving dependencies and GovBB exports
there rather than from the installed skill directory.

GovTech's `team-skills` marketplace also lists `skills/` as the `govbb` plugin,
through `skills/.claude-plugin/plugin.json`. Don't move or rename `skills/`, and
don't add a `version` to the manifest: without one, every merge to `main` is
a new plugin version, and a declared one freezes plugin users on it (ADR 0003).

The site generates `/llms.txt` from its content collections and published skills.
Update the guidance source rather than maintaining a second inventory. Markdown
token tables use the same token source as the HTML tables. Skill Markdown URLs
preview the entrypoint; the CLI installs the supporting files too.

```sh
pnpm build
pnpm test:ai-docs
pnpm exec playwright install chromium
pnpm test:skills
npx skills add . --list
```

Test a changed skill with `npx skills add /path/to/this/checkout --skill <name>`
from a disposable consumer project, then run its helpers from that project.
Check both successful evidence and missing-tool failures. Review representative
tasks without a comparative model-scoring harness (ADR 0004).

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

A release is an ordinary pull request. From a clean checkout, run:

```bash
pnpm release:prepare 1.0.0-alpha.30   # no leading v
```

It branches `release/vX.Y.Z` from `origin/main`, bumps `@govtech-bb/frontend`
and `@govtech-bb/react` to that version (lockstep — the two always share a
version), regenerates `CHANGELOG.md` with git-cliff and commits
`chore(release): vX.Y.Z`. Push the branch and open a PR as usual; it needs the
same passing checks as any other PR.

When it merges, the **Release** workflow:

1. re-runs the full CI gate (lint, typecheck, test, build, Storybook);
2. tags `vX.Y.Z` on the merge commit;
3. publishes both packages to npm with provenance through npm trusted
   publishing (the `workspace:^` dep in react is rewritten to `^X.Y.Z` at
   publish time);
4. creates a GitHub release with the changelog section as notes.

A run releases whatever version is on `main` and has no GitHub release yet, so
a release that fails or is cancelled is finished by the next run, and you can
retry straight away by running the **Release** workflow from the Actions tab.
It tags the commit that set the version and skips whatever already happened.

The gate runs on that commit, because that's what gets published. A re-run
gets past a flaky failure. A real one can't be fixed in place: merge the fix,
then prepare the next version with `--replace-unreleased`, and the failed one
is never published:

```bash
pnpm release:prepare 1.0.0-alpha.31 --replace-unreleased
```

The version must be newer than every existing tag, and `release:prepare`
checks this before it branches. It also refuses while the version on `main`
isn't on npm yet, so only one release is in flight at a time. Don't publish from a laptop — both packages
have `prepublishOnly` builds as a backstop, but the workflow is the source of
truth.

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
