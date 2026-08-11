# Layout claim reproductions

Standing reproduction attempts for layout defects reported against the design
system. The point is to make a verdict inspectable rather than something someone
has to take on trust — in either direction.

```sh
node ci/layout-claims/reproduce.mjs                    # local build
node ci/layout-claims/reproduce.mjs --css <path|url>   # a published package, say
```

Exits `0` when nothing reproduces and non-zero when something does, so each
entry doubles as a regression guard once a defect is confirmed and fixed. It
exits `2` if the stylesheet did not actually apply — see
[The first verdict was wrong](#the-first-verdict-was-wrong).

## Currently tracked

Two defects were reported independently by two agents scaffolding React
applications during the `design-system-compliance` skill evaluation. **Both
reproduce.**

- **`.govbb-grid-row` overflows the mobile frame.** Twelve tracks and eleven
  32px column gaps give a 352px floor, against roughly 343px of content box at
  the 375px design frame — predicted to scroll sideways by about 9px on every
  page using the documented scaffold.

  Confirmed, at the predicted number: at 375px the row measures 352px and the
  document `scrollWidth` is 384px, overflowing by **9px**. It overflows by 64px
  at 320px and 24px at 360px, and clears only at 414px. All five content cases
  reproduce it. The floor is irreducible because
  `grid-template-columns: repeat(12, minmax(0, 1fr))` lets every track collapse
  to zero while `column-gap` stays fixed, so 11 × 32px is the narrowest the row
  can ever be.

  This fails **WCAG 2.2 SC 1.4.10 Reflow**, which requires no horizontal
  scrolling at 320px, for any page using a grid row.

- **`.govbb-width-container` does not stretch.** Its `margin-inline: auto` was
  said to suppress cross-axis stretch once `.govbb-page` makes it a flex item,
  shrinking `<main>` to its content and drifting it out of alignment with the
  header.

  Confirmed: 562px against a 1280px viewport, drifting 359px from the header.
  `.govbb-header__inner` escapes it because the real flex item is
  `.govbb-header` and the container is nested inside, which is exactly the
  asymmetry that was reported.

## The first verdict was wrong

This file previously recorded "Neither reproduces", citing eighteen measurements
across two stylesheets. The harness performs twelve — four viewport widths, five
content cases, three page structures — so the count was wrong too. More
importantly, the verdict measured nothing.

`reproduce.mjs` called `setContent` without navigating first, leaving the
document on `about:blank`. Chromium refuses to load a `file://` subresource from
a non-`file` document, so the stylesheet `<link>` failed silently and every
measurement was taken against a **completely unstyled page** — where
`.govbb-page` is never `display: flex` and `.govbb-grid-row` is never a grid,
which are the only two mechanisms either claim is about. A stylesheet that fails
to load reads exactly like a clean result.

The harness now navigates to the stylesheet's directory before setting content,
and preflights that `.govbb-page` computes to `flex`, `.govbb-grid-row` to
`grid`, and `.govbb-width-container` to a real `max-inline-size` — exiting `2`
with a diagnostic if not. **A negative result is only worth having if the thing
under test was actually loaded**, so check that before trusting one.

Two lessons worth keeping: the two agents were right, and "two independent
reports and a passing check" was not enough to overturn them. The passing check
was the weakest evidence in the room and was treated as the strongest.

## Caveats on the current result

- Chromium only. Claim B's header/`<main>` asymmetry should be checked in
  Firefox and WebKit before anyone edits `layout.css`.
- The published-stylesheet runs (`--css https://…`) would not have hit the
  loading bug, since `http` subresources load fine from `about:blank`. If those
  runs genuinely showed no overflow, that conflicts with what is measured
  locally and is worth reconciling — the published alpha may differ from the
  local build, or only the local runs may ever have been performed.
- Claim A has no obvious fix that keeps the current design: a fixed 32px gap
  against twelve collapsible tracks cannot fit a narrow viewport. Deciding
  between a smaller gap, a percentage gap, or fewer tracks below a breakpoint is
  a design decision, not a bug fix.

## Adding a claim

Add a case to `reproduce.mjs` alongside the existing two, with the prediction
written out in the comment header: what should be observed, at what width, and
by how much. A claim without a number is not testable, and the number is what
makes any result — positive or negative — meaningful.
