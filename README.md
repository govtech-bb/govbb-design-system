# GovBB Design System

The design system for official Government of Barbados websites — design tokens
and CSS components compiled to a single stylesheet, plus the documentation
site published at **design-system.gov.bb**.

The design system is **CSS-first and framework-agnostic**: vanilla CSS (no
Sass, no Tailwind, no StyleX), bundled and minified with
[Lightning CSS](https://lightningcss.dev). The CSS is the single source of
truth; a small progressive-enhancement runtime and thin React wrappers sit on
top of it — see [Architecture](#architecture).

## Layout

pnpm workspace with two packages plus the docs site (the GOV.UK Frontend model:
CSS + PE JS in one package, React wrapper separate for its peer dep):

- `packages/frontend` (`@govtech-bb/frontend`) — the framework-agnostic core.
  - `src/tokens.css` — tokens as `:root` custom properties (primitive ramp from
    the Figma variables, then a small semantic tier).
  - `src/components/*.css` — one file per component: plain `govbb-*` classes
    themed by the tokens.
  - `src/index.css` — CSS entry; `@import`s tokens + components → `dist/govbb.css`
    (exported as `@govtech-bb/frontend/css`).
  - `index.js` — plain-ESM PE runtime: `initAll()` upgrades `[data-govbb-module]`
    elements (the package's main export; no build).
  - `index.html` — the playground (Vite dev server, hot-reload).
- `packages/react` (`@govtech-bb/react`) — thin React wrappers over the classes
  (cva-based; behaviour reused from `frontend`).
- `apps/site` — the documentation site (bespoke Astro static site).

## Prerequisites

- **Node** — see [`.nvmrc`](.nvmrc) (`nvm use` to match).
- **pnpm** — pinned via the `packageManager` field; run `corepack enable`.

```sh
corepack enable
pnpm install
```

## Scripts

```sh
pnpm dev          # styles playground at http://localhost:5173
pnpm build        # recursive build (styles → dist/govbb.css)
pnpm site:dev     # documentation site at http://localhost:4321
pnpm site:build   # static site → apps/site/dist/
pnpm lint         # oxlint + stylelint
pnpm format       # prettier --write .
```

Browser support comes from the `browserslist` field in `package.json`;
Lightning CSS downlevels modern syntax to match.

## Using the compiled CSS

Components ship as plain CSS classes — no framework. Apply them to HTML:

```html
<link rel="stylesheet" href="govbb.css" />
<button class="govbb-button">Primary</button>
```

The stylesheet ships **unlayered** so it isn't silently overridden by consumer
resets. To scope it under a cascade layer, import it into one yourself:

```css
@import url('govbb.css') layer(govbb);
```

## Architecture

Two consumer targets, both served without framework lock-in:

- **PHP / server-rendered** — link `@govtech-bb/frontend/css`, write `govbb-*`
  classes in markup, and for behavioural components add `data-govbb-module` +
  call `initAll()` from `@govtech-bb/frontend`. This is the GOV.UK Frontend model.
- **React (GovTech)** — import the CSS once, then use the thin wrappers from
  `@govtech-bb/react` (e.g. `<Button variant="secondary">`).

Both render identical DOM and CSS. The React package is a convenience skin over
the same classes, never a second source of truth. Behaviour lives once in
`frontend`; React reuses it, PHP gets it via `initAll()`.

Deliberately **not** using Lit/Stencil (Shadow DOM fights global tokens and PHP
consumers) or StyleX (React-only, and it destroys the stable class-name API
that PHP consumers depend on).

## Documentation site

The docs site lives in [`apps/site`](apps/site) and is a bespoke
[Astro](https://astro.build) static site, modelled on the structure of the
[GOV.UK Design System](https://design-system.service.gov.uk/) with GovBB
branding. It has three sections — **Components**, **Documentation**, and
**AI skills** — plus a **Changelog** of important design decisions.

## Contributing

### Design system

- **Components** — add a CSS file under `packages/frontend/src/components/`,
  `@import` it from `packages/frontend/src/index.css`, and demo it in
  `packages/frontend/index.html`. Class names and custom properties must be
  `govbb-`-prefixed (Stylelint enforces this). For behavioural components,
  register a module in `packages/frontend/index.js`; for a React wrapper, follow
  the cva pattern in `packages/react/src/button.tsx`.
- **Tokens** — edit `packages/frontend/src/tokens.css` (primitive ramp from the
  Figma variables, then the semantic tier).

### Documentation site

- **Guidelines / standards prose** — add an `.astro` or `.mdx` page under
  `apps/site/src/pages/documentation/`, and link it from
  `documentation/index.astro`.
- **Component reference** — add a page under `apps/site/src/pages/components/`
  using [`ArticleLayout`](apps/site/src/layouts/ArticleLayout.astro) (left
  sidebar + "On this page" rail), and add it to the sidebar in
  [`src/data/nav.ts`](apps/site/src/data/nav.ts). Author each example's markup
  under `apps/site/src/examples/<component>/` and render it with the shared
  [`Example`](apps/site/src/components/Example.astro) component — a **Preview /
  Code** tab switch showing the live preview plus the HTML/CSS source with a
  copy button.
- **Changelog** — add a Markdown file under `apps/site/src/content/changelog/`
  with `title`, `date`, and optional `author` / `summary` frontmatter. The
  latest entries also surface in the homepage "What's new" block.
- **Styling** — the site uses **placeholder** GovBB tokens in
  `apps/site/src/styles/placeholder-tokens.css`, the **Figtree** web font
  (bundled temporarily via `@fontsource-variable/figtree`), and a placeholder
  coat of arms / crest. The real tokens get wired in from the root package
  (follow-up #124).

## CI & deployment

CI (the PR build check) is tracked under the development-tooling epic (#15).
Production DNS cutover for `design-system.gov.bb` is tracked under #4.
