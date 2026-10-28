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
   **Replace an unreleased version** unchecked for a normal release.
2. The workflow opens or refreshes the single `release/next` PR. It updates
   both package versions and generates `CHANGELOG.md` with git-cliff.
3. Review the versions and changelog, wait for the required checks, then merge.
   If main gains release-note entries while the PR is open, run **Prepare
   release** again with the same version. Do not edit the automated branch
   or its changelog by hand.
4. **Release** runs automatically after the merge. It checks the exact commit
   being released, packs both packages, reserves the Git tag, publishes to npm
   with provenance, and creates the GitHub release.

Versions must be canonical 1.x SemVer: no leading `v`, leading-zero numeric
parts, or build metadata. Prereleases use npm's `alpha` channel; stable versions
use `latest`. Frontend and React always share a version. React's
`workspace:^` dependency becomes `^<release version>` in its npm tarball.

### One-time repository setup

A repository administrator must configure these before using **Prepare release**:

- Install a GitHub App on **this repository only**, with **Contents: read and
  write** and **Pull requests: read and write**. It does not need a branch
  protection bypass.
- Set the Actions variable `RELEASE_APP_CLIENT_ID` to the App's client ID and
  the Actions secret `RELEASE_APP_PRIVATE_KEY` to its private key. The workflow
  requests a short-lived repository-scoped token.
- Keep both npm packages' trusted publishers pointed at this repository's
  `release.yml` workflow. Publishing uses GitHub OIDC, not an npm token.

The App token lets an automated PR trigger the usual required checks.
`GITHUB_TOKEN` alone does not trigger those PR workflows. Branch protection
and required reviews remain unchanged.

### Failed or interrupted releases

Use the Actions UI for recovery; do not publish packages or move tags manually.

| Failure                                                                                                  | What to do                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preparation fails before opening the PR                                                                  | Fix the reported problem, then run **Prepare release** again with the same version. The failed runner leaves no local branch to clean up.                                                     |
| PR changelog is stale                                                                                    | Run **Prepare release** again with the same version, review the refreshed PR, then merge.                                                                                                     |
| A transient CI, network or registry failure                                                              | Use **Re-run failed jobs** on the original **Release** run. After packing succeeds, this reuses that run's saved tarballs.                                                                    |
| A source defect or stale changelog fails the gate after merge, before a tag or either npm package exists | Merge the fix, then run **Prepare release** with a **newer version** and **Replace an unreleased version** checked. Review and merge that PR. Retrying the old commit cannot include the fix. |
| One package publishes, a response is lost, or GitHub release creation fails                              | Re-run the original release. It checks npm integrity, skips identical published packages, and finishes the missing work. Do not replace this version.                                         |
| An integrity, tag-source or distribution-tag mismatch                                                    | Stop and have a maintainer reconcile the original run, artifact and registry state. The workflow refuses to guess or overwrite history.                                                       |

You can also dispatch **Release** on **main** to retry its current version.
This selects the commit that set **both** versions, not later source fixes.
Prefer **Re-run failed jobs** when publication has begun: its packed artifact
is retained for 30 days. A full re-run or fresh dispatch packs again and must
match any bytes already published. If the original artifact has expired and
cannot be reproduced, stop for maintainer recovery rather than change the tag.

Preparation and publication share a queued concurrency group. Runs do not
replace one another in the pending slot; GitHub permits up to 100 pending runs.
The release decision runs inside that group. Preparation also refuses a second
release until both current packages and the GitHub release are complete.
Only an explicitly replaced, untagged and wholly unpublished version may be
skipped.

The Git tag records the immutable source before npm publication. npm's unique
package/version identity and SHA-512 tarball integrity make retries safe after
a lost response. The GitHub release records completion only after both npm
packages and their distribution tags have been verified. An API error is never
treated as evidence that a release is absent.

### Checking release automation

`pnpm test:release` checks version rules and exercises the CI helpers with real
Git, git-cliff, pnpm, npm and gh commands against temporary repositories and a
localhost registry/API. It never publishes to npm. Workflow assertions cover
the shared queue, checked source, permissions and artifact handoff.

These checks do not prove the App installation or npm OIDC configuration.
A maintainer still needs to verify those in GitHub on the first release.

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
