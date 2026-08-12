---
name: design-system-compliance
description: >-
  Convert an existing prototype, page or component to the GovBB Design System
  (@govtech-bb/frontend / @govtech-bb/react), or build a new Government of
  Barbados interface with it from the start, then report honestly on whatever
  could not be converted. Use this whenever someone mentions the GovBB or
  gov.bb design system, asks to make an interface "look like GOV.BB" or match
  government styling, asks whether a page or component is design-system
  compliant, is building or reviewing UI for a Government of Barbados service,
  or is working in a repo that depends on @govtech-bb/frontend or
  @govtech-bb/react — even if they never say the words "design system".
metadata:
  title: Design system compliance
  audience: public
  status: experimental
  requires: ['the design system site, or a local copy of its source']
---

# GovBB Design System compliance

Make an interface look and behave like a Government of Barbados service, using
the published components, patterns and tokens rather than lookalikes.

This works in two directions and the loop is the same for both:

- **Converting** an existing prototype that was built with something else.
- **Building new** — start at Step 2, since there is nothing to inventory but
  everything still has to come from the system.

**Out of scope:** moving code between repositories, or adopting any particular
platform's routing and file conventions. This skill changes what an interface
is made of, not where it lives.

**Where the real failures are.** Testing this against a no-skill baseline
settled which parts matter. Getting class names right turned out not to
distinguish anything — read the stylesheet and you avoid inventing names with or
without help. What the baseline got wrong, every time, was quieter: markup that
renders perfectly while the component is inert because its
`data-govbb-module` and `initAll()` are missing (Step 6); a component borrowed
for a job its guidance rules out; and binding design-log decisions nobody
checked. Those are the steps to slow down on. They all share a shape — the page
looks finished, so nothing in review catches them.

## The one rule that matters most

**Never write a `govbb-` class or a `--govbb-` token you have not just read in
the design system's own documentation or source.** Fluent, correctly prefixed,
plausible names are the single most common way this work goes wrong — reach for
`govbb-card`, `govbb-modal` or `--govbb-color-primary` and check whether they
exist before you rely on them, because names of that shape are exactly the ones
that feel safe and usually are not. An undefined class renders as unstyled
markup, an undefined custom property silently resolves to nothing, and Stylelint
rejects the prefix in service code. Worse, either one _implies the design system
supports something it does not_, and that misinformation outlives the pull
request.

The site is the allowlist, and it is live:

- **`https://design-system.service.alpha.gov.bb/sitemap/`** lists every page.
- **Component, pattern, template, style and documentation pages have a raw
  markdown twin** at the same URL plus `.md` — `/components/button.md`. A
  component's twin carries its canonical markup with every class it exposes.
  Design-log entries and the section index pages have no twin; read those as
  HTML.

Read the component's page and copy its markup. If nothing on the site covers
what you need, say so rather than invent it.

`references/looking-things-up.md` has the full lookup contract, including which
sections have markdown twins and where the site does not publish something.

**What this skill will and will not tell you**, because the difference is the
whole design:

- **Which components exist, what they are called, and when to use each** —
  never from here. That is inventory; it changes; you fetch it. An earlier
  version of this skill embedded it and went stale three times during
  development, once badly enough to send someone to file a gap for a component
  that partly existed.
- **The page scaffold** (`govbb-page`, `govbb-width-container`,
  `govbb-main-wrapper`, `govbb-grid-row` and the column classes) — named here.
  It is architecture rather than inventory: a handful of classes, stable across
  releases, and you cannot sequence a conversion without them. `/styles/layout.md`
  is still the authority if anything looks off.
- **Per-component margin behaviour, and whether content carries its own
  rhythm** — never from here either, and the site does not publish it yet. Read
  it from the stylesheets each time; Step 4 says how. This is the one area where
  the design system's own source currently disagrees with itself, so a
  second-hand summary is worse than useless.

If you cannot reach the site — no network, no fetch tool, the site down — do not
fall back on remembered class names. `looking-things-up.md` has the ladder to
work down instead: local source in `packages/frontend/src/`, or an installed
`@govtech-bb/frontend`, and otherwise stopping. Stopping with an honest "I could
not verify any of these names" is a better outcome than a conversion that looks
finished and has to be redone.

One caveat on the local rungs: a checkout can be **behind** the deployed site,
and an installed package behind both. Classes that exist on the site can be
absent locally, so a local-only audit reports real names as invented. Prefer the
site whenever it is reachable, and say which source you verified against.

## Step 1 — Identify the consumer target

Two supported targets with different idioms. Getting this wrong invalidates
everything downstream, so establish it before touching markup. Look at whether
the prototype renders React components or emits HTML directly.

|            | HTML / server-rendered                         | React                                                         |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------- |
| Install    | `pnpm add @govtech-bb/frontend@alpha`          | `pnpm add @govtech-bb/frontend@alpha @govtech-bb/react@alpha` |
| Stylesheet | `import '@govtech-bb/frontend/css'` once       | `import '@govtech-bb/frontend/css'` once at the app root      |
| Components | `govbb-`-prefixed classes on your own markup   | `import { Button } from '@govtech-bb/react'`                  |
| Behaviour  | `data-govbb-module="…"` + one `initAll()` call | built into the wrapper                                        |

**Install the `alpha` tag, not the default.** On npm today, `latest` points at a
superseded package: `@govtech-bb/react@latest` resolves to a build of the
_previous_ Tailwind and Radix design system, which is missing `Header`,
`SkipLink`, `SummaryList`, `FormGroup`, `Label`, `Hint`, `Fieldset`,
`ButtonGroup` and `List`. A plain `pnpm add @govtech-bb/react` installs the
wrong design system, and it fails as puzzling missing exports rather than as an
obviously wrong package. Check what you resolved with
`npm view @govtech-bb/react dist-tags` before debugging anything else, and pin
the version in `package.json` so a later install cannot drift.

Two mistakes worth naming, because they produce confusing symptoms rather than
clean errors:

- **Calling `initAll()` over React wrappers.** They already carry their
  behaviour; scanning them again double-binds listeners. The exception is worth
  knowing: hand-written `govbb-` markup is legitimate in a React app where no
  wrapper exists, and if that markup is a behavioural component it does need
  `initAll()` — scoped to that subtree, not the whole document.
- **Mixing targets for one element** — a React wrapper in one place and
  hand-written markup for the same component elsewhere on the surface. Pick one
  per element, or you have two things to update and will miss one.

A prototype using Tailwind, plain CSS or CSS modules is still an HTML target.
The question is only whether **React wrappers** are in play.

### Decide the rendering architecture before you scaffold

If you are building new, this is the moment. The system expects progressive
enhancement, so a **client-rendered single-page app cannot meet the standard**:
with JavaScript unavailable it renders nothing at all, which is worse than any
component degrading. That is not a detail to discover at verification, when the
fix is a rewrite.

Prefer server-rendered pages with real `action`s and a redirect after post.
Where an SPA is already chosen and cannot change, say so plainly in the report
as the one deviation a design-system review should object to, and recommend the
migration before alpha rather than leaving it implied.

## Step 2 — Inventory before changing anything

Fetch `/components/` for the component list with one-line descriptions, and
`/sitemap/` for the patterns, templates and design-log entries. Two requests,
and they tell you what exists today. The sitemap runs to about seventy-five
links — do not fetch them all. Get the index, then fetch individual pages as you
need them in Step 3.

Then walk the prototype and list every distinct UI element, sorting each into
one of three buckets:

1. **Has a component** — a direct replacement exists.
2. **Has a pattern or template** — the whole _task_ is already solved. Check
   this before assembling components by hand: patterns encode question wording,
   validation and error handling that you would otherwise re-derive, worse.
3. **Genuinely novel** — nothing covers it.

Names differ between design systems, so match on behaviour rather than
vocabulary. `references/conversion-checklist.md` gives you the method for
translating a prototype's vocabulary into the system's, and the tie-break when
two components both look plausible. Work through it before concluding anything
is novel — bucket 3 should be small, and when it is large that usually means the
inventory was done by name.

Resist the pull of a name that matches too neatly, and beware of over-correcting
too. "Alert" maps to Status banner for some meanings and not others: that
component covers where a page sits in its lifecycle and service disruption, so
an outage notice belongs there — while its own guidance sends form validation to
Error summary instead, and tells you not to use it for routine content. One
prototype word can land in three different places. Only the component's page
resolves that, which is why a guess is not an inventory.

Show the user this inventory before converting. It is cheap to redirect now and
expensive after the markup has changed.

## Step 3 — Convert in dependency order

Order matters because later steps sit inside earlier ones. Converting a form
field first and the page shell afterwards means doing the field twice.

### The page outline

Dependency order tells you what to convert first. It does not tell you what
nests inside what, and those are different questions — a page can use every
correct class and still put things in the wrong place. Every page has this
shape:

```
skip link
official banner
header
  ↓  anything that navigates AWAY from the page — a back link — goes here
main  id="main-content"  tabindex="-1"      ← the skip link's target
  width container → grid row → two-thirds column
    h1  (exactly one)
    the page's actual task
footer
```

**A back link belongs above `main`, not inside it.** Its own guidance says
"before the page title and main task", and the reason bites in practice: `main`
is what the skip link jumps to, so a back link placed first inside it means a
keyboard user who asks to skip navigation lands directly on navigation. Nothing
about the rendered page looks wrong, and the class audit passes, because
nothing here is a class error.

The same reasoning covers anything else that leaves the page — a "start again"
link, a phase-banner feedback link. Ask what the element is _for_: if the
answer is "leave this page", it is not part of the main task.

1. **Page scaffold and layout** — `govbb-width-container`, then
   `govbb-grid-row` with a `govbb-grid-column-*`. Body content belongs in
   `govbb-grid-column-two-thirds`: that is the measure the type scale was
   designed for, and full-width body text is too long a line to read.
2. **Page landmarks** — Skip link, Official banner, Header, Footer. These are
   not decoration. Each has a job, and placing something carelessly near one
   breaks that job silently: the skip link is the keyboard entry point to the
   page, `main` is the target it jumps to, the header is the primary
   navigation, and the footer closes the page.
3. **Form elements** — Form group, Label, Hint, Error message, then the
   specific inputs. Keep each control's label and hint associated as you go;
   this is where accessibility is usually lost.
4. **Content** — typography, lists, tables, summary lists.
5. **Bespoke leftovers** — whatever is left from bucket 3.

Fetch each component's page before using it and copy the markup it shows.
`/components/<slug>.md` gives you the raw markdown. The guidance says when a
component is the _wrong_ answer, which a class name cannot tell you —
`status-banner` looks right for "application under review" and is actually for
service phase.

## Step 4 — Use the system's layout and rhythm

Layout and the spacing scale are published — `/styles/layout.md` and
`/styles/spacing.md` — so fetch those rather than working from memory.

### Three tiers of spacing, and you only write the third

`/styles/spacing.md` states the division: use the grid for space _between_
regions of a page, and spacing tokens for space _inside_ a component and for
vertical rhythm between elements. That leaves a clear split of ownership, and
knowing which tier a gap belongs to is what stops you fighting the system:

| Tier                    | Owned by                                                                 | You write                                     |
| ----------------------- | ------------------------------------------------------------------------ | --------------------------------------------- |
| The page frame          | `govbb-width-container` and `govbb-main-wrapper`, which space themselves | **nothing**                                   |
| Between regions         | the grid — row and column classes                                        | class names                                   |
| Rhythm between elements | you                                                                      | your own class, values from `--govbb-space-*` |

The first row is the one that catches people. The wrapper already provides the
page's vertical padding and the container already provides its side margins, at
sizes that change with the viewport. So a gap below the header that looks tight
is almost never yours to fix — adding page padding there overrides a responsive
system with a fixed guess, and the guess is wrong at the widths you did not
check. Measure it before concluding anything is missing.

**Who owns vertical rhythm is not published, and you cannot lay out a page until
you know.** Two arrangements are possible and they need opposite work from you.
Either content elements carry their own bottom margins, in which case a page of
prose needs almost no spacing CSS and adding some builds a second system on top
of the first — or content margins are reset to zero and _every_ gap has to come
from layout or component styles. Guessing wrong is not a small error in either
direction, and the page looks plausible either way.

Establish it from source rather than recalling it. Three questions:

1. **Do headings and paragraphs carry a margin?** Read the package's base
   stylesheet. A comment there usually states the intended strategy — and where a
   comment and the declarations below it disagree, the declarations are what
   ships.
2. **Which components space themselves from what follows?** Grep the component
   stylesheets for block-margin declarations. Distinguish a component that _adds_
   a bottom margin from one whose `margin: 0` is clearing a browser default
   rather than opting out of rhythm, and watch for margins on a component's inner
   elements rather than its root — those do not space the component from its
   neighbour.
3. **Do the layout classes contribute any vertical gap?** Read the grid rules
   rather than assuming one exists.

Expect the source to be somewhat inconsistent with itself here, because this is
the part of the system still settling. When a stylesheet comment and the rules
beneath it tell different stories, that is a finding for the report and a question
for the design team — not something to resolve silently by picking whichever
reading suits your page.

Then fill whatever gaps you actually found. Two rules hold under either
arrangement:

- **Put each margin on your own class, never on a `govbb-` one.** A margin on
  `.govbb-list` restyles a component's internals and makes this service disagree
  with every other one.
- **Take every value from `--govbb-space-*`.**

Avoid a generic `* + *` rule. If content already carries margins it duplicates
them and leans on collapsing to hide the overlap; if content margins are zeroed it
spaces elements that should not be spaced. Write the specific rules the page
needs.

**Then render the page and look at it.** Spacing is not verifiable by reading
markup. If you needed more than a handful of rules, put that in the report with
what you needed — repeated evidence is what lets the design team act on it, and
publishing per-component spacing behaviour on the site is what would turn this
step from an investigation back into a lookup.

## Step 5 — Replace ad-hoc styling with tokens

Flag every literal colour, spacing value, font size and radius, and map it to a
`--govbb-*` token. Token names and the two-tier rule are on
`/styles/tokens.md`; for actual values fetch the rendered `/styles/tokens/`,
whose tables are generated from `tokens.css` at build time.

Prefer semantic tokens (`--govbb-color-brand`, `--govbb-space-s`) over the
primitive ramp (`--govbb-blue-100`, and similar). The primitives exist so the
semantic tier has something to resolve to; naming one directly pins you to a
hue and drops the meaning, so a later palette change silently passes you by.

When a literal has no token, do not force the nearest one — a value that is
_almost_ right reads as a bug in the design system rather than in the service.
Record it in the report instead.

**Remove utility-class frameworks rather than bridging to them.** If the
prototype uses Tailwind or similar, convert off it. The design system ships its
own page scaffold (`govbb-width-container`, the `govbb-grid-*` columns) and type
utilities (`govbb-text-*`), and components own their internal spacing — so most
utility classes have a direct replacement, and the rest were compensating for
not having a design system.

It is technically possible to reference tokens from Tailwind arbitrary values
(`bg-[var(--govbb-color-brand)]`), and the published guidance mentions that for
existing Tailwind applications. Do not reach for it during a conversion. The
point of this work is a prototype that can be lifted into alpha with a little
more effort, and every utility class left behind is effort handed to whoever
does that lift — plus a second spacing and colour system quietly competing with
the design system's own.

Where a layout genuinely has no design-system equivalent, write plain CSS
against `--govbb-*` tokens. That is reviewable, portable and obvious to the next
person; a bridged utility class is none of those.

## Step 6 — Wire up behaviour

**Do not skip this step, and do not leave it until last.** It is the single
thing a conversion most reliably gets wrong: in testing, a run without this
guidance produced a page that rendered perfectly with every component inert — no
`data-govbb-module` anywhere and no `initAll()`, so the mobile navigation never
opened and the number-input steppers did nothing. Nothing in the markup looks
wrong, which is why it reaches users.

Most components are CSS-only. A few are progressive enhancements, and **a
component's page tells you which**: its markup carries a `data-govbb-module`
attribute. `/documentation/using-the-design-system.md` names them as a set. Do
not work from a remembered list — the set grows as behavioural components are
added.

On an HTML target, every element with `data-govbb-module` needs that attribute
copied exactly as the guidance shows, plus a single `initAll()` call after the
document exists:

```js
import { initAll } from '@govtech-bb/frontend';
initAll();
```

Miss this and the markup still renders, which is why it slips through review.
The component simply never does anything — a mobile navigation that does not
open, a file upload with no file list.

React wrappers carry their own behaviour, so do not call `initAll()` over them.

## Step 7 — Report what you could not convert

An honest gap list is a deliverable, not an admission. Silent gaps are how a
service ends up with a component nobody knows is bespoke.

Use this structure:

```markdown
## Converted

[Element → component/pattern used, grouped by the dependency order above]

## Not converted

| What      | Why                                                           | Suggested route |
| --------- | ------------------------------------------------------------- | --------------- |
| [element] | no component exists / deliberate deviation / needs a decision | [see below]     |

## Deviations kept deliberately

[Anything left non-standard on purpose, with the reason]
```

Route each gap rather than leaving it hanging:

- **A missing component** → the design team owns component creation; raise it
  with them rather than building a `govbb-`-prefixed lookalike.
- **A gap in a pattern** → a design log entry, so the next team hits a
  documented decision instead of the same wall.
- **A deliberate deviation** → record it with its reason. A deviation that is
  written down is a decision; an unrecorded one is a defect.

## Verify before you hand it over

Reading the markup is not verification. Each of these has caught a real defect
that source review passed.

- **Audit the classes you emitted, mechanically.** Collect every `class="…"`
  value from the rendered output and check each `govbb-` name against the
  component pages you fetched — or, if you have the repo, against
  `packages/frontend/dist/govbb.css`, where a name that resolves to nothing is a
  name that does not exist. This is a few lines of scripting and it is the only
  reliable guard against a plausible invented name surviving to review.

  Rebuild before you trust that file, and see whether anything changes — a stale
  build from before a rename reports real classes as invented and sends you
  chasing them. Use that path rather than any other `dist/` in the tree.

  Know what this audit cannot tell you: a name existing in the stylesheet does
  not mean the selector will match your markup. `.govbb-error-summary__link` is
  styled only as `.govbb-link.govbb-error-summary__link`, so using it alone
  renders unstyled while passing every existence check. Copying the documented
  markup is what protects you there; the audit only catches names that are
  wholly invented.

  And when the audit contradicts the documented markup, the documentation wins
  and the mismatch is a finding. `govbb-footer__item` appears in the Footer
  page's canonical markup and resolves to no rule in any stylesheet. Copying the
  markup is still right; chasing the audit here would mean deviating from the
  documentation to satisfy a script. Report it and move on.

- **Check the page structure, mechanically.** `scripts/layout-check.mjs` reads
  the rendered DOM for the things a class audit cannot see: one `h1`, the skip
  link resolving to a `main` that is focusable, no link away from the page
  sitting in front of the `h1` inside `main`, one of each landmark, body content
  inside a grid column, and no horizontal overflow. Every one of these renders
  perfectly while being wrong, which is why looking does not catch them.
- **Render the pages and look at them, at 360px and 1280px.** Spacing problems
  (Step 4) are invisible in source, and a page can be entirely correct
  class-by-class and still look wrong. One width is not a check: a layout can be
  flawless on a laptop and overflow on a phone, and the phone is how most people
  will meet the service.
- **Walk the journey the way a user does** — load each page, follow the
  redirects, use the Back links, click a "Change" link and come back. Posting to
  each endpoint in sequence is not the same test: it skips the page loads, so it
  misses anything in the rendering or guard path. A multi-step service can pass a
  post-only walkthrough and be broken in a browser.
- **Turn JavaScript off and repeat.** The system is built on progressive
  enhancement, so this is a real expectation, not a nicety. Components with
  `data-govbb-module` should degrade to working native controls, and every form
  should still submit.
- **Check every form control keeps its label association and error wiring** —
  `for`/`id`, `aria-describedby` for hints and errors, `aria-invalid` when
  invalid, and an error summary that links to the field.
- **Run the linting** if the repo has any. In the design-system repo that is
  `pnpm lint`, where Stylelint enforces the `govbb-` prefix.
- **Re-read the gap list.** Is each item specific enough that someone could act
  on it without asking you a question?

## References

Read these as you need them rather than up front.

- **`references/looking-things-up.md`** — the lookup contract: `/sitemap/` for
  discovery, `<page>.md` for raw markdown, where the site does not yet publish
  something, and why this skill holds no component list. **Read this first.**
- **`references/conversion-checklist.md`** — how to translate a prototype's
  vocabulary into the system's, what to do when something looks missing, a
  worked conversion, and the per-target checklist.
- **`references/anti-patterns.md`** — the specific ways this goes wrong, and
  what to do instead.

None of these states a fact about what the design system currently contains. They
teach a method; the contents come from the site, or from the source where the site
does not publish them yet, every time. So adding a component, renaming one, or
changing how spacing works obliges nobody to update this skill.

## Scripts

Plain Node ESM, no build step. Run with `--help` for options.

- **`scripts/layout-check.mjs`** — page-structure checks against the rendered
  DOM: landmarks, the skip link's target, whether anything that leaves the page
  sits in front of the `h1` inside `main`, grid column placement, and horizontal
  overflow at each width. Needs the pages served somewhere it can reach them.
  Holds no design-system inventory, so it does not go stale.
