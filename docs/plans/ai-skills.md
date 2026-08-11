# Plan: GovBB Design System AI skills

Plan for building four AI skills for the GovBB Design System, deciding where
they live, how they are shared, and how they are published on
[design-system.service.alpha.gov.bb](https://design-system.service.alpha.gov.bb/).

Status: **agreed in outline; ready for Phase 0**. All four decisions in
[Decisions](#2-decisions) were settled on 2026-08-06;
A and B are recorded in
[ADR 0003](../decisions/0003-design-system-skills-live-here-installed-via-team-skills.md).

Phase 0 now exists to *prove* three of them rather than debate them: the
two install routes (A), the Claude plan tier that decides how the private
design-team marketplace is distributed (B), and concurrent isolated browser
sessions for parallel personas (D).

---

## 1. What already exists

Findings from the current repos, so the plan builds on them rather than
duplicating them.

**`govtech-bb/team-skills`** — a Claude Code *plugin marketplace*. One plugin
(`bb`) holds five workflow skills (`dev-plan`, `dev-start`, `dev-finish`,
`standup`, `govtech-service-content`), invoked as `/bb:<name>`. Conventions
worth inheriting: `<discipline>-<verb>` naming, `references/` + `assets/`
sibling files, a `description` that ends with an explicit invocation phrase,
and a review checklist in `CONTRIBUTING.md` ("content reads as *instructions to
Claude*, not documentation *about* Claude").

**`vercel-labs/skills`** — a CLI (`npx skills add <owner/repo>`) rather than a
competing format. Two things make it a good fit here:

- It discovers `SKILL.md` files in a `skills/` container up to three levels
  deep, so a flat `skills/<name>/SKILL.md` layout works with no manifest.
- It **also** reads `.claude-plugin/marketplace.json`. `team-skills` is already
  installable via `npx skills add govtech-bb/team-skills` with no changes. The
  two mechanisms are additive, not a migration.
- `metadata.internal: true` hides a skill from normal discovery unless the
  installer sets `INSTALL_INTERNAL_SKILLS=1`. Noted for completeness, but
  **not** how the design-team-only skill is restricted — that flag is a
  discoverability control, and this repo is public. See
  [Decision B](#decision-b--what-not-published-on-the-site-means-for-the-internal-skill).

**This repo (`govbb-design-system`)** — more ready for this than expected:

- 26 components under `packages/frontend/src/components/`, guidance pages in
  `apps/site/src/content/components/`, 13 patterns, 12 templates, 6 styles
  pages (plus one nested child page, `typography/lists`).
- **Every content page already has a raw-markdown twin route** —
  `src/pages/*/[slug].md.ts`, described in-source as "for copying into an AI".
  So `/components/button.md`, `/patterns/forms.md` etc. are already
  machine-readable canonical guidance. This is the single most useful existing
  asset: skills can cite URLs instead of restating guidance.
- A `/ai-skills/` page already exists (in `secondaryNav`) with interim
  placeholder copy: *"Dedicated AI guidance is still being developed… This page
  will expand when Government of Barbados guidance for specific AI tools and
  workflows is approved."* We are filling a slot that was designed for this.
- Enforced conventions the skills must encode: `govbb-`-prefixed BEM classes,
  `--govbb-*` custom properties (Stylelint-enforced), Conventional Commits with
  **component name as scope**, git-cliff-generated changelog (never
  hand-edited), cva for React variant wrappers, no Sass/Tailwind/StyleX.

**Two gaps to close as part of this work:**

1. **No dedicated accessibility page.** The standard itself *is* already
   stated — `documentation/using-the-design-system.md` commits services to
   "meet [WCAG 2.2 AA]" under **Standards**, and its **How accessibility
   reviews work** section already draws the distinction the review skill
   depends on (component-level evidence, not a WCAG certificate for a whole
   service; every team remains responsible for its own journey). What is
   missing is that commitment expanded into citable, checkable criteria on a
   page of its own. So [Decision C](#decision-c--the-accessibility-standard)
   is a *ratify and elaborate* job, not a write-from-scratch one — lower risk
   than it first appears, but still ahead of the skill.
2. **No component maturity/status field.** The site README promises components
   with "recorded maturity and review status", but the `components` collection
   schema has no such field. The compliance skill needs it to know whether to
   recommend a component. Small schema addition; worth doing in Phase 1.

---

## 2. Decisions

All four were settled on 2026-08-06. Each section keeps the reasoning that led
there, so the trade-offs are not lost — including the ones deliberately
accepted.

### Decision A — where the skills live

> **Settled 2026-08-06 — accepted as recommended.** Recorded in
> [ADR 0003](../decisions/0003-design-system-skills-live-here-installed-via-team-skills.md),
> which also records the two rejected alternatives (author everything in
> `team-skills`; split the skills by how tightly each is coupled to the design
> system). The rest of this section is the reasoning that led there.

**Recommendation: host in this repo, catalogue in `team-skills`.** The skills
live at `skills/` here; the `team-skills` marketplace lists them as a plugin
whose source points back at this repo. Authoring happens where the truth is;
installation stays a single front door.

This is not a copy-and-sync arrangement. Claude Code's marketplace format
supports it directly — verified against the
[plugin marketplace docs](https://code.claude.com/docs/en/plugin-marketplaces):

- A **plugin source may be a different repo from the marketplace source.** The
  docs are explicit: *"a marketplace hosted at `acme-corp/plugin-catalog` can
  list a plugin fetched from `acme-corp/code-formatter`. The marketplace source
  and plugin source point to different repositories and are pinned
  independently."*
- The **`git-subdir` source type** takes `url` + `path` and *"clones sparsely to
  minimize bandwidth for monorepos"* — purpose-built for this case, and it
  removes the monorepo-fetch-size worry entirely.
- **Omitting `version`** means *"every new commit is treated as a new version…
  the simplest setup for internal or actively-developed plugins."* So merging to
  `main` here reaches every installed user at their next startup, with no change
  to `team-skills`. The pointer is live; there is nothing to keep in sync.

So `team-skills/.claude-plugin/marketplace.json` gains a second entry alongside
`bb`:

```json
{
  "name": "team-skills",
  "owner": { "name": "GovTech Barbados" },
  "plugins": [
    {
      "name": "bb",
      "source": "./bb",
      "description": "Shared skills for GovTech Barbados, namespaced by discipline (dev-*, ops-*, sec-*)."
    },
    {
      "name": "govbb",
      "source": {
        "source": "git-subdir",
        "url": "govtech-bb/govbb-design-system",
        "path": "skills"
      },
      "description": "Build with the GovBB Design System — compliance, accessibility review, design critique and component authoring.",
      "homepage": "https://design-system.service.alpha.gov.bb/ai-skills/"
    }
  ]
}
```

Do **not** set `version` in either the marketplace entry or the plugin's
`plugin.json` — the commit SHA is the version, and the docs warn that a stale
declared `version` silently blocks updates for existing users.

Why this direction and not the reverse:

| Repo | Role | Changes when |
|---|---|---|
| `team-skills` | **Catalogue** — one marketplace the whole team adds. Holds workflow skills (`bb`) and points at design-system skills (`govbb`) | Team practice changes; a new plugin is added to the catalogue |
| `govbb-design-system` | **Source** — the design-system skills, versioned with the system they describe | The design system changes |

Three of the four skills are artifacts of the design system's *current state*.
When a component is added, a token renamed or a convention changed, the skill
has to change in the **same PR** — otherwise it silently starts giving wrong
advice, which is worse than giving none. That is only enforceable where the CI
drift check (§5) can see both the components and the skill references. Hosting
here also lets the site build generate the AI skills pages from the same
`SKILL.md` files, so published guidance cannot drift from installed guidance.

**The reverse arrangement — skill text in `team-skills`, linked from here — is
worse**, and it is worth being clear why: it puts the skill content in a repo
with no CI knowledge of the design system, so the generated component index and
token reference would have to be synced across repos on every component change.
That reintroduces exactly the drift this plan is built to prevent.

Remaining trade-offs, accepted:

- *Existing `team-skills` users must run `/plugin marketplace update` then
  `/plugin install govbb@team-skills` once.* Auto-update covers plugin versions,
  not the appearance of a new plugin. One line in the announcement.
- *Design-team contributors need write access to the design-system repo* to
  change the three skills hosted here. Their own `new-component` skill lives
  elsewhere (Decision B), but the components it creates still land in this
  repo, so that access is needed regardless.
- *Two namespaces:* `/bb:dev-plan` for workflow, `/govbb:accessibility-review`
  for the design system. Self-documenting, and it makes the boundary in the
  table above visible at the point of use.

Public installation is unaffected and needs no marketplace at all — service
teams outside GovTech use the skills CLI against this repo directly
(see §6), which is what makes the site page worth publishing.

**Sub-question for the Phase 0 spike (layout).** Two consumers want slightly
different shapes from the same directory: the skills CLI discovers
`skills/<name>/SKILL.md` in a root `skills/` container, while a Claude Code
plugin root is a directory containing `.claude-plugin/plugin.json`. Recommended
layout satisfies both by making `skills/` itself the plugin root:

```
skills/
  .claude-plugin/plugin.json     ← { "name": "govbb", "skills": "." }
  design-system-compliance/SKILL.md
  accessibility-review/SKILL.md
  ...
```

`skills` is a documented plugin component field ("custom paths to skill
directories containing `<name>/SKILL.md`"), so `"skills": "."` should resolve
the skill directories at the plugin root. Confirm in Phase 0 that (a) this
resolves as expected and (b) the skills CLI is untroubled by the co-located
`.claude-plugin/` manifest. If either misbehaves, fall back to nesting
(`skills/skills/<name>/SKILL.md`, plugin root `skills/`), which both tools
handle at the cost of an ugly path.

### Decision B — what "not published on the site" means for the internal skill

> **Settled 2026-08-06 — genuinely restricted, not merely unadvertised.** Only
> the design team gets the component-authoring skill; nobody else at GovTech.
> Recorded as an amendment to
> [ADR 0003](../decisions/0003-design-system-skills-live-here-installed-via-team-skills.md).

This is the stronger of the two readings that were open, and it changes where
the skill lives.

**Why it cannot stay in this repo.** `govbb-design-system` is **public**.
`metadata.internal: true` hides a skill from skills-CLI discovery; it is not
access control, and anyone can read the file on GitHub. Shipping it inside the
`govbb` plugin is separately ruled out, because a plugin installs as one unit —
every `govbb@team-skills` user would receive it.

**Where it goes instead.** A private repository,
`govtech-bb/design-team-skills`, with its own `marketplace.json`. Designers add
that marketplace directly:

```
/plugin marketplace add govtech-bb/design-team-skills
/plugin install design@design-team-skills
```

Access control is GitHub repository permission on a design-team group.
Claude Code uses the operator's existing git credential helpers for
`/plugin marketplace add`, `/plugin install` and `/plugin update`, so a private
source needs no extra infrastructure — but note two operational wrinkles:

- Background auto-updates disable credential helpers for their `git pull`, so
  private marketplaces over HTTPS refresh unreliably. SSH remotes are fine when
  a key is in `ssh-agent`. Prefer SSH and set
  `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE=1`.
- On a Team or Enterprise plan, *Organization settings > Plugins* is the better
  path — organization sync packages the plugin, so designers need no repository
  access, and managed settings can scope the marketplace to a user group.
  **Open question for Phase 0: confirm the plan tier.**

**What this does not achieve.** Restricting the skill does not restrict the
ability to create components — anyone can hand-write CSS and open a PR. The
enforceable gate on component sprawl is review on
`packages/frontend/src/components/`. The restriction expresses ownership; it is
not a control, and the plan should not lean on it as one.

**Consequence for the rest of the plan.** The `govbb` plugin now ships three
skills. Sections 3, 6, 7 and 8 are written accordingly: `new-component` is out
of `skills/`, out of the site's `skills` collection, and out of both public
install routes.

### Decision C — the accessibility standard

> **Settled 2026-08-06.** Start from the commitment already in the repo, then
> expand it in Phase 2. **There is no wider Government of Barbados
> accessibility policy** to defer to.

`using-the-design-system.md` already commits every official service to WCAG 2.2
AA under **Standards**. That stays as the target. Phase 2 expands it into a
dedicated `documentation/accessibility.md` the skill can cite criterion by
criterion, and the review skill cites that page rather than inventing a target.

**The consequence of there being no existing policy: this page becomes the de
facto standard for Government of Barbados services.** Not by accident now —
deliberately — but that raises the bar for how it is written and who agrees to
it:

- **Scope the claim honestly.** Write it as *the conformance target for
  services built with this design system*, which is a commitment GovTech can
  actually make, rather than as national policy, which it cannot. A real
  government-wide policy should be able to supersede or absorb the page later
  without contradicting it.
- **Get it signed off** by someone with authority to make that commitment on
  behalf of GovTech before it publishes. It is the first written accessibility
  standard for GoB digital services, and other MDAs may start citing it.
  Action for Phase 2, not a blocker for drafting.
- **Expect it to outgrow this plan.** It will be read by people who never touch
  an AI skill. Write it as a standards page that a review skill happens to
  cite, not as skill documentation.

**v1 remit: WCAG technical conformance only.** No accessibility statements, no
procurement obligations. Those are policy instruments and need the sign-off
route above before the design system goes near them.

### Decision D — browser tooling for the critique skill

> **Settled 2026-08-06 — Playwright MCP**, adopted in Phase 0 and documented as
> a prerequisite on the skill page.

The design-critique skill only earns its keep if the personas **actually use
the prototype**. Without a browser it degenerates into code review in a funny
voice, which is worse than no skill because it reads as user evidence.

```sh
claude mcp add playwright npx @playwright/mcp@latest
```

**What it gives the personas.** `browser_resize` for viewport-bound personas;
`browser_snapshot`, which returns a structured **accessibility tree rather than
pixels**, so the screen-reader persona reasons over what is actually exposed to
assistive technology; `browser_network_state_set` for offline mode; and
`browser_route` to mock or block requests matching a URL pattern.

Two limits found when checking the tool surface, both of which change the skill
design rather than block it:

**1. There is no bandwidth or CPU throttling.** Offline mode and request
routing exist; a "slow 3G" profile does not. The low-bandwidth persona
therefore cannot be implemented literally, and must not pretend to be. Reframed
as a **degraded-connection persona** that tests what *is* reachable: block the
JS bundle with `browser_route`, or go offline with
`browser_network_state_set`, and check whether the page still works. That is a
better fit for this system anyway — the design system is built on progressive
enhancement (`data-govbb-module` + `initAll()`) and already ships a
[`javascript-disabled`](../../apps/site/src/content/templates/javascript-disabled.md)
template, so "does it degrade?" is a first-class question with a documented
expected answer. Genuine performance-under-load testing stays out of scope and
is named as such on the skill page.

**2. Concurrent sessions conflict.** The upstream docs are explicit that
concurrent MCP clients sharing a workspace collide unless run with `--isolated`
or given distinct `--user-data-dir` values. The plan runs six personas **in
parallel**, so this is load-bearing: parallel personas must each get an
isolated browser context, or they will interfere and produce findings that are
artefacts of the harness. Prove this in the Phase 0 spike with two concurrent
sessions before building six.

Alternatives not taken: chrome-devtools MCP (would cover throttling, but a
second browser dependency for one persona), and Playwright scripts shipped in
the skill (this repo already runs Chromium for `pnpm storybook:test`, but that
harness is scoped to this repo, and the skill must drive arbitrary external
prototypes).

---

## 3. Proposed layout

```
govbb-design-system/
  skills/
    .claude-plugin/
      plugin.json                 ← { "name": "govbb", "skills": "." }; no "version"
    design-system-compliance/
      SKILL.md
      references/
        component-index.md          ← GENERATED (see §5)
        token-reference.md          ← GENERATED
        conversion-checklist.md
        anti-patterns.md
    accessibility-review/
      SKILL.md
      references/
        wcag-22-aa.md
        component-a11y-contracts.md
      scripts/
        axe-scan.mjs
    design-critique/
      SKILL.md
      personas/
        first-time-older-user.md
        confident-repeat-user.md
        small-screen-mobile-user.md
        low-bandwidth-user.md
        screen-reader-user.md
        rushed-interrupted-user.md
      references/
        critique-report-template.md
        how-to-read-a-critique.md
  apps/site/src/
    content.config.ts               ← + `skills` collection reading ../../skills
    pages/ai-skills/
      index.astro                   ← rewritten: install + skill table
      [slug].astro                  ← generated per-skill page
      [slug].md.ts                  ← raw SKILL.md twin, matching existing pattern
```

And separately, in the **private** `govtech-bb/design-team-skills` repo
(Decision B) — same skill layout, its own marketplace:

```
design-team-skills/                 ← PRIVATE; access = design-team GitHub group
  .claude-plugin/
    marketplace.json                ← { "name": "design-team-skills", … }
  design/
    .claude-plugin/plugin.json      ← { "name": "design", "skills": "./skills" }
    skills/
      new-component/
        SKILL.md
        references/
          component-anatomy.md
          css-conventions.md
          react-wrapper-pattern.md
          publication-checklist.md
        assets/
          component.css.template
          component.stories.tsx.template
          component-page.md.template
```

A relative-path plugin source (`"./design"`) rather than `git-subdir`, since
marketplace and plugin share a repo here. That also keeps the door open to
Organization-settings distribution later, which requires plugin folders inside
the marketplace repository.

### Frontmatter contract

The skills CLI requires only `name` and `description`. Site-facing fields go
under `metadata`, which the CLI ignores:

```yaml
---
name: design-system-compliance
description: >
  Convert an existing prototype to the GovBB Design System, or build a new
  prototype with it from the start. Use when a prototype needs to adopt GovBB
  components, tokens and markup conventions, or when someone asks whether an
  interface is design-system compliant.
metadata:
  title: Design system compliance
  audience: public
  status: experimental        # experimental | supported
  requires: []                # e.g. ['playwright-mcp']
---
```

`status` mirrors the maturity field being added to the components collection, so
skills and components use one vocabulary.

---

## 4. The four skills

Each entry below is the brief a skill author works from. "Done" means: written,
run against the listed fixtures, and reviewed against the `team-skills`
review checklist.

### 4.1 `design-system-compliance` — public

**Job.** Two directions of the same thing: (a) convert an existing prototype to
GovBB, (b) build a new prototype in GovBB from the start.

**Approach.** The skill should not restate component guidance — it should route
to it. Core loop:

1. **Detect the target.** HTML/server-rendered (`@govtech-bb/frontend`, classes
   + `data-govbb-module` + `initAll()`) vs React (`@govtech-bb/react` wrappers).
   The install and idioms differ; get this wrong and everything downstream is
   wrong.
2. **Inventory the prototype's UI** against `references/component-index.md`.
   Classify every element: *has a component* / *has a pattern or template* /
   *genuinely novel*.
3. **Convert in dependency order** — page scaffold and layout, then furniture
   (header, footer, official banner, skip link), then form elements, then
   bespoke leftovers. Doing furniture last means re-doing the layout.
4. **Replace ad-hoc CSS with tokens.** Flag every literal colour, spacing value
   and font declaration; map to `--govbb-*`. **Remove utility-class frameworks
   rather than bridging to them** — a converted prototype should be liftable
   into alpha with a little more work, and Tailwind classes left behind are
   effort handed to whoever does that lift, plus a second spacing and colour
   system competing with the design system's own. Where no design-system
   equivalent exists, plain CSS against tokens beats a bridged utility class.

   *Note the tension to resolve:* `documentation/using-the-design-system.md`
   currently tells Tailwind applications they can reference tokens through
   arbitrary values (`bg-[var(--govbb-color-brand)]`). That is reasonable advice
   for an existing Tailwind app adopting the tokens, and wrong as an end state
   for a prototype heading to alpha. Either scope the published note to
   "existing applications" or drop it, so the site and the skill do not give
   opposite advice.
5. **Report what could not be converted** and route it: a pattern gap → design
   log entry; a missing component → the `new-component` skill; a deliberate
   deviation → recorded, not silently kept.

**Hard rules to encode** (`references/anti-patterns.md`): never invent
`govbb-*` classes (Stylelint will reject them, and they imply system support
that doesn't exist); never restyle a component's internals from service CSS;
never add Sass/Tailwind/StyleX to the design system itself; use published
components and patterns over reinvention.

**Scope.** This skill makes an interface *look and behave like GovBB* wherever
it lives. It does not move code between repositories or adopt any platform's
routing and file conventions — that is a separate concern, and deliberately out
of scope here.

**Fixtures for validation.** `gig-worker-protection-prototype`,
`pension-calculator`, `self-employed-nis` — three real prototypes already on
disk, of different shapes.

**Done when.** Run against all three fixtures; each produces a converted branch
that passes `pnpm lint`, plus an honest list of unconverted items.

### 4.2 `accessibility-review` — public

**Job.** Review an interface against WCAG 2.2 AA and GovBB's own accessibility
contracts.

**Approach.** Tooling first, judgement second — and never blur the two. The
skill's most important discipline is separating *machine-verified* findings from
*model-judged* findings, because an LLM asserting "contrast passes" without
computing it is exactly the failure mode that makes accessibility reviews
worthless.

1. **Automated pass.** Run axe-core (`scripts/axe-scan.mjs`) over the pages.
   Report violations with rule ID and node. This repo already runs axe via
   `pnpm storybook:test`, so the harness is proven.
2. **Structural pass** (checkable from source): heading order, landmark
   regions, label/control association, `lang`, focus order, error-summary
   linkage, `fieldset`/`legend` for grouped inputs, skip link presence.
3. **Contrast pass** — compute ratios from the actual token values in
   `tokens.css`. Compute, don't estimate.
4. **Component-contract pass.** `references/component-a11y-contracts.md`
   records what each GovBB component guarantees *and what the consumer must
   still do* (e.g. Header/FileUpload/NumberInput need
   `data-govbb-module` + `initAll()` or they degrade; a checkbox group needs a
   `fieldset`/`legend`). Most real failures are consumers using a component
   correctly-looking but incorrectly-wired.
5. **Keyboard-and-AT pass.** Tab order, focus visibility against
   `focus.css`, no keyboard traps. Flag anything needing a real screen-reader
   test as *needs manual verification* — do not claim to have tested it.
6. **Report** grouped by WCAG criterion, each finding tagged
   `automated` / `structural` / `computed` / `judgement` / `needs-manual-test`.

**Explicit non-goal.** No "score". A percentage invites treating AA as
negotiable.

**Done when.** Run against one known-good page (the design system's own
templates) and one deliberately broken fixture with seeded violations; catches
the seeded set with no false criterion attributions.

### 4.3 `design-critique` — public

**Job.** Spawn persona subagents that use a running prototype and report the
problems they hit.

**Approach.** Six personas, each pinned to a *real constraint* rather than a
personality, because a caricature produces caricatured findings. The user's
examples map on directly:

| Persona | Constraint being tested |
|---|---|
| First-time older user | Unfamiliar with the journey; smaller text target; low tolerance for jargon and for undoing mistakes |
| Confident repeat user | Speed and shortcuts; wants to skip explanation; will abandon on friction |
| Small-screen mobile user | 360×640 viewport (`browser_resize`); thumb reach; on-screen keyboard covering inputs |
| Degraded-connection user | JS bundle blocked via `browser_route`, or offline via `browser_network_state_set` — does the progressive-enhancement path hold? Compare against the `javascript-disabled` template |
| Screen-reader user | Non-visual traversal over the `browser_snapshot` accessibility tree: is state, error and label information exposed at all? |
| Rushed / interrupted user | Session interruption, partial completion, returning later |

**Mechanics.**

1. Start the prototype; confirm a reachable URL. If the prototype cannot be
   run, **stop** — do not critique from source and present it as user
   experience.
2. Spawn one subagent per persona, each with: the persona file, a viewport and
   network profile, a concrete task ("apply for X"), and the report template.
   Personas run in parallel and stay blind to each other, so overlap between
   their findings is signal about severity. **Each parallel persona needs its
   own isolated browser context** (`--isolated` or a distinct
   `--user-data-dir`) — concurrent sessions sharing a workspace collide, and
   collisions would surface as fake findings (see Decision D).
3. Each returns findings with: what they were trying to do, where they stalled,
   evidence (screenshot / URL / step), severity, and a suggested fix.
4. Synthesis pass: deduplicate, promote issues found by three or more personas,
   and separate **design-system problems** (route to a design log entry or
   component issue) from **this-service problems** (route to the team).

**Boundary with `accessibility-review`.** Critique reports *usability and
journey* problems; accessibility-review reports *conformance*. The
screen-reader persona will surface things that are also WCAG failures — the
critique names the experience and defers the conformance verdict to the other
skill. Say so in both skills.

**Honesty requirement.** Findings are model-simulated, not user research, and
the report template must say so at the top. This skill is a cheap
pre-research filter for obvious problems — it does not replace testing with
Barbadian users, and it must never be cited as if it did.

Two specific overclaims the template must guard against, both following from
Decision D:

- The screen-reader persona reads an **accessibility tree**, not a screen
  reader. It can show that a label or error is missing from the tree; it cannot
  tell you announcement order, live-region behaviour or verbosity. Findings
  route to *needs manual AT testing*, matching the accessibility skill's
  tagging.
- The degraded-connection persona tests **JS-blocked and offline**, not slow.
  It must not report "works fine on a slow connection", because nothing here
  measured that.

**Tooling.** Playwright MCP, per Decision D — with one isolated browser context
per parallel persona.

**Done when.** Run against one prototype with known usability problems from
real research (if any exist in the design log) and check whether it finds them.

### 4.4 `new-component` — design team only, private repo

Lives in `govtech-bb/design-team-skills` (private), **not** in this repo — see
[Decision B](#decision-b--what-not-published-on-the-site-means-for-the-internal-skill).
It is absent from the site, from the `govbb` plugin and from both public
install routes. Everything below still describes this repo's conventions,
because that is what the skill teaches; it simply ships from elsewhere.

**Job.** Create a genuinely novel component that looks, feels and behaves like
the rest of the system — and lands complete, not half-built.

**Approach.** Gate first, then scaffold.

1. **Justify it.** Search components, patterns and templates for an existing
   answer. Most "new component" requests are a composition
   (`govbb-link govbb-back-button` is the in-repo precedent) or a pattern.
   The skill should be willing to conclude *don't build this* — that is its
   highest-value output.
2. **Design from tokens.** Only `--govbb-*` semantic tokens. A new primitive
   token is a token-tier change and needs its own discussion, not a quiet
   addition inside a component PR.
3. **Scaffold the full set**, from `assets/` templates:
   - `packages/frontend/src/components/<name>/<name>.css` — `govbb-`-prefixed
     BEM; `@import` from `src/index.css`
   - demo markup in `packages/frontend/index.html`
   - PE module in `packages/frontend/index.js` if behavioural
   - React wrapper following the cva pattern in
     `packages/react/src/button/button.tsx`
   - typed story in `stories/components/`
   - guidance page in `apps/site/src/content/components/<name>.md` with
     `title`/`description`/`lede`/`group`. Live examples are **not** separate
     files: every ` ```html ` fence in that page renders as a preview, and a
     ` ```tsx ` fence immediately after one joins it as the React tab (see
     `apps/site/src/lib/example-blocks.ts`). So the guidance page and its
     examples are authored together, and the preview always renders the HTML —
     which is exactly what the React wrapper must emit.
   - sidebar entry in `apps/site/src/data/nav.ts`
4. **Accessibility from the start** — keyboard model, focus handling against
   `focus.css`, announced state — and a no-JS story for anything behavioural.
5. **Land it correctly.** Conventional Commit with the component name as scope
   (`feat(<name>): …`); subject written as a user-facing release note because
   git-cliff turns it into the changelog line; never hand-edit `CHANGELOG.md`;
   never `--no-verify`.
6. **Publication checklist** before PR: `pnpm lint`, `pnpm build`,
   `pnpm storybook:test`, both consumer targets rendering identical DOM.

**Why this comes after the public skills.** Building compliance and
accessibility-review forces us to write down the conventions this skill has to
teach. Doing it first means writing them twice.

**Done when.** A designer who has not written GovBB CSS before uses it to land
one real component end to end.

---

## 5. Keeping skills true: read the site, do not snapshot it

The main long-term failure mode is drift — a skill confidently naming a
component that was renamed, or missing one added last week.

**The authoring rule for all four skills:** a skill must not state anything that
is only true of the design system as it is today. Where a skill needs such a
fact, it does not record the fact — it tells the agent **where to resolve it from
the source of truth at run time**, and to do that on every run.

This is a hard rule rather than a preference, because stale facts in a skill do
not fail loudly. Nothing errors. The skill simply starts giving confident wrong
answers, and the review or conversion it produces looks exactly as authoritative
as a correct one. Every drift found so far has had the same shape — a design-system
*quantity* or *roster* written into prose — and the same fix: keep the durable
principle, resolve the quantity.

**The first attempt at this was wrong and is worth recording.** The
`design-system-compliance` skill originally shipped a generated
`component-index.md` and `token-reference.md`, rebuilt by a script with a CI
`--check` mode that failed on drift. It went stale three times during
development, each time the same way: a list derived by walking one source misses
whatever that source does not enumerate — BEM child classes (the regex excluded
underscores), layout and utility classes (outside the component directories), and
a component whose stylesheet had no guidance page. Each gap made the skill reject
a real class, because the skill treated the index as definitive.

**The fix is to hold no lists at all.** The site already publishes itself in a
machine-readable form, generated from the same source the components are:

- `/sitemap/` lists every page — discovery with no maintenance.
- Any page plus `.md` serves its raw markdown (`/components/button.md`).
- A component's `.md` page carries its canonical markup, so every class it
  exposes is in there, along with the guidance on when *not* to use it.

So the skills fetch. One request cannot be stale, and a skill that holds no
facts about the system needs no update when the system changes. The generated
files and their script were deleted.

### What a skill may state, and what it must resolve

Building `accessibility-review` sharpened the rule and exposed a second failure
mode, so both are recorded here for the two skills still to be written.

**The dangerous direction is exemptions, not omissions.** §5's compliance
example fails by *rejecting* something real — annoying, but visible: someone
argues back. A review skill fails the other way. Its most valuable instructions
are the ones saying "do not raise this, the design system already handles it",
because that is what stops it generating noise. Those instructions are
load-bearing, and the moment the underlying fact changes they invert into
*instructions to overlook a real failure* — silently, and with the authority of
the skill behind them. The first draft of `accessibility-review` contained five
such exemptions, including one that would have told reviewers to ignore a form
border that had dropped from 21:1 to below the 3:1 minimum.

So the test to apply when authoring is not "is this fact correct?" but **"if this
fact silently changed, what would the skill then tell someone to do?"** If the
answer is "clear something that now fails", it must be resolved at run time, not
stated.

**The line between statable and resolvable.** These are safe to write down, since
they do not move when the design system does:

- Requirements from external standards — WCAG criteria and thresholds, HTML and
  ARIA semantics, native element behaviour.
- Method, ordering and reporting discipline — how to establish what is testable,
  how to tag evidence, what not to claim, the report structure.
- Judgement about what matters and why.

These must be resolved at run time, every time:

- Which components, patterns, templates or tokens exist, and what they are called.
- Which components need JavaScript wiring, and what each one guarantees.
- Any numeric value from the system — a token's colour, a size, a ratio, a spacing
  step.
- Anything the site's own documentation is the contract for. Point at the page,
  including its `.md` twin, and say to check the service against what it currently
  says rather than against a summary.

**Structure reference material by kind, not by component name.** `component-contracts.md`
was originally organised per component and had to be rewritten, because a
per-component file is a roster and rosters churn. Organised by *kind of control* —
anything that collects a value, a group of related controls, an error on a
control, anything hand-built rather than native — the same guidance survives
components being added and renamed, and it applies to a novel component on its
first day.

**Sometimes the repo is not the source of truth either.** Sizes are declared in
`rem`, so the rendered pixel value depends on root font size, user zoom and any
local override — which decides which WCAG contrast threshold applies. Reading the
token is not enough; the running page is the authority. Where that is true, say
so, and name the mechanism (`getComputedStyle`).

**A cache is allowed if it is labelled as one.** Precomputed contrast ratios are
genuinely useful and expensive to regenerate by hand, so `accessibility-review`
keeps a table — but the file states that the script is the authority and the table
is a snapshot, and requires re-derivation before *clearing* any concern. A cache
that names its authority is safe; one that reads as a clearance is not.

**Tools should announce their assumptions.** `contrast.mjs` defaults to the
stricter threshold when no text size is given and says in its output that it
assumed rather than measured. Pushing the assumption into the tool's output beats
documenting it, because the reviewer sees it at the moment it matters.

**Skills must not carry defect state.** A note recording that some component's
documentation is incomplete rots by design: when someone fixes it, nothing closes
the note, and it becomes a false accusation the skill keeps repeating. Defects go
to issues; skills carry method.

### Three small site changes would close the remaining gaps

Worth doing because they help every AI tool, not just these skills — which is
what `/ai-skills/` is for:

1. **Publish `/llms.txt`.** The site has no machine-readable index at all —
   no `llms.txt`, no `sitemap.xml`, no section `index.md`. Discovery currently
   means parsing the `/sitemap/` HTML. One Astro route fixes it.
2. **Include generated tables in the `.md` twins.** `/styles/tokens.md` carries
   the prose but not the values, because the tables are generated into the
   rendered HTML at build time. A crawler can read token *names* but not what
   they resolve to. Emitting the tables into the markdown body — or adding
   `/styles/tokens.json` — would fix the one thing the skill still cannot get
   cleanly.
3. **Publish per-component spacing behaviour.** Components differ in whether
   they own a block margin, and it decides whether a page needs service CSS for
   rhythm. It is not documented anywhere, so it is the only fact the skill still
   keeps in a hand-maintained file.

Until (2) and (3) land, the skill fetches `/styles/tokens/` as HTML for values
and carries one source-derived file for spacing, which says plainly that it can
drift.

## 5a. Findings from validating the skill against prototypes

The compliance skill was validated by building three prototypes with it — a
single-question status checker, a twelve-page multi-step application, and a
content-led guidance hub. The prototypes were throwaway and have been deleted;
these are the findings worth keeping. Each is a small, separable piece of work
for the design system rather than the skill.

### Defects

1. **`packages/frontend/layout.html` references a non-existent asset.** Two
   occurrences of `/assets/images/govbb-creast.svg` (transposed) where the file
   is `govbb-crest.svg`, so the demo page's crest images are broken.
2. **The layout demo has no skip link.** `layout.html` reads as the canonical
   page shell, so anyone copying it starts a service without one.
3. **`summary-section` has a stylesheet but no guidance page.** It ships
   `govbb-summary-section`, `__header` and `__title`, its markup appears on the
   Summary list page, and the check-answers pattern depends on it — but it has no
   page of its own and no entry in the component navigation. It is the only
   component in this position across all 26 stylesheets. Either give it a page or
   document explicitly that it belongs to Summary list.

### Gaps in the system

4. **Three components opt out of the system's own rhythm strategy.**
   `layout.css` states that "content margins own that rhythm", and `base.css`
   implements it — but `govbb-list`, `govbb-summary-list` and
   `govbb-service-list` set `margin: 0`, and most other components declare no
   margin at all. Every service that composes a heading with a list or a call to
   action therefore writes the same few rules. Across three prototypes sharing no
   code, each needed its own version. Two plausible answers: spacing utilities in
   the GOV.UK Frontend style, or an opinionated prose wrapper that spaces its
   children.
5. **The base block margin does not scale with the type ramp.** A flat 16px
   follows an 80px `govbb-text-display` heading and a 12px caption alike, so
   large type reads as crowded. This is a property of the base layer rather than
   any component, and worth keeping separate from item 4 when deciding what to
   change.

   Two smaller documentation defects found while verifying the above:
   `/styles/layout.md` claims a `-from-desktop` variant of the `full` column
   which does not exist, and `.govbb-table` is easily misread as owning a bottom
   margin when the 16px actually sits on `.govbb-table__caption`.
6. **No general status tag component — but a tag treatment already exists.**
   Any service showing state (an application under review, a licence expiring, a
   claim paused) has no way to give that state visual weight; in the
   status-checker prototype the status ended up as a Summary list value, styled
   identically to the dates beside it. Note though that `govbb-service-list__tag`
   exists and is documented as an optional tag per item, so the question is
   whether to **generalise that treatment** rather than whether to invent
   something. GOV.UK has a Tag component; this looks unruled-on rather than
   ruled out.
7. **No progress or timeline component.** May well be a deliberate omission in
   the one-thing-per-page tradition — worth a design log entry recording which,
   so the next team does not re-ask.

### Found while testing the skill against prototypes

9. **No `[hidden]` reset in `base.css`, while `.govbb-error-message` sets
   `display: block`.** An author-stylesheet class beats the user-agent `[hidden]`
   rule, so a service that toggles inline errors with the `hidden` attribute gets
   permanently visible error messages. Any team using `hidden` for conditional
   content hits this; a one-line `:where([hidden]) { display: none }` in
   `base.css` would close it.
10. **`.govbb-error-summary__link` is styled only via the compound selector
    `.govbb-link.govbb-error-summary__link`.** Markup carrying just the `__link`
    class renders unstyled, and no existence check catches it, because the name
    genuinely is in the stylesheet. It is the only compound selector of its kind
    in the system, which is what makes it easy to miss. Either style the single
    class too, or keep the guidance page's markup as the only thing anyone copies.
11. **A stale `dist/govbb.css` at the repo root** (3 July, with pre-rename
    `govbb-btn` classes) sits alongside the current
    `packages/frontend/dist/govbb.css`. It is gitignored, so local cruft rather
    than a shipped defect, but it is a trap for anyone auditing class names
    against "the build".

### Publishing defect — the documented install gives teams the wrong package

12. **`latest` on npm points at a superseded, architecturally different
    package.** `npm view @govtech-bb/react dist-tags` returns
    `latest: 1.0.0-alpha.16` and `alpha: 1.0.0-alpha.21`; `@govtech-bb/frontend`
    is `latest: 1.0.0-alpha.17` against the same `alpha: 1.0.0-alpha.21`.
    `alpha.16` of the React package depends on `tailwind-merge`,
    `@radix-ui/*` and `@govtech-bb/design` — it is the **previous
    Tailwind/Radix design system**, not this CSS-first one, and it is missing
    `Header`, `SkipLink`, `SummaryList`, `FormGroup`, `Label`, `Hint`,
    `Fieldset`, `ButtonGroup` and `List`.

    `using-the-design-system.md` tells teams to run
    `pnpm add @govtech-bb/frontend @govtech-bb/react` with no version, which
    resolves `latest`. So the documented install currently hands a service team
    the wrong design system, and the failure looks like missing exports rather
    than a wrong package.

    Fix is one command — move the `latest` tag to `alpha.21` — plus deciding
    whether the docs should pin a version until the package leaves alpha. This
    is the highest-impact finding from the whole exercise and it was found by an
    eval run, not by reading anything.

### Unconfirmed — reported by eval runs, not reproducible

13. Two runs independently reported layout defects: `.govbb-grid-row`'s twelve
    tracks and eleven 32px gaps giving a 352px floor that overflows the 375px
    mobile frame, and `.govbb-width-container`'s `margin-inline: auto`
    suppressing flex stretch so `<main>` shrinks to its content. **Neither
    reproduces.** Tested at 320/375/414/1280px, with trivial text, an input, an
    unbreakable string, a table and a nested row, across three page structures
    (`govbb-page` on `<body>`, on a React mount node, and `width-container` as
    the flex item itself), against both the local build and the published
    package — no horizontal overflow and no misalignment in any combination.

    Recorded because two independent runs claimed them and both applied
    workarounds, so something real may be happening inside their own React
    scaffolds. But they should be isolated before anyone changes `layout.css`:
    as written they are attributions, not reproductions.

### Also worth knowing

8. **Prototypes want the ESM runtime served, not bundled.** Serving
   `packages/frontend/index.js` plus `src/components/*/*.js` over HTTP is enough
   for `initAll()` to work in a browser with no build step, because the package
   ships plain ESM with relative imports. That made progressive enhancement
   genuinely testable in a static-ish prototype, and is worth documenting for
   prototype teams.

## 6. Sharing and installation

Two audiences, two routes, one source. No migration of `team-skills` required
and no duplication of skill content.

**GovTech team — via the `team-skills` marketplace** (the front door). Most of
the team has already added it, so this is one command:

```
/plugin marketplace update team-skills
/plugin install govbb@team-skills
```

Then `/reload-plugins` (or restart). Skills are available as
`/govbb:<name>`. After this, every merge to `main` in *this* repo reaches
installed users at their next startup — no `team-skills` change needed, because
the marketplace entry omits `version` and the commit SHA is the version.

**Service teams and anyone outside GovTech — via the skills CLI**, straight at
this repo:

```sh
# All published design-system skills
npx skills add govtech-bb/govbb-design-system

# One skill, globally, for Claude Code
npx skills add govtech-bb/govbb-design-system -s design-system-compliance -g -a claude-code

# Try without installing
npx skills use govtech-bb/govbb-design-system@design-critique | claude
```

**Design team only — via a private marketplace.** `new-component` is on neither
route above. It ships from the private `govtech-bb/design-team-skills`, which
designers add once:

```
/plugin marketplace add govtech-bb/design-team-skills
/plugin install design@design-team-skills
```

Anyone without design-team access on that repo cannot clone it, so the install
simply fails — the access control is GitHub's, not a flag we set. Use an SSH
remote so background refreshes authenticate (see
[Decision B](#decision-b--what-not-published-on-the-site-means-for-the-internal-skill)).

**Cross-linking:** the `team-skills` README gains a "Design system skills"
section explaining that `govbb` is sourced from the design-system repo and why;
`/ai-skills/` on the site points back at `team-skills` for workflow skills. The
question *"which repo do I install?"* is answered in both places, with the same
answer.

---

## 7. Publishing on the design system site

Generate the pages from the `SKILL.md` files. Nothing about a skill should be
written twice.

1. **New `skills` content collection** in `apps/site/src/content.config.ts`,
   loaded with the glob loader over `../../skills/*/SKILL.md`, schema matching
   the frontmatter contract in §3. Every skill in `skills/` is public by
   construction now that component authoring ships from a private repo, so
   there is nothing here to leak. Still **filter `metadata.internal === true`
   in the loader** rather than the template, as a standing guard: if an
   unpublished skill is ever added here, the default must be to omit it from
   pages and the search index rather than to expose it.
2. **`/ai-skills/` index** replaces the current placeholder: what a skill is,
   the two install methods, and a table of published skills (name, what it's
   for, status, prerequisites). Keep the existing standing guidance — review
   generated output before it reaches users; don't put personal or sensitive
   data into AI tools without approval — since that is policy, not placeholder.
3. **`/ai-skills/<slug>/`** per skill, using `ArticleLayout` (left sidebar +
   "On this page" rail) like component pages: what it does, when to use it,
   install command, what it needs (e.g. Playwright MCP), what it deliberately
   does *not* do, and a link to the source. Note that the honesty caveats
   (critique is not user research; accessibility findings tagged by method)
   belong on the page as well as in the skill — the page is what a service team
   reads before trusting the output.
4. **`/ai-skills/<slug>.md`** raw twin via `[slug].md.ts`, following the
   existing pattern exactly. Serving the actual `SKILL.md` at a stable URL is
   the lightest-weight distribution channel there is.
5. **Navigation:** add a sidebar group for AI skills; keep `ai-skills` in
   `secondaryNav` for now (footer + sitemap, out of the header) — promoting it
   to the primary nav is a call for once the skills are `supported` rather than
   `experimental`.
6. **Changelog / design log:** a design log entry recording *why* skills live
   in this repo and *why* one is unpublished. Future contributors will ask.

---

## 8. Sequencing

Phase 1 deliberately does one skill *and* the whole publication pipeline, so
every later skill is content-only work.

| Phase | Work | Blocks / notes |
|---|---|---|
| **0 — Decide & spike** | Decisions A–D are settled; this phase now *proves* them. Scaffold `skills/` with one trivial skill; prove **both** install routes on two machines — `git-subdir` plugin entry via `team-skills`, and `npx skills add` against this repo. Confirm the `"skills": "."` layout question in Decision A. Confirm the Claude plan tier (Decision B). Add Playwright MCP and **run two concurrent isolated sessions** to prove parallel personas are viable (Decision D). | Blocks everything. Small — days, not weeks. The two-route install and the concurrency check are the things to prove, not the skill. |
| **1 — Compliance + pipeline** | `design-system-compliance`. `build-references.mjs` + CI drift check. Add `status` to the components collection. Site: `skills` collection, `/ai-skills/` rewrite, `[slug].astro`, `[slug].md.ts`. Design log entry. | Highest demand; proves the pipeline end to end. |
| **2 — Accessibility** | Expand the existing WCAG 2.2 AA commitment into `documentation/accessibility.md` (Decision C) **first** — and get it signed off, since with no wider GoB policy it becomes the de facto standard. Then `accessibility-review` + `axe-scan.mjs` + component a11y contracts. Publish. | Criteria must be citable before the skill can cite them. The sign-off is the long pole, not the drafting — start it early. |
| **3 — New component** *(parallel with 2)* | Create the private `govtech-bb/design-team-skills` repo + marketplace; grant the design-team group. Then `new-component` with templates and publication checklist. Design team owns and validates it. | Independent owner; can run alongside Phase 2. Decision B settled — but confirm the plan tier in Phase 0, since Organization-settings distribution would change the setup. |
| **4 — Critique** | Personas, orchestration, report template, synthesis. Publish with Playwright MCP named as a prerequisite and the not-user-research caveat prominent. | Last: highest technical risk, and benefits from the a11y contracts from Phase 2. Decision D is settled but its concurrency assumption must have been proven in Phase 0. |
| **5 — Harden** | Move skills from `experimental` to `supported` on evidence of use. Cross-link `team-skills`. Review the caveats after real use. | Ongoing. |

**Ownership.** Each skill needs one named owner who runs it on real work in the
first fortnight — a skill nobody uses cannot be known to be wrong.

---

## 9. How to write and test the skills

- Use the **`skill-creator`** skill to scaffold each one; it also runs evals and
  can benchmark description triggering, which matters here because four skills
  with adjacent scopes will otherwise fire on each other's requests.
- Adopt the `team-skills` review checklist verbatim: frontmatter present;
  description states when to invoke; content is *instructions to Claude*, not
  documentation *about* Claude; steps are ones we want consistent every time.
- **Add a drift check to that checklist, as a reviewer's question rather than a
  linter's:** for every factual claim about the design system in the diff — a
  component name, a token, a number, a list, an exemption — ask *"what would this
  skill tell someone to do if this silently changed?"* If the answer is anything
  other than "the same correct thing", the claim must become an instruction to
  resolve it at run time. See §5 for the statable/resolvable line. This is the
  single most valuable thing a reviewer can do on a skill PR, because it is the
  one class of defect that testing does not surface: a skill built on a stale fact
  passes its evals on the day it is written.
- **Triggering test.** Before merging any skill, check that these prompts route
  to exactly one skill: *"make this prototype use GovBB"* → compliance;
  *"is this accessible?"* → accessibility-review; *"what's wrong with this
  design?"* → critique; *"we need a tabs component"* → new-component (design
  team) or a *don't build this* answer.
- Keep each `SKILL.md` short and push detail into `references/` — loaded on
  demand, cheaper to review, and independently iterable (the `dev-finish`
  `summary.md` precedent).

---

## 10. Risks

| Risk | Mitigation |
|---|---|
| Skills drift from the system and give confidently wrong advice | The §5 authoring rule: state nothing that is only true today; resolve it from the source of truth at run time. Skills fetch the `.md` twins rather than restating them, and hold no lists |
| A stale exemption tells a reviewer to overlook a real failure | The §5 test — "if this fact silently changed, what would the skill tell someone to do?" — applied to every claim in a skill PR (§9). Caches must name their authority; tools must announce assumptions |
| Critique output gets cited as user research | Caveat at the top of the report template, on the site page, and in the skill; framed as a pre-research filter |
| Personas overclaim what the tooling actually tested — "fine on slow connections", "works with a screen reader" | Playwright MCP has no bandwidth throttling and returns an accessibility tree, not AT output. Personas reframed to JS-blocked/offline and tree-exposure; both overclaims called out in the report template (§4.3) |
| Parallel personas collide in a shared browser and produce harness artefacts as findings | One isolated context per persona; proven with two concurrent sessions in Phase 0 before six are built (Decision D) |
| Accessibility skill asserts unverified passes | Every finding tagged by method; contrast computed from tokens; no score; explicit *needs-manual-test* category |
| Four adjacent skills mis-trigger | Explicit boundaries written into each skill (critique↔a11y, compliance↔component authoring); triggering test before merge |
| Restricting the skill is mistaken for controlling component sprawl | It is not a control — anyone can hand-write CSS and open a PR. The gate is review on `packages/frontend/src/components/`; stated in Decision B and in the skill's own README |
| Private-marketplace updates fail silently for designers | SSH remotes + `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE=1`, documented in the design-team onboarding; move to Organization-settings distribution if the plan tier allows |
| The design-team skill drifts from this repo's conventions with no CI to catch it | Its references cover *stable* conventions (BEM prefix, cva pattern, commit scoping), not the volatile inventory; revisit if it starts citing component or token names |
| Two install mechanisms confuse the team | One route per audience, not two per person: GovTech installs `govbb@team-skills`, everyone else uses the skills CLI. Cross-linked both ways |
| A declared `version` silently freezes updates for existing users | Omit `version` in both the marketplace entry and `plugin.json`; the commit SHA is the version (docs warn about this explicitly) |
| The `git-subdir` pointer breaks if `skills/` is moved or renamed | Path is part of the published contract; note it in this repo's `CONTRIBUTING.md` next to the layout, and pin nothing else to it |
| Skills built and never used | Named owner per skill, running it on real work in the first fortnight |
