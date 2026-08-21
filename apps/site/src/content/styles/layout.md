---
title: Layout
description: How to structure a page with the width container, main wrapper and grid.
order: 3
lede: Structure pages with the width container, main wrapper and column grid.
---

Layout classes are page scaffolding, not components: they only decide how
regions of a page occupy space. They ship in the design system CSS; there are
no React wrappers, so use the classes directly in any framework.

## Grid presets

The grid is a 12-column CSS grid with a fixed 32px gutter between columns.
Page margins (the space either side of the content) are fluid: they grow
linearly with the viewport from 16px at the mobile frame (375px) to 128px at
the desktop frame (1512px), where the container stops growing and centres.

| Range            | Columns             | Column gutter | Page margins   | Container width |
| ---------------- | ------------------- | ------------- | -------------- | --------------- |
| below 800px      | stacked, full width | none          | 16px to 58px   | fluid           |
| 800px to 1439px  | 12                  | 32px          | 58px to 121px  | fluid           |
| 1440px and above | 12                  | 32px          | 121px to 128px | max 1512px      |

### Mobile (below 800px)

Every column stacks to full width. Use for phones and small tablets in
portrait.

<svg viewBox="0 0 450 313" role="img" aria-label="Grid diagram" style="width:100%;height:auto;display:block;background:#f8f9fa;border:1px solid #e0e4e9;border-radius:8px" xmlns="http://www.w3.org/2000/svg"><rect x="34.7646484375" y="38.0" width="380.626953125" height="340" rx="16.880859375" stroke="#e0e4e9" stroke-width="5.626953125" fill="none"/><rect x="37.578125" y="40.8" width="375" height="340" rx="14.0673828125" fill="#fff"/><rect x="53.6" y="57.7" width="343" height="39.4" rx="2.110107421875" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="0.70"/><rect x="53.6" y="108.3" width="343" height="39.4" rx="2.110107421875" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="0.70"/><rect x="53.6" y="159.0" width="343" height="39.4" rx="2.110107421875" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="0.70"/><rect x="36.3" y="12.7" width="18.7" height="14.1" rx="2.8" fill="#00267f"/><text x="45.6" y="23.0" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9.1" fill="#fff">16</text><path d="M37.6 32.4v5.6M37.6 35.2H53.6M53.6 32.4v5.6" stroke="#00267f" stroke-width="0.70" fill="none"/><rect x="395.3" y="12.7" width="18.7" height="14.1" rx="2.8" fill="#00267f"/><text x="404.6" y="23.0" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9.1" fill="#fff">16</text><path d="M396.6 32.4v5.6M396.6 35.2H412.6M412.6 32.4v5.6" stroke="#00267f" stroke-width="0.70" fill="none"/><path d="M53.6 218.0v5.6M53.6 220.9H396.6M396.6 218.0v5.6" stroke="#00267f" stroke-width="0.70" fill="none"/><rect x="207.2" y="213.8" width="35.7" height="14.1" rx="2.8" fill="#00267f"/><text x="225.1" y="224.1" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9.1" fill="#fff">fluid</text></svg>

### Tablet (800px to 1439px)

The 12 columns apply. Use fraction classes to span them; `-from-desktop`
variants still stack here.

<svg viewBox="0 0 1134 615" role="img" aria-label="Grid diagram" style="width:100%;height:auto;display:block;background:#f8f9fa;border:1px solid #e0e4e9;border-radius:8px" xmlns="http://www.w3.org/2000/svg"><rect x="59.7890625" y="95.7" width="1014.171875" height="640" rx="42.515625" stroke="#e0e4e9" stroke-width="14.171875" fill="none"/><rect x="66.875" y="102.7" width="1000" height="640" rx="35.4296875" fill="#fff"/><rect x="144.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="217.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="290.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="363.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="436.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="509.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="582.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="655.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="728.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="801.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="874.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="947.9" y="102.7" width="41.0" height="640" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="1.77"/><rect x="61.0" y="31.9" width="89.8" height="35.4" rx="7.1" fill="#00267f"/><text x="105.9" y="57.9" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23.0" fill="#fff">fluid</text><path d="M66.9 81.5v14.2M66.9 88.6H144.9M144.9 81.5v14.2" stroke="#00267f" stroke-width="1.77" fill="none"/><rect x="983.0" y="31.9" width="89.8" height="35.4" rx="7.1" fill="#00267f"/><text x="1027.9" y="57.9" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23.0" fill="#fff">fluid</text><path d="M988.9 81.5v14.2M988.9 88.6H1066.9M1066.9 81.5v14.2" stroke="#00267f" stroke-width="1.77" fill="none"/><rect x="178.4" y="31.9" width="47.0" height="35.4" rx="7.1" fill="#00267f"/><text x="201.9" y="57.9" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23.0" fill="#fff">32</text><path d="M185.9 81.5v14.2M185.9 88.6H217.9M217.9 81.5v14.2" stroke="#00267f" stroke-width="1.77" fill="none"/><rect x="324.4" y="31.9" width="47.0" height="35.4" rx="7.1" fill="#00267f"/><text x="347.9" y="57.9" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23.0" fill="#fff">32</text><path d="M331.9 81.5v14.2M331.9 88.6H363.9M363.9 81.5v14.2" stroke="#00267f" stroke-width="1.77" fill="none"/><rect x="470.4" y="31.9" width="47.0" height="35.4" rx="7.1" fill="#00267f"/><text x="493.9" y="57.9" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23.0" fill="#fff">32</text><path d="M477.9 81.5v14.2M477.9 88.6H509.9M509.9 81.5v14.2" stroke="#00267f" stroke-width="1.77" fill="none"/><rect x="616.4" y="31.9" width="47.0" height="35.4" rx="7.1" fill="#00267f"/><text x="639.9" y="57.9" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23.0" fill="#fff">32</text><path d="M623.9 81.5v14.2M623.9 88.6H655.9M655.9 81.5v14.2" stroke="#00267f" stroke-width="1.77" fill="none"/><rect x="762.4" y="31.9" width="47.0" height="35.4" rx="7.1" fill="#00267f"/><text x="785.9" y="57.9" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23.0" fill="#fff">32</text><path d="M769.9 81.5v14.2M769.9 88.6H801.9M801.9 81.5v14.2" stroke="#00267f" stroke-width="1.77" fill="none"/><rect x="908.4" y="31.9" width="47.0" height="35.4" rx="7.1" fill="#00267f"/><text x="931.9" y="57.9" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23.0" fill="#fff">32</text><path d="M915.9 81.5v14.2M915.9 88.6H947.9M947.9 81.5v14.2" stroke="#00267f" stroke-width="1.77" fill="none"/><path d="M144.9 364.5v14.2M144.9 371.5H988.9M988.9 364.5v14.2" stroke="#00267f" stroke-width="1.77" fill="none"/><rect x="522.0" y="353.8" width="89.8" height="35.4" rx="7.1" fill="#00267f"/><text x="566.9" y="379.8" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23.0" fill="#fff">fluid</text></svg>

### Desktop (1440px and above)

The container caps at 1512px (128px margins + 1256px of content) and centres
on wider screens. `-from-desktop` fraction variants take effect here.

<svg viewBox="0 0 1694 841" role="img" aria-label="Grid diagram" style="width:100%;height:auto;display:block;background:#f8f9fa;border:1px solid #e0e4e9;border-radius:8px" xmlns="http://www.w3.org/2000/svg"><rect x="80.2890625" y="142.9" width="1533.171875" height="860" rx="63.515625" stroke="#e0e4e9" stroke-width="21.171875" fill="none"/><rect x="90.875" y="153.5" width="1512" height="860" rx="52.9296875" fill="#fff"/><rect x="218.9" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="326.2" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="433.5" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="540.9" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="648.2" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="755.5" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="862.9" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="970.2" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="1077.5" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="1184.9" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="1292.2" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="1399.5" y="153.5" width="75.3" height="860" fill="#e5e9f2" stroke="#99a8cc" stroke-opacity="0.5" stroke-width="2.65"/><rect x="109.1" y="47.6" width="91.5" height="52.9" rx="10.6" fill="#00267f"/><text x="154.9" y="86.5" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34.4" fill="#fff">128</text><path d="M90.9 121.7v21.2M90.9 132.3H218.9M218.9 121.7v21.2" stroke="#00267f" stroke-width="2.65" fill="none"/><rect x="1493.1" y="47.6" width="91.5" height="52.9" rx="10.6" fill="#00267f"/><text x="1538.9" y="86.5" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34.4" fill="#fff">128</text><path d="M1474.9 121.7v21.2M1474.9 132.3H1602.9M1602.9 121.7v21.2" stroke="#00267f" stroke-width="2.65" fill="none"/><rect x="275.1" y="47.6" width="70.2" height="52.9" rx="10.6" fill="#00267f"/><text x="310.2" y="86.5" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34.4" fill="#fff">32</text><path d="M294.2 121.7v21.2M294.2 132.3H326.2M326.2 121.7v21.2" stroke="#00267f" stroke-width="2.65" fill="none"/><rect x="489.8" y="47.6" width="70.2" height="52.9" rx="10.6" fill="#00267f"/><text x="524.9" y="86.5" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34.4" fill="#fff">32</text><path d="M508.9 121.7v21.2M508.9 132.3H540.9M540.9 121.7v21.2" stroke="#00267f" stroke-width="2.65" fill="none"/><rect x="704.4" y="47.6" width="70.2" height="52.9" rx="10.6" fill="#00267f"/><text x="739.5" y="86.5" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34.4" fill="#fff">32</text><path d="M723.5 121.7v21.2M723.5 132.3H755.5M755.5 121.7v21.2" stroke="#00267f" stroke-width="2.65" fill="none"/><rect x="919.1" y="47.6" width="70.2" height="52.9" rx="10.6" fill="#00267f"/><text x="954.2" y="86.5" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34.4" fill="#fff">32</text><path d="M938.2 121.7v21.2M938.2 132.3H970.2M970.2 121.7v21.2" stroke="#00267f" stroke-width="2.65" fill="none"/><rect x="1133.8" y="47.6" width="70.2" height="52.9" rx="10.6" fill="#00267f"/><text x="1168.9" y="86.5" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34.4" fill="#fff">32</text><path d="M1152.9 121.7v21.2M1152.9 132.3H1184.9M1184.9 121.7v21.2" stroke="#00267f" stroke-width="2.65" fill="none"/><rect x="1348.4" y="47.6" width="70.2" height="52.9" rx="10.6" fill="#00267f"/><text x="1383.5" y="86.5" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34.4" fill="#fff">32</text><path d="M1367.5 121.7v21.2M1367.5 132.3H1399.5M1399.5 121.7v21.2" stroke="#00267f" stroke-width="2.65" fill="none"/><path d="M218.9 504.1v21.2M218.9 514.7H1474.9M1474.9 504.1v21.2" stroke="#00267f" stroke-width="2.65" fill="none"/><rect x="790.5" y="488.2" width="112.8" height="52.9" rx="10.6" fill="#00267f"/><text x="846.9" y="527.1" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34.4" fill="#fff">1256</text></svg>

## Breakpoint tokens

Breakpoints are named `@custom-media` queries, inlined at build time by
Lightning CSS. Components reference the names, never the numbers.

<svg viewBox="0 0 1280 345" role="img" aria-label="Screen size breakpoint diagram" style="width:100%;height:auto;display:block;background:#f8f9fa;border:1px solid #e0e4e9;border-radius:8px" xmlns="http://www.w3.org/2000/svg"><line x1="496.7" y1="0" x2="496.7" y2="345" stroke="#99a8cc" stroke-width="2.00" stroke-dasharray="4 16"/><line x1="1108.1" y1="0" x2="1108.1" y2="345" stroke="#99a8cc" stroke-width="2.00" stroke-dasharray="4 16"/><line x1="6.0" y1="155.25" x2="490.7" y2="155.25" stroke="#00267f" stroke-width="2.00"/><line x1="502.7" y1="155.25" x2="1102.1" y2="155.25" stroke="#00267f" stroke-width="2.00"/><line x1="1114.1" y1="155.25" x2="1274.0" y2="155.25" stroke="#00267f" stroke-width="2.00"/><rect x="187.0" y="71.3" width="122.7" height="40.0" rx="8" fill="#00267f"/><text x="248.4" y="99.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" fill="#fff">mobile</text><rect x="741.0" y="71.3" width="122.7" height="40.0" rx="8" fill="#00267f"/><text x="802.4" y="99.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" fill="#fff">tablet</text><rect x="1124.6" y="71.3" width="138.8" height="40.0" rx="8" fill="#00267f"/><text x="1194.0" y="99.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" fill="#fff">desktop</text><line x1="90.7" y1="155.25" x2="90.7" y2="175.3" stroke="#1a1a1a" stroke-width="4"/><text x="90.7" y="215.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="600" fill="#1a1a1a">375</text><text x="90.7" y="251.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="600" fill="#1a1a1a">(mobile frame)</text><line x1="267.5" y1="155.25" x2="267.5" y2="175.3" stroke="#1a1a1a" stroke-width="2"/><text x="267.5" y="215.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="400" fill="#1a1a1a">560</text><line x1="496.7" y1="155.25" x2="496.7" y2="175.3" stroke="#1a1a1a" stroke-width="4"/><text x="496.7" y="215.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="600" fill="#1a1a1a">800</text><text x="496.7" y="251.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="600" fill="#1a1a1a">(--tablet)</text><line x1="710.7" y1="155.25" x2="710.7" y2="175.3" stroke="#1a1a1a" stroke-width="2"/><text x="710.7" y="215.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="400" fill="#1a1a1a">1024</text><line x1="955.2" y1="155.25" x2="955.2" y2="175.3" stroke="#1a1a1a" stroke-width="2"/><text x="955.2" y="215.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="400" fill="#1a1a1a">1280</text><line x1="1108.1" y1="155.25" x2="1108.1" y2="175.3" stroke="#1a1a1a" stroke-width="4"/><text x="1108.1" y="215.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="600" fill="#1a1a1a">1440</text><text x="1108.1" y="251.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="600" fill="#1a1a1a">(--desktop)</text><line x1="1176.8" y1="155.25" x2="1176.8" y2="239.3" stroke="#1a1a1a" stroke-width="4"/><text x="1176.8" y="291.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="600" fill="#1a1a1a">1512</text><text x="1176.8" y="327.3" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26.0" font-weight="600" fill="#1a1a1a">(cap)</text></svg>

| Token       | Applies       | Grid behaviour                       |
| ----------- | ------------- | ------------------------------------ |
| `--mobile`  | below 800px   | columns stack full width             |
| `--tablet`  | 800px and up  | fraction classes take their spans    |
| `--desktop` | 1440px and up | `-from-desktop` variants take effect |

The page margin needs no breakpoint at all: it is one clamp,
`clamp(16px, 9.85vw − 1.31rem, 128px)`, which passes through both design
anchors (16px at 375, 128px at 1512) and holds beyond.

## Page scaffold

Put `govbb-page` on the `<body>`: it makes the page fill the viewport and
pins the footer to the bottom when content is short.

Every page wraps its content in the width container, which owns the side
margins, and in the main wrapper, which owns the vertical breathing room and
carries the `main-content` id that a skip link targets. Both classes normally
sit on the same `<main>`:

```html
<body class="govbb-page">
  <!-- official banner, header -->
  <main class="govbb-width-container govbb-main-wrapper" id="main-content">
    <div class="govbb-grid-row">
      <div class="govbb-grid-column-two-thirds">
        <h1 class="govbb-text-h1">Page title</h1>
      </div>
    </div>
  </main>
  <!-- footer -->
</body>
```

Split them only when something has to line up with the page column while
sitting outside the `main` landmark — a page-level notice, say. Then the
container is a wrapping `<div>` and the `<main>` keeps the wrapper:

```html
<div class="govbb-width-container">
  <div class="govbb-status-banner govbb-status-banner--alpha">…</div>
  <main class="govbb-main-wrapper" id="main-content">…</main>
</div>
```

The header, official banner and footer sit outside the width container and use
it internally for their own content, so they can paint full-bleed backgrounds.

The container centres itself with automatic side margins once the page is wider
than 1512px. Inside the `govbb-page` column that would stop it stretching, so
the stylesheet keeps a direct child of `govbb-page` at full width — you do not
need to set a width yourself.

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
tablet and only takes its fraction on desktop. Use it when a sidebar is too
cramped at tablet widths.

Rows nest: a `govbb-grid-row` inside a column starts a fresh 12-column grid
scoped to that column's width.

## When to use the grid

Use the grid whenever a page places content side by side: a main column with
a sidebar, cards in halves or quarters, or a form constrained to two-thirds so
line lengths stay readable.

Do not use the grid for spacing inside a component: components own their
internal layout. Do not nest grids more than one level deep; if a layout needs
that, simplify the page instead.
