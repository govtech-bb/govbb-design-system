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
  requires: []
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

**Never write a `govbb-` class or a `--govbb-` token that you have not read in
`references/`.** Plausible-sounding names — `govbb-card`, `govbb-alert`,
`govbb-modal`, `--govbb-color-primary` — are the single most common way this
work goes wrong. They do not exist, so they render as unstyled markup, and
Stylelint rejects the prefix in service code. Worse, they _imply the design
system supports something it does not_, and that misinformation outlives the
pull request.

`references/component-index.md` is the allowlist. If it is not there, it does
not exist, and your job is to say so rather than invent it.

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

Read `references/component-index.md` first — all 28 components, their classes,
their React wrappers, which need JavaScript, plus every pattern and template.

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

For anything non-trivial, read the component's guidance page before using it.
Every page has a raw-markdown twin: append `.md` to the URL in the index — so
`https://design-system.service.alpha.gov.bb/components/button.md`. The guidance
says when a component is the _wrong_ answer, which the index deliberately does
not duplicate.

## Step 4 — Give the page vertical rhythm

The single most common reason a technically-correct conversion still looks wrong.
Read `references/layout-and-spacing.md` before laying out a page.

The system owns horizontal layout completely and vertical rhythm barely at all:

- Base styles give every heading and paragraph a **flat 16px** bottom margin —
  the same after an 80px display heading as after a caption.
- `govbb-list` and `govbb-summary-list` set **`margin: 0`**, removing the
  browser's margin and replacing it with nothing.
- `govbb-button` and `govbb-back-button` have **no margin at all**.
- There are **no spacing utility classes**. `--govbb-space-*` are tokens, not
  classes.

So a heading, a list and a button in sequence collapse into one undifferentiated
block, and it looks deliberate rather than broken — which is how it survives
review.

Writing a small amount of service CSS to fix this is correct, not a failure. Two
things make it safe:

- **Put the margin on your own class, never on a `govbb-` one.** A margin on
  `.govbb-list` is restyling a component's internals, and it makes this service
  disagree with every other one.
- **Every value comes from `--govbb-space-*`.** Prefer one owned wrapper that
  spaces its children over margins sprinkled per element — easier to review, and
  easy to delete if the system later ships real spacing utilities.

Scale the gap to the type, and give a heading more space above than below, so
proximity shows which content it introduces. Skip components that already own
their rhythm (`govbb-form-group`, `govbb-error-summary`) or you will double-space
the form.

**Render the page and look at it.** Class correctness does not imply visual
correctness here, and this is not something you can verify by reading markup. If
you needed more than a handful of spacing rules, put that in the report — the
missing rhythm layer is a real finding, and repeated evidence is what lets the
design team act on it.

## Step 5 — Replace ad-hoc styling with tokens

Flag every literal colour, spacing value, font size and radius, and map it to a
`--govbb-*` token from `references/token-reference.md`.

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

- **Audit the classes you emitted against the allowlist**, mechanically. Collect
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

- **`references/component-index.md`** — generated from source. All components
  with classes, React wrappers, JavaScript needs and doc links, plus all
  patterns and templates. Your allowlist for Step 2.
- **`references/token-reference.md`** — generated from source. Every
  `--govbb-*` token with its value. Your allowlist for Step 5.
- **`references/layout-and-spacing.md`** — what the system spaces and what it
  leaves to you, and how to add rhythm without restyling components. Read it
  before laying out a page, not after it looks wrong.
- **`references/conversion-checklist.md`** — the common-name translation table,
  a worked conversion, and the per-target checklist.
- **`references/anti-patterns.md`** — the specific ways this goes wrong, and
  what to do instead.

The two generated files are rebuilt by `skills/scripts/build-references.mjs`
and verified in CI, so they track the code rather than a snapshot of it. Trust
them over your recollection of any design system, including this one.
