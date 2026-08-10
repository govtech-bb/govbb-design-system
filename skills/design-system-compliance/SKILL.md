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
  requires: ['network access to design-system.service.alpha.gov.bb']
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

## The one rule that matters most

**Never write a `govbb-` class or a `--govbb-` token you have not just read on
the design system site.** Plausible-sounding names — `govbb-card`,
`govbb-alert`, `govbb-modal`, `--govbb-color-primary` — are the single most
common way this work goes wrong. They do not exist, so they render as unstyled
markup, and Stylelint rejects the prefix in service code. Worse, they _imply the
design system supports something it does not_, and that misinformation outlives
the pull request.

The site is the allowlist, and it is live:

- **`https://design-system.service.alpha.gov.bb/sitemap/`** lists every page.
- **Any page plus `.md`** serves its raw markdown —
  `/components/button.md`. A component's page carries its canonical markup with
  every class it exposes.

Read the component's page and copy its markup. If the thing you want is not on
the site, it does not exist, and your job is to say so rather than invent it.

`references/looking-things-up.md` has the full lookup contract, including where
the site does not yet publish something. **This skill deliberately holds no list
of components, classes or tokens** — such a list drifts the moment the system
changes, and it drifted three times while this skill was being written. Fetching
is one request and cannot be stale.

## Step 1 — Identify the consumer target

Two supported targets with different idioms. Getting this wrong invalidates
everything downstream, so establish it before touching markup. Look at whether
the prototype renders React components or emits HTML directly.

|            | HTML / server-rendered                         | React                                                    |
| ---------- | ---------------------------------------------- | -------------------------------------------------------- |
| Install    | `pnpm add @govtech-bb/frontend`                | `pnpm add @govtech-bb/frontend @govtech-bb/react`        |
| Stylesheet | `import '@govtech-bb/frontend/css'` once       | `import '@govtech-bb/frontend/css'` once at the app root |
| Components | `govbb-`-prefixed classes on your own markup   | `import { Button } from '@govtech-bb/react'`             |
| Behaviour  | `data-govbb-module="…"` + one `initAll()` call | built into the wrapper                                   |

Two mistakes worth naming, because they are easy to make and produce confusing
symptoms rather than clean errors:

- **Calling `initAll()` over React components.** The wrappers already carry
  their behaviour; scanning them again double-binds listeners.
- **Mixing targets in one page** — React wrappers alongside hand-written
  `govbb-` markup for the same component. Pick one per surface. The classes are
  a stable API, so hand-written markup is legitimate in a React app when no
  wrapper exists; just do not do both for the same thing.

A prototype using Tailwind, plain CSS or CSS modules is still an HTML target.
The question is only whether **React wrappers** are in play.

## Step 2 — Inventory before changing anything

Fetch `/components/` for the component list with one-line descriptions, and
`/sitemap/` for the patterns, templates and design-log entries. Two requests,
and they tell you what exists today. Do not fetch all sixty-odd pages — get the
index, then fetch individual pages as you need them in Step 3.

Then walk the prototype and list every distinct UI element, sorting each into
one of three buckets:

1. **Has a component** — a direct replacement exists.
2. **Has a pattern or template** — the whole _task_ is already solved. Check
   this before assembling components by hand: patterns encode question wording,
   validation and error handling that you would otherwise re-derive, worse.
3. **Genuinely novel** — nothing covers it.

Names differ between design systems, so match on behaviour rather than
vocabulary. `references/conversion-checklist.md` has a translation table for
the usual suspects (an "alert" is a Status banner; an "accordion" is
Show/hide). Check it before concluding something is novel — bucket 3 should be
small, and when it is large that usually means the inventory was done by name.

Show the user this inventory before converting. It is cheap to redirect now and
expensive after the markup has changed.

## Step 3 — Convert in dependency order

Order matters because later steps sit inside earlier ones. Converting a form
field first and the page shell afterwards means doing the field twice.

1. **Page scaffold and layout** — `govbb-width-container`, then
   `govbb-grid-row` with a `govbb-grid-column-*`. Body content belongs in
   `govbb-grid-column-two-thirds`: that is the measure the type scale was
   designed for, and full-width body text is too long a line to read.
2. **Page furniture** — Skip link, Official banner, Header, Footer. These frame
   everything else and are what make a page read as a government service at a
   glance.
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

Read `references/layout-and-spacing.md` before laying out a page. Most of this
is already handled, and the risk is building a parallel system on top of it.

**The system owns page layout.** `govbb-page` for a full-height page with the
footer pinned down, `govbb-width-container` for responsive gutters,
`govbb-main-wrapper` for `<main>`'s vertical padding, `govbb-grid-row` plus a
`govbb-grid-column-*` for columns. Columns stack full width below tablet on
their own, so there is no mobile variant to write.

**Vertical rhythm has a stated strategy: content margins own it.** `layout.css`
says so, and `base.css` implements it with a 16px bottom margin on every heading
and paragraph. A page that is mostly prose needs no spacing CSS at all.

Three things opt out of that strategy, and they are the only gaps you should be
filling:

- `govbb-list` and `govbb-summary-list` set `margin: 0` — the browser's margin
  removed and nothing put back.
- `govbb-button` and `govbb-back-button` have no margin declared.
- The base margin is flat, so an 80px `govbb-text-display` heading gets the same
  16px as a caption. Section headings need more room above them.

So a heading followed by a list followed by a button collapses into one block,
while prose is fine. It looks evenly spaced, therefore deliberate — which is how
it survives a markup review.

Filling those gaps takes a handful of rules. Two things keep it safe:

- **Put the margin on your own class, never on a `govbb-` one.** A margin on
  `.govbb-list` restyles a component's internals and makes this service disagree
  with every other one.
- **Every value comes from `--govbb-space-*`.**

Do not add a generic `* + *` rule: it duplicates the base margins and then leans
on margin collapsing to hide the overlap. Supply only what opted out. And skip
components that already own their rhythm (`govbb-form-group`,
`govbb-error-summary`) or you will double-space the form.

**Render the page and look at it.** Class correctness does not imply visual
correctness, and this is not verifiable by reading markup. If you needed more
than a handful of rules, put that in the report with what you needed — repeated
evidence is what lets the design team act on it.

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

Three components need JavaScript: **Header**, **File upload**, **Number
input**. On an HTML target each needs its `data-govbb-module` attribute plus a
single `initAll()` call after the document exists:

```js
import { initAll } from '@govtech-bb/frontend';
initAll();
```

Miss this and the markup still renders — which is why it slips through. The
mobile navigation just never opens.

Everything else is CSS-only. React wrappers need none of this.

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

- **Audit the classes you emitted against the site**, mechanically. Collect
  every `class="…"` value from the rendered output and check each `govbb-` name
  against `references/`. This is cheap to script and it is the only reliable
  guard against a plausible invented name surviving.
- **Render the pages and look at them.** Spacing problems (Step 4) are invisible
  in source, and a page can be entirely correct class-by-class and still look
  wrong.
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
- **`references/layout-and-spacing.md`** — what the system spaces and what it
  leaves to you, and how to add rhythm without restyling components. Derived
  from the stylesheets rather than the site, so it is the one file here that can
  drift; it says so and gives you the source to check.
- **`references/conversion-checklist.md`** — the common-name translation table,
  a worked conversion, and the per-target checklist.
- **`references/anti-patterns.md`** — the specific ways this goes wrong, and
  what to do instead.

None of these lists components, classes or tokens. Those come from the site,
every time, so this skill does not need updating when the design system changes.
