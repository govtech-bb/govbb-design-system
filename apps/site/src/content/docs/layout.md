---
title: Layout
description: How to structure a page with the width container, main wrapper and grid.
lede: Structure pages with the width container, main wrapper and column grid.
---

Layout classes are page scaffolding, not components — they only decide how
regions of a page occupy space. They ship in the design system CSS; there are
no React wrappers, so use the classes directly in any framework.

## Page scaffold

Every page wraps its content in the width container. Content is fluid up to
the 1512px desktop frame and centred beyond it, with side gutters that grow
with the viewport from 16px on mobile to 128px at desktop (1256px of content
at the cap). The main content sits in the main wrapper,
which renders vertical breathing room and should carry the `main-content` id
that a skip link targets.

```html
<div class="govbb-width-container">
  <main class="govbb-main-wrapper" id="main-content">
    <!-- page content -->
  </main>
</div>
```

The header, official banner and footer sit outside the width container and use
it internally for their own content, so they can paint full-bleed backgrounds.

## Grid

The grid is a 12-column CSS grid with a fixed gutter. Column classes span a
fraction of the row on tablet and wider screens, and stack to full width below
that. Most pages need only the two-thirds / one-third split: content on the
left, related links or contextual help on the right.

```html
<div class="govbb-grid-row">
  <div class="govbb-grid-column-two-thirds">
    <p>Main content</p>
  </div>
  <div class="govbb-grid-column-one-third">
    <p>Related links</p>
  </div>
</div>
```

Available fractions: `full`, `three-quarters`, `two-thirds`, `one-half`,
`one-third`, `one-quarter`. Fractions in a row should sum to a whole; a row
with leftover tracks simply leaves trailing space.

Each fraction also has a `-from-desktop` variant (for example
`govbb-grid-column-one-third-from-desktop`) that stays full width through
tablet and only takes its fraction on desktop — use it when a sidebar is too
cramped at tablet widths.

Rows nest: a `govbb-grid-row` inside a column starts a fresh 12-column grid
scoped to that column's width.

```html
<div class="govbb-grid-row">
  <div class="govbb-grid-column-one-quarter"><p>Quarter</p></div>
  <div class="govbb-grid-column-one-quarter"><p>Quarter</p></div>
  <div class="govbb-grid-column-one-half"><p>Half</p></div>
</div>
```

## When to use the grid

Use the grid whenever a page places content side by side — a main column with
a sidebar, cards in halves or quarters, or a form constrained to two-thirds so
line lengths stay readable.

Do not use the grid for spacing inside a component — components own their
internal layout. Do not nest grids more than one level deep; if a layout needs
that, simplify the page instead.
