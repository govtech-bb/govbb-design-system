# Layout and vertical rhythm

The system has a stated strategy for vertical rhythm: **content margins own
it.** `layout.css` says so in as many words — "Columns carry no vertical gap:
content margins own that rhythm" — and `base.css` implements it with a 16px
bottom margin on every heading and paragraph. Work with that strategy rather
than replacing it: a service needs spacing CSS only where a component opts out,
and that is a short, knowable list.

**This is the one file in the skill derived from source rather than the live
site**, because per-component margin behaviour is not published anywhere and so
cannot be looked up. That makes it the one file here that can drift. The facts
below were checked against `packages/frontend/src` on 2026-08-10; if spacing
behaves unexpectedly, trust the stylesheet over this page. Every component page
on the site links to its own stylesheet on GitHub, under "Get this page".
Publishing this behaviour on the site would make the file unnecessary.

## Look layout and the scale up on the site

Layout and the spacing scale _are_ published, so fetch them rather than working
from memory:

- **`/styles/layout.md`** — `govbb-page`, `govbb-width-container`,
  `govbb-main-wrapper`, `govbb-grid-row` and the `govbb-grid-column-*`
  fractions, with the breakpoints and the page-margin clamp. Two things from it
  save the most rework: columns stack full width below 800px on their own, so
  there is no mobile variant to write, and body content belongs in
  `govbb-grid-column-two-thirds` — the measure the type scale was designed for.
- **`/styles/spacing.md`** — the seven `--govbb-space-*` steps and their pixel
  equivalents.

Four things those pages do not tell you:

- `--govbb-space-xxs`, `--govbb-space-xs` and `--govbb-space-l` are marked in
  `tokens.css` as placeholders pending Figma confirmation. They are usable, but
  expect them to move, which is another reason not to hard-code their current
  values. `s`, `xm` and `m` are confirmed.
- `govbb-main-wrapper` is the only vertical padding on `<main>`: 24px, rising to
  32px from tablet up.
- `--govbb-page-gutter` holds the current page margin, so a full-bleed child
  inside the width container can mirror it with a negative margin. The footer
  divider does exactly that.
- The named breakpoints are `@custom-media` rules that Lightning CSS inlines at
  build time, so they are absent from the published CSS and `@media (--tablet)`
  in service CSS does nothing. Use `50rem` (tablet) and `90rem` (desktop) if you
  need your own query.

**There are no spacing utility classes.** `--govbb-space-*` are custom
properties, not classes; `utilities.css` is deliberately minimal — the
`govbb-text-*` type scale and `govbb-visually-hidden`.

## What spaces itself and what does not

Three questions, in the order they come up.

**Does a component space its own insides?** Always yes — every component that
stacks parts does it with a flex `gap`, so adding margins between a component's
own parts fights that gap.

**Does a component space itself from what follows it?** Three do, each with a
bottom margin on the root:

| Component               | Bottom margin             |
| ----------------------- | ------------------------- |
| `govbb-form-group`      | 24px (`--govbb-space-xm`) |
| `govbb-summary-section` | 24px                      |
| `govbb-error-summary`   | 32px (`--govbb-space-m`)  |

Adding margin around these double-spaces the page. `govbb-summary-section` also
carries the only top margin anywhere in the system — 32px between consecutive
sections, which collapses over the 24px rather than adding to it.

**Everything else does not**, in one of two ways, and the difference matters
when you are working out what to write:

- **`govbb-list`, `govbb-summary-list` and `govbb-service-list` set `margin: 0`
  on their root.** These are the genuine opt-outs: the browser's list margin
  removed and nothing put back.
- **Every other component declares no block margin at all** — button, back
  button, breadcrumbs, table, the banners, feedback, payment, show/hide, the
  form controls, and the rest. That is right for anything inside a form group or
  a flex parent that already spaces it, and a gap for anything you place directly
  on the page: calls to action, asides, self-contained blocks.

`margin: 0` also appears on `govbb-fieldset`, on the checkbox and radio inputs,
and on internals such as `govbb-error-summary__title`. Those clear UA margins on
elements whose parent already owns the spacing — not opt-outs, and not yours to
restore.

Two consequences of how the base layer is written:

- **Nothing but summary section declares a top margin.** Rhythm comes from the
  bottom margin of whatever precedes an element, which is why a component that
  zeroes its own margin leaves a hole above itself as well as below.
- **The base margin does not scale with the type ramp.** It is a flat 16px, so
  an 80px `govbb-text-display` heading gets exactly the same gap as a 12px
  caption. Large type reads as crowded.

Base styles use `:where()`, so they carry no specificity and your CSS wins
without `!important`. They also only cover headings and paragraphs — a bare
`<ul>` keeps the browser's own margin and indent until you put `govbb-list` on
it.

The upshot is specific rather than general: a page of prose needs no spacing CSS
at all, but a heading followed by a list followed by a button collapses into one
undifferentiated block. It looks evenly spaced, therefore deliberate, which is
why it survives a markup review.

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
/* Lists zero their own margins. */
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

**Every gap comes from `--govbb-space-*`**, never a literal value.

## Worth reporting

The strategy is sound and mostly self-sufficient, so what is worth reporting is
narrower than "the system has no spacing layer":

**Three components opt out of the system's own documented strategy.**
`govbb-list`, `govbb-summary-list` and `govbb-service-list` zero their root
margin, so every service that composes a heading with a list writes the same
rule. That reads as an oversight in those three stylesheets rather than a
missing feature — a component that removes the browser's margin and puts nothing
back is opting out of the rhythm the system says content margins own. The
components that never declared a margin are a separate, weaker point: for most
of them a parent owns the spacing, and only the ones commonly placed straight
onto the page (button and back button, above all) leave a gap the service has to
fill.

If you needed more than the handful of rules above, say so in the report with
what you needed and why. Repeated evidence from real services is what turns this
from an opinion into something the design team can act on.
