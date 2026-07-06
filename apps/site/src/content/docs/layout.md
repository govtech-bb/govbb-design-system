---
title: Layout
description: How to structure a page with the width container, main wrapper and grid.
lede: Structure pages with the width container, main wrapper and column grid.
---

Layout classes are page scaffolding, not components — they only decide how
regions of a page occupy space. They ship in the design system CSS; there are
no React wrappers, so use the classes directly in any framework.

## Grid presets

The grid is a 12-column CSS grid with a fixed 32px gutter between columns.
Page margins (the space either side of the content) are fluid: they grow
linearly with the viewport from 16px at the mobile frame (375px) to 128px at
the desktop frame (1512px), where the container stops growing and centres.

| Range            | Columns             | Column gutter | Page margins  | Container width |
| ---------------- | ------------------- | ------------- | ------------- | --------------- |
| below 800px      | stacked, full width | —             | 16px – 58px   | fluid           |
| 800px – 1439px   | 12                  | 32px          | 58px – 121px  | fluid           |
| 1440px and above | 12                  | 32px          | 121px – 128px | max 1512px      |

### Mobile (below 800px)

Every column stacks to full width. Use for phones and small tablets in
portrait.

<div style="background:#f8f9fa;border:1px solid #e0e4e9;border-radius:8px;padding:24px 16px;margin-bottom:32px">
  <div style="display:flex;flex-direction:column;gap:8px">
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:40px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:40px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:40px;border-radius:2px"></div>
  </div>
</div>

### Tablet (800px – 1439px)

The 12 columns apply. Use fraction classes to span them; `-from-desktop`
variants still stack here.

<div style="background:#f8f9fa;border:1px solid #e0e4e9;border-radius:8px;padding:24px 32px;margin-bottom:32px">
  <div style="display:grid;grid-template-columns:repeat(12,1fr);gap:16px">
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
  </div>
</div>

### Desktop (1440px and above)

The container caps at 1512px (128px margins + 1256px of content) and centres
on wider screens. `-from-desktop` fraction variants take effect here.

<div style="background:#f8f9fa;border:1px solid #e0e4e9;border-radius:8px;padding:24px 64px;margin-bottom:32px">
  <div style="display:grid;grid-template-columns:repeat(12,1fr);gap:16px">
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
    <div style="background:#e5e9f2;border:1px solid #99a8cc;height:96px;border-radius:2px"></div>
  </div>
</div>

## Breakpoint tokens

Breakpoints are named `@custom-media` queries, inlined at build time by
Lightning CSS. Components reference the names, never the numbers.

| Token       | Applies       | Grid behaviour                       |
| ----------- | ------------- | ------------------------------------ |
| `--mobile`  | below 800px   | columns stack full width             |
| `--tablet`  | 800px and up  | fraction classes take their spans    |
| `--desktop` | 1440px and up | `-from-desktop` variants take effect |

The page margin needs no breakpoint at all — it is one clamp,
`clamp(16px, 9.85vw − 1.31rem, 128px)`, which passes through both design
anchors (16px at 375, 128px at 1512) and holds beyond.

## Page scaffold

Put `govbb-page` on the `<body>`: it makes the page fill the viewport and
pins the footer to the bottom when content is short.

Every page wraps its content in the width container. The main content sits in
the main wrapper, which renders vertical breathing room and should carry the
`main-content` id that a skip link targets.

```html
<body class="govbb-page">
  <!-- official banner, header -->
  <div class="govbb-width-container">
    <main class="govbb-main-wrapper" id="main-content">
      <div class="govbb-grid-row">
        <div class="govbb-grid-column-two-thirds">
          <h1 class="govbb-text-h1">Page title</h1>
        </div>
      </div>
    </main>
  </div>
  <!-- footer -->
</body>
```

The header, official banner and footer sit outside the width container and use
it internally for their own content, so they can paint full-bleed backgrounds.

## Grid columns

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

## When to use the grid

Use the grid whenever a page places content side by side — a main column with
a sidebar, cards in halves or quarters, or a form constrained to two-thirds so
line lengths stay readable.

Do not use the grid for spacing inside a component — components own their
internal layout. Do not nest grids more than one level deep; if a layout needs
that, simplify the page instead.
