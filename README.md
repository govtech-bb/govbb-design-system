# GovBB Design System

The design system for official Government of Barbados websites — design tokens
and CSS components, compiled to a single stylesheet.

This is a **CSS-first single package**: vanilla CSS (no Sass, no Tailwind),
bundled and minified with [Lightning CSS](https://lightningcss.dev). A
framework layer (Lit / Stencil) may be added later — see
[Moving to Lit / Stencil later](#moving-to-lit--stencil-later).

## Layout

- `src/tokens.css` — design tokens as `:root` CSS custom properties (source of
  truth). Placeholder values today; will be generated from the Figma variables
  once published (#4).
- `src/components/*.css` — one file per component: plain classes
  (`.govbb-btn`, …) themed by the token custom properties, with fallbacks so
  they render without the tokens.
- `src/index.css` — entry point; `@import`s tokens + components.
- `index.html` — the playground (Vite dev server, hot-reload).

## Prerequisites

- **Node** — see [`.nvmrc`](.nvmrc) (`nvm use` to match).
- **pnpm** — pinned via the `packageManager` field; run `corepack enable`.

```sh
corepack enable
pnpm install
```

## Scripts

```sh
pnpm dev          # playground at http://localhost:5173
pnpm build        # bundle + minify → dist/govbb.css
pnpm lint         # oxlint
pnpm format       # prettier --write .
```

Browser support comes from the `browserslist` field in `package.json`;
Lightning CSS downlevels modern syntax to match.

## Using the compiled CSS

Components ship as plain CSS classes — no framework. Apply them to HTML:

```html
<link rel="stylesheet" href="govbb.css" />
<button class="govbb-btn">Primary</button>
<button class="govbb-btn govbb-btn--secondary">Secondary</button>
```

The stylesheet ships **unlayered** so it isn't silently overridden by consumer
resets. To scope it under a cascade layer, import it into one yourself:

```css
@import url('govbb.css') layer(govbb);
```

### Moving to Lit / Stencil later

The visual design lives entirely in `src/*.css` — framework-agnostic. A future
web-component layer wraps the same markup and adopts the compiled sheet into
its shadow root (or applies it in light DOM), so nothing here is thrown away.
When that lands, split into publishable packages (`@govbb/tokens`,
`@govbb/css`, `@govbb/components`).

## Contributing

- **Components** — add a CSS file under `src/components/`, `@import` it from
  `src/index.css`, and demo it in `index.html`.
- **Tokens** — edit `src/tokens.css`. These are a **placeholder baseline**
  today and will be replaced with the official GovBB tokens (#4).

## CI & deployment

CI (the PR build check) is tracked under the development-tooling epic (#15).
Production DNS cutover for `design-system.gov.bb` is tracked under #4.
