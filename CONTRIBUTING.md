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

Releases run entirely in GitHub. There is no local release command.

1. Open **Actions → Prepare release → Run workflow**, select **main**, and
   enter the next version, for example `1.0.0-alpha.30`. Leave
   **replace-unreleased** unchecked.
2. The workflow opens or refreshes `release/next`, updating both package
   versions and generating `CHANGELOG.md` with git-cliff.
3. Review the PR and wait for the required checks. If main gains changelog
   entries before you merge, run **Prepare release** again with the same
   version and review the updated notes. Do not hand-edit the automated branch.
4. Merge the PR. **Release** checks the merge commit, packs both packages,
   creates its Git tag, publishes to npm with provenance, and creates the
   GitHub release.

Versions must be canonical 1.x SemVer: no leading `v`, leading-zero numeric
parts, or build metadata. Prereleases use npm's `alpha` channel; stable versions
use `latest`. Frontend and React always share a version. React's
`workspace:^` dependency becomes `^<release version>` in the packed package.

### One-time repository setup

A repository administrator must:

- Install a GitHub App on **this repository only**, with **Contents: read and
  write** and **Pull requests: read and write**. No branch-protection bypass.
- Set the Actions variable `RELEASE_APP_CLIENT_ID` and secret
  `RELEASE_APP_PRIVATE_KEY` for that App.
- Keep both npm packages' trusted publishers pointed at this repository's
  `release.yml` workflow. Publishing uses GitHub OIDC, not an npm token.

The short-lived App token lets the release PR trigger the usual required
checks; `GITHUB_TOKEN` alone would not. Reviews and branch protection stay in place.

### Failed or interrupted releases

Use the Actions UI for recovery. Do not move release tags or publish from a laptop.

| Failure                                                                                         | Recovery                                                                                                                           |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Preparation fails, or the open PR's changelog is stale                                          | Run **Prepare release** again with the same version.                                                                               |
| A transient CI or registry failure                                                              | Choose **Re-run failed jobs** on the original **Release** run.                                                                     |
| A source defect or stale changelog fails after merge, before a tag or either npm package exists | Merge the fix. Run **Prepare release** with a **newer version** and **replace-unreleased** checked, then review and merge that PR. |
| One package publishes, a response is lost, or GitHub release creation fails                     | Re-run the original release. It verifies npm integrity and skips identical published packages. Do not replace this version.        |
| An integrity, tag-source or distribution-tag mismatch                                           | Stop for maintainer reconciliation. The workflow will not overwrite published history.                                             |

All jobs use the workflow's original commit. Once main has advanced, use
**Re-run failed jobs**, not a fresh dispatch: testing later source cannot repair
the original release. A manual **Release** dispatch can retry while main is
still at the version-setting commit, and completed releases are no-ops.

Packed artifacts are retained for 30 days. Re-running failed publication jobs
reuses the original artifact. A full re-run rebuilds and must match any bytes
already published; if that is impossible, stop for maintainer recovery.

Preparation and publication share a queue (up to GitHub's limit of 100 pending
runs). Preparation blocks a new release until the current one is complete,
unless it is explicitly replaced before tagging or publication. The immutable
Git tag reserves the source; npm's unique package/version and SHA-512 integrity
allow safe recovery after a lost response. API errors never mean “not published.”

### Checking release automation

`pnpm test:release` runs the focused release tests with real Git, git-cliff,
pnpm, npm and gh commands against temporary repositories and localhost services.
It never publishes to npm. GitHub validates workflow wiring and runs the
required suites. The App installation and npm OIDC configuration still need
verification on the first hosted release.

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
