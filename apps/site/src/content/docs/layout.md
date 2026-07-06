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

<svg viewBox="0 0 1672 500" role="img" aria-label="Grid diagram" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg"><rect width="1672" height="500" rx="24" fill="#f8f9fa" stroke="#e0e4e9"/><rect x="643.5" y="143" width="385" height="430" rx="36" stroke="#e0e4e9" stroke-width="10" fill="none"/><rect x="648.5" y="148" width="375" height="420" rx="32" fill="#fff"/><rect x="664.5" y="148" width="343.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="643.5" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="656.5" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">16</text><path d="M648.5 140v8M648.5 144h16.0M664.5 140v8" stroke="#00267f" fill="none"/><rect x="1002.5" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="1015.5" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">16</text><path d="M1007.5 140v8M1007.5 144h16.0M1023.5 140v8" stroke="#00267f" fill="none"/><path d="M664.5 330v-8M664.5 326h343.0M1007.5 330v-8" stroke="#00267f" fill="none"/><rect x="810.0" y="315" width="52" height="22" rx="4" fill="#00267f"/><text x="836.0" y="330" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">fluid</text></svg>

### Tablet (800px – 1439px)

The 12 columns apply. Use fraction classes to span them; `-from-desktop`
variants still stack here.

<svg viewBox="0 0 1672 500" role="img" aria-label="Grid diagram" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg"><rect width="1672" height="500" rx="24" fill="#f8f9fa" stroke="#e0e4e9"/><rect x="331" y="143" width="1010" height="430" rx="36" stroke="#e0e4e9" stroke-width="10" fill="none"/><rect x="336" y="148" width="1000" height="420" rx="32" fill="#fff"/><rect x="414.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="487.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="560.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="633.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="706.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="779.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="852.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="925.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="998.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="1071.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="1144.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="1217.0" y="148" width="41.0" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="350.0" y="112" width="50" height="22" rx="4" fill="#00267f"/><text x="375.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">fluid</text><path d="M336.0 140v8M336.0 144h78.0M414.0 140v8" stroke="#00267f" fill="none"/><rect x="1272.0" y="112" width="50" height="22" rx="4" fill="#00267f"/><text x="1297.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">fluid</text><path d="M1258.0 140v8M1258.0 144h78.0M1336.0 140v8" stroke="#00267f" fill="none"/><rect x="458.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="471.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M455.0 140v8M455.0 144h32.0M487.0 140v8" stroke="#00267f" fill="none"/><rect x="531.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="544.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M528.0 140v8M528.0 144h32.0M560.0 140v8" stroke="#00267f" fill="none"/><rect x="604.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="617.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M601.0 140v8M601.0 144h32.0M633.0 140v8" stroke="#00267f" fill="none"/><rect x="677.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="690.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M674.0 140v8M674.0 144h32.0M706.0 140v8" stroke="#00267f" fill="none"/><rect x="750.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="763.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M747.0 140v8M747.0 144h32.0M779.0 140v8" stroke="#00267f" fill="none"/><rect x="823.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="836.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M820.0 140v8M820.0 144h32.0M852.0 140v8" stroke="#00267f" fill="none"/><rect x="896.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="909.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M893.0 140v8M893.0 144h32.0M925.0 140v8" stroke="#00267f" fill="none"/><rect x="969.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="982.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M966.0 140v8M966.0 144h32.0M998.0 140v8" stroke="#00267f" fill="none"/><rect x="1042.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="1055.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M1039.0 140v8M1039.0 144h32.0M1071.0 140v8" stroke="#00267f" fill="none"/><rect x="1115.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="1128.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M1112.0 140v8M1112.0 144h32.0M1144.0 140v8" stroke="#00267f" fill="none"/><rect x="1188.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="1201.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M1185.0 140v8M1185.0 144h32.0M1217.0 140v8" stroke="#00267f" fill="none"/><path d="M414.0 330v-8M414.0 326h844.0M1258.0 330v-8" stroke="#00267f" fill="none"/><rect x="810.0" y="315" width="52" height="22" rx="4" fill="#00267f"/><text x="836.0" y="330" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">fluid</text></svg>

### Desktop (1440px and above)

The container caps at 1512px (128px margins + 1256px of content) and centres
on wider screens. `-from-desktop` fraction variants take effect here.

<svg viewBox="0 0 1672 500" role="img" aria-label="Grid diagram" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg"><rect width="1672" height="500" rx="24" fill="#f8f9fa" stroke="#e0e4e9"/><rect x="75" y="143" width="1522" height="430" rx="36" stroke="#e0e4e9" stroke-width="10" fill="none"/><rect x="80" y="148" width="1512" height="420" rx="32" fill="#fff"/><rect x="208.0" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="315.3" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="422.7" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="530.0" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="637.3" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="744.7" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="852.0" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="959.3" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="1066.7" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="1174.0" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="1281.3" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="1388.7" y="148" width="75.3" height="420" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5"/><rect x="127.0" y="112" width="34" height="22" rx="4" fill="#00267f"/><text x="144.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">128</text><path d="M80.0 140v8M80.0 144h128.0M208.0 140v8" stroke="#00267f" fill="none"/><rect x="1511.0" y="112" width="34" height="22" rx="4" fill="#00267f"/><text x="1528.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">128</text><path d="M1464.0 140v8M1464.0 144h128.0M1592.0 140v8" stroke="#00267f" fill="none"/><rect x="286.3" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="299.3" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M283.3 140v8M283.3 144h32.0M315.3 140v8" stroke="#00267f" fill="none"/><rect x="393.7" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="406.7" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M390.7 140v8M390.7 144h32.0M422.7 140v8" stroke="#00267f" fill="none"/><rect x="501.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="514.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M498.0 140v8M498.0 144h32.0M530.0 140v8" stroke="#00267f" fill="none"/><rect x="608.3" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="621.3" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M605.3 140v8M605.3 144h32.0M637.3 140v8" stroke="#00267f" fill="none"/><rect x="715.7" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="728.7" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M712.7 140v8M712.7 144h32.0M744.7 140v8" stroke="#00267f" fill="none"/><rect x="823.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="836.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M820.0 140v8M820.0 144h32.0M852.0 140v8" stroke="#00267f" fill="none"/><rect x="930.3" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="943.3" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M927.3 140v8M927.3 144h32.0M959.3 140v8" stroke="#00267f" fill="none"/><rect x="1037.7" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="1050.7" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M1034.7 140v8M1034.7 144h32.0M1066.7 140v8" stroke="#00267f" fill="none"/><rect x="1145.0" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="1158.0" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M1142.0 140v8M1142.0 144h32.0M1174.0 140v8" stroke="#00267f" fill="none"/><rect x="1252.3" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="1265.3" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M1249.3 140v8M1249.3 144h32.0M1281.3 140v8" stroke="#00267f" fill="none"/><rect x="1359.7" y="112" width="26" height="22" rx="4" fill="#00267f"/><text x="1372.7" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">32</text><path d="M1356.7 140v8M1356.7 144h32.0M1388.7 140v8" stroke="#00267f" fill="none"/><path d="M208.0 330v-8M208.0 326h1256.0M1464.0 330v-8" stroke="#00267f" fill="none"/><rect x="814.0" y="315" width="44" height="22" rx="4" fill="#00267f"/><text x="836.0" y="330" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">1256</text></svg>

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
