# 3. Design-system AI skills live in this repo, installed through team-skills

**Date:** 2026-08-06
**Status:** Accepted — amended 2026-08-06 to move the component-authoring skill
to a private repository (see [Amendment](#amendment-the-component-authoring-skill-is-not-hosted-here)).

## Context

The design system is gaining four AI skills — design-system compliance,
accessibility review, design critique, and component authoring — planned in
[docs/plans/ai-skills.md](../plans/ai-skills.md). They needed a home.

`govtech-bb/team-skills` already exists as the team's Claude Code plugin
marketplace. It holds one plugin (`bb`) with five workflow skills invoked as
`/bb:<name>`, and most of the team has already added it. The obvious question
was whether the new skills should simply go there, giving one repository for
every skill the team owns.

That framing conflates two separate things:

- **Where a skill is installed from** — the front door users type a command at.
- **Where a skill's text is authored** — the repository whose CI and review
  process govern its content.

Consolidating the first is plainly good. Consolidating the second trades
against a different property: three of these four skills assert facts about
the design system's _current state_ — component names, `govbb-` class names,
`--govbb-*` token names, which components require `data-govbb-module`. Those
facts change in this repository.

## Decision

The skills are authored here and catalogued there.

- Skill sources live at `skills/` in this repository, with
  `skills/.claude-plugin/plugin.json` making that directory the plugin root.
  Because the plugin root is itself the skills directory, default discovery
  (which looks for `<plugin root>/skills/`) finds nothing, so the manifest
  declares `"skills": ["./"]`. Use the `["./"]` form, not `"."`: before Claude
  Code v2.1.221 a bare `"."` fails manifest validation and the plugin does not
  load at all, so an installer on an older version gets nothing and is told
  nothing. Verified with `claude plugin details`, which reports
  `Skills (1) accessibility-review` with the field and `Skills (0)` without it.
- `team-skills/.claude-plugin/marketplace.json` gains a `govbb` entry whose
  source is `git-subdir` pointing at this repository, path `skills`. Claude Code
  supports a plugin source in a different repository from the marketplace, and
  `git-subdir` clones sparsely, so listing a monorepo subdirectory costs the
  installer nothing.
- **The `url` must be the full HTTPS clone URL**
  (`https://github.com/govtech-bb/govbb-design-system.git`), not the
  `owner/repo` shorthand. The shorthand resolves to an SSH clone, which fails
  with `Host key verification failed` for anyone without GitHub SSH keys
  configured — that is, for most people. Found by installing from a temporary
  marketplace pinned to the branch before opening the `team-skills` pull
  request.
- Neither the marketplace entry nor `plugin.json` declares a `version`. For
  git-based sources every commit then counts as a new version, so merging to
  `main` here reaches installed users at their next startup with no change to
  `team-skills`. A declared `version` would silently freeze updates for
  existing users until it was bumped.
- `team-skills` remains the single front door for GovTech. Service teams
  outside GovTech install straight from this repository with the skills CLI
  (`npx skills add govtech-bb/govbb-design-system`), which needs no marketplace.
- The component-authoring skill is **not** hosted here. See the amendment
  below; the original decision placed it at `skills/new-component/` with
  `metadata.internal: true`, which the restriction requirement rules out.

## Why not author them in team-skills

Three mechanisms in the plan require the skill text and the component source
to sit in one checkout, and none of them survive the split:

- **The CI drift check** regenerates the component index and token reference
  from `packages/frontend/src/` and fails if the committed copies differ. It
  must see both. Across repositories it becomes a scheduled bot opening pull
  requests, and it is only eventually consistent — there is always a window in
  which the skill is wrong.
- **Same-pull-request updates.** Renaming a token has to correct the skill in
  the review that renames it, or the correction does not happen.
- **Site generation.** `/ai-skills/` pages are built by globbing
  `skills/*/SKILL.md`, so published guidance cannot drift from installed
  guidance. Sourcing them from another repository makes the documentation site
  build depend on that repository's availability.

The two directions are also asymmetric in cost. Pointing `team-skills` at this
repository is roughly eight lines of JSON using a documented source type.
Pointing this repository at `team-skills` means a submodule or build-time fetch
in the Amplify build plus a cross-repo sync bot — infrastructure we would own
indefinitely.

## Why not split the skills by coupling

Coupling is not uniform. Component authoring scaffolds files into
`packages/frontend/` and teaches this repository's conventions; compliance maps
interfaces onto the current inventory and is more tightly bound still — it
tracks what changes, where component authoring tracks what stays. (The
amendment below separates component authoring anyway, for reasons unrelated to
coupling, and explains why that costs less than it would for the others.)
Accessibility
review is mixed — WCAG criteria are universal, token contrast and component
contracts are not. Design critique is barely coupled at all: personas,
viewports and a report template, naming no `govbb-` class. On coupling alone,
critique belongs in `team-skills`.

Two things outweigh that. The four skills cross-reference each other — critique
defers conformance verdicts to accessibility review, compliance routes gaps to
component authoring — and they publish as one set to one page on one site.
Splitting them means contributors must know which repository holds which skill,
for a boundary that would sit awkwardly through the middle of accessibility
review.

The failure modes are also unequal. A skill that drifts from the team's house
writing style is mildly annoying. A skill that confidently names a token
renamed last week generates broken code and erodes trust in the design system
itself. The arrangement that guards against the second is the right one.

## Consequences

- Existing `team-skills` users run `/plugin marketplace update team-skills`
  then `/plugin install govbb@team-skills` once. Automatic updates cover new
  plugin versions, not the appearance of a new plugin.
- Two namespaces at the point of use: `/bb:` for workflow skills, `/govbb:` for
  design-system skills. This makes the catalogue/source boundary visible.
- `skills/` becomes part of a published contract. Moving or renaming it breaks
  the `git-subdir` pointer, so the path is noted in `CONTRIBUTING.md`.
- Contributing a skill here carries this repository's ceremony — Node 24, pnpm,
  commitlint, Lefthook — against plain markdown in `team-skills`. That is a
  real barrier for designers. It is moot for component authoring, whose users
  must work in this repository regardless, but it is a genuine cost for
  critique and should be revisited if it deters contribution.
- The `govbb` plugin ships three skills, not four. Component authoring is
  distributed separately under the amendment below.

## Amendment: the component-authoring skill is not hosted here

**Date:** 2026-08-06

The original decision assumed "not published on the site" meant _unadvertised_.
The requirement is stronger: only the design team should have the
component-authoring skill, and nobody else at GovTech.

That is incompatible with hosting it in this repository. `govbb-design-system`
is **public**. `metadata.internal: true` hides a skill from skills-CLI
discovery; it is not access control, and anyone can read the file on GitHub.
Shipping it inside the `govbb` plugin is also ruled out, because a plugin
installs as one unit — every `govbb@team-skills` user would receive it.

The skill therefore moves to a **private repository**,
`govtech-bb/design-team-skills`, carrying its own `marketplace.json`. Designers
add that marketplace directly; access is GitHub repository permission on a
design-team group, which is enforceable and auditable. Claude Code uses the
operator's existing git credential helpers for `/plugin marketplace add`,
`/plugin install` and `/plugin update`, so no additional infrastructure is
required.

Two operational notes, both documented upstream:

- Background auto-updates disable git credential helpers for their `git pull`,
  so private marketplaces over HTTPS can fail to refresh intermittently. SSH
  remotes are unaffected when a key is loaded in `ssh-agent`. Prefer SSH, and
  set `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE=1` so a failed refresh
  keeps the working clone instead of re-cloning.
- On a Team or Enterprise plan, distributing through _Organization settings >
  Plugins_ is the better long-term path: organization sync packages the plugin,
  so designers never need repository access at all, and managed settings can
  assign the marketplace to a user group. Adopt this if the plan tier allows.

**The drift cost of moving it out is lower than for the other three.** Its
references describe _conventions_ — the `govbb-` BEM prefix, the cva wrapper
pattern, commit scoping, the publication checklist — which change rarely. The
volatile facts, the component inventory and the token ramp, are what the
compliance skill needs, and that skill stays here with the CI drift check.
Component authoring is coupled to this repository's stable habits rather than
its changing contents.

**What this does not achieve.** Restricting the skill does not restrict the
ability to create components. Anyone can hand-write CSS and open a pull
request. The enforceable gate on component sprawl is review on
`packages/frontend/src/components/`, not distribution of a skill file. The
restriction expresses ownership and keeps the design team's working method
theirs; it should not be mistaken for a control.
