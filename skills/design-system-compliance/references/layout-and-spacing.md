# Layout and vertical rhythm

The system owns page layout completely, and it has a deliberate strategy for
vertical rhythm: **content margins own it.** `layout.css` says so directly —
"Columns carry no vertical gap: content margins own that rhythm" — and
`base.css` implements it with a bottom margin on every heading and paragraph.

Use that strategy rather than replacing it. A service needs its own CSS only
where specific components opt out of it, which is a short and knowable list.

**This is the one file in the skill derived from source rather than the live
site**, because per-component margin behaviour is not published anywhere. Facts
verified against `packages/frontend/src` on 2026-08-10, so it is also the one
file that can drift: if spacing behaves unexpectedly, read the component's
stylesheet — every component page on the site links to it — before trusting
this. Publishing this information on the site would remove the need for the
file entirely.

## Contents

- [Page layout](#page-layout)
- [The rhythm strategy](#the-rhythm-strategy)
- [What opts out](#what-opts-out)
- [How to fill the gaps](#how-to-fill-the-gaps)
- [Spacing tokens](#spacing-tokens)

## Page layout

Use these; do not rebuild them.

| Need                                                                                                 | Class or property                                                                   |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Full-height page, footer pinned to the bottom on short pages                                         | `govbb-page` on `<body>`                                                            |
| Page gutters — 16px at the 375 mobile frame growing to 128px at the 1512 desktop frame, then centred | `govbb-width-container`                                                             |
| Vertical breathing room for `<main>` — 24px, 32px at tablet and up                                   | `govbb-main-wrapper`                                                                |
| Row                                                                                                  | `govbb-grid-row` — real CSS grid, 12 tracks, 32px column gap                        |
| Columns                                                                                              | `govbb-grid-column-{full,three-quarters,two-thirds,one-half,one-third,one-quarter}` |
| Columns that stay full width until desktop                                                           | the same names with `-from-desktop`                                                 |
| Mirroring the page gutter on a full-bleed child                                                      | `var(--govbb-page-gutter)` as a negative margin                                     |

Columns stack full width below tablet automatically — there is no mobile
variant to write.

**Body content belongs in `govbb-grid-column-two-thirds`.** That is the measure
the type scale was designed for and what the system's own examples use; a
full-width paragraph at `--govbb-font-size-body` is too long a line to read.

Design widths are 375 (mobile), 800 (tablet) and 1440 (desktop). The named
`@custom-media` queries are inlined by Lightning CSS at build time, so they are
not available to service CSS — use the pixel widths if you need your own query.

## The rhythm strategy

Vertical space between blocks comes from the blocks themselves:

| Element                      | Bottom margin             |
| ---------------------------- | ------------------------- |
| `h1`–`h6`, `p` (base styles) | 16px (`--govbb-space-s`)  |
| `govbb-table`                | 16px                      |
| `govbb-form-group`           | 24px (`--govbb-space-xm`) |
| `govbb-summary-section`      | 24px                      |
| `govbb-error-summary`        | 32px (`--govbb-space-m`)  |

Note that **none of them declares a top margin.** Rhythm comes from the bottom
margin of whatever precedes an element, which is why a component that zeroes its
own margins leaves a hole above itself as well as below.

Base styles use `:where()`, so they carry zero specificity and your CSS wins
without `!important`.

For prose — headings and paragraphs — this works with no help. A page that is
mostly text needs no spacing CSS at all.

## What opts out

Two groups where the strategy does not apply, so the space is yours:

| Component                                                                                                                      | What it does                                                        |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `govbb-list`, `govbb-summary-list`, `govbb-service-list`                                                                       | set `margin: 0` — the browser's margin removed and nothing put back |
| `govbb-button`, `govbb-back-button`, `govbb-show-hide`, `govbb-payment`, `govbb-feedback`, `govbb-breadcrumbs` and most others | declare no margin at all                                            |

The second group is the majority. That is fine for components that sit inside a
form group or a flow that already spaces them, and it is a gap for anything you
place directly on the page — which in practice means calls to action, asides and
self-contained blocks.

There is also a scaling limit: the base margin is a flat 16px, so an 80px
`govbb-text-display` heading gets exactly the same gap as a 12px caption. Large
type reads as crowded.

The consequence is specific rather than general: a page of prose is fine, but a
heading followed by a list followed by a button collapses into one
undifferentiated block. It looks evenly spaced, therefore deliberate, which is
why it survives a markup review.

**There are no spacing utility classes.** `--govbb-space-*` are tokens, not
classes; `utilities.css` is deliberately minimal — the type scale and
`govbb-visually-hidden` only.

## How to fill the gaps

Supply only what opted out. Do not build a parallel spacing system on top of a
strategy that already works for most content.

**Put the margin on your own class, never on the component's.**

```css
/* Yes — restores what the component removed, without changing the component. */
.app-prose > .govbb-list {
  margin-block: var(--govbb-space-s);
}

/* No — restyling a component's internals. Every other service using
   .govbb-list now disagrees with this one. */
.govbb-list {
  margin-bottom: 2rem;
}
```

A complete service stylesheet for this is short, because the list of gaps is
short:

```css
/* Lists and summary lists zero their own margins. */
.app-prose > .govbb-list,
.app-prose > .govbb-summary-list {
  margin-block: var(--govbb-space-s);
}

/* Buttons carry none at all. */
.app-prose > .govbb-button {
  margin-block-start: var(--govbb-space-xm);
}

/* The flat base margin does not scale with the type ramp: a section heading
   needs more room above it than a paragraph does. */
.app-prose > h2 {
  margin-block-start: var(--govbb-space-m);
}
```

Note what is _not_ there: no rule for headings and paragraphs, because
`base.css` already spaces them, and no generic `* + *` rule, because adding one
duplicates the base margins and then relies on collapsing to hide it.

**Scale the gap to the type.** A heading should sit closer to the text it
introduces than to the block above it — proximity signals which content belongs
together. Equal space above and below leaves it ambiguous which section a
heading heads.

**Do not add margins around components that already own their rhythm.**
`govbb-form-group` and `govbb-error-summary` bring their own bottom margin;
adding more double-spaces the form.

**Never use literal values.** Every gap comes from `--govbb-space-*`.

## Spacing tokens

| Token               | Value | Use                                                          |
| ------------------- | ----- | ------------------------------------------------------------ |
| `--govbb-space-xxs` | 4px   | inside tight groupings (list items)                          |
| `--govbb-space-xs`  | 8px   | label-to-control, icon gaps                                  |
| `--govbb-space-s`   | 16px  | between related blocks; the base margin                      |
| `--govbb-space-xm`  | 24px  | between form groups; `main` padding on mobile                |
| `--govbb-space-m`   | 32px  | between sections; grid column gap; `main` padding at tablet+ |
| `--govbb-space-l`   | 64px  | major page divisions                                         |
| `--govbb-space-xl`  | 128px | desktop page gutter                                          |

`s`, `xm` and `m` are confirmed against Figma. `xxs`, `xs` and `l` are marked in
`tokens.css` as placeholders pending confirmation — usable, but expect them to
move, which is another reason not to hard-code their current values.

## Worth reporting

The strategy is sound and mostly self-sufficient. What is worth reporting is
narrower than "the system has no spacing layer":

**Three components opt out of the system's own documented strategy.** `govbb-list`
and `govbb-summary-list` zero their margins, and buttons never had any, so every
service that composes a heading with a list or a call to action writes the same
few rules. That reads as an oversight in those three stylesheets rather than a
missing feature — a component that removes the browser's margin and puts nothing
back is opting out of the rhythm the system says content margins own.

If you needed more than the handful of rules above, say so in the report with
what you needed and why. Repeated evidence from real services is what turns this
from an opinion into something the design team can act on.
