# @govtech-bb/frontend

Framework-agnostic CSS, design tokens, assets, and progressive-enhancement
JavaScript for the GovBB Design System.

## Install

```sh
pnpm add @govtech-bb/frontend@alpha
```

**Install the `alpha` tag, not the default.** Every release so far is a
prerelease, so they all publish under `alpha` and none of them moves `latest` —
which still points at an old build. A plain `pnpm add @govtech-bb/frontend`
resolves to it and gives you a package several releases behind, missing
component fixes without any error to explain why. Check what you resolved with
`npm view @govtech-bb/frontend dist-tags`, and pin the version in
`package.json` so a later install cannot drift.

Import the complete stylesheet once in your application entry:

```js
import '@govtech-bb/frontend/css';
```

The stylesheet includes the GovBB tokens, Figtree font faces, base styles,
layout helpers, components, focus states, and utilities. Tokens are exposed as
prefixed CSS custom properties such as `--govbb-color-brand` and
`--govbb-space-s`.

## Progressive enhancement

HTML for Header, FileUpload, and NumberInput marked with `data-govbb-module`
needs the small JavaScript runtime. Initialise it after the document exists:

```js
import { initAll } from '@govtech-bb/frontend';

initAll();
```

`initAll(root)` also accepts a `ParentNode`, which is useful when inserting a
fragment or enhancing a same-origin preview document. It safely ignores
components that were already initialised.

React applications normally use `@govtech-bb/react`; those wrappers include
their own behaviour and must not also be passed to `initAll()`.

## Assets

Fonts and GovBB image assets are exported below
`@govtech-bb/frontend/assets/*`. Copy or resolve them with your bundler and pass
their public URLs to components such as Header, Footer, and OfficialBanner.

## Tailwind

The core package does not require Tailwind. Tailwind consumers can use the
prefixed tokens directly without an adapter:

```tsx
<div className="bg-[var(--govbb-color-brand)] p-[var(--govbb-space-s)]" />
```

The compiled GovBB stylesheet is intentionally unlayered so generic consumer
resets cannot silently outrank its components. If your application needs
Tailwind utilities to override component declarations, make that cascade-layer
decision explicitly and test the resulting import order in the application.

## Without a bundler

Copy `dist/govbb.css`, `index.js`, and any required `assets/` files from the
installed package into your public build. Preserve the relationship between
`dist/govbb.css` and `assets/fonts/` so the bundled font URLs continue to
resolve.
