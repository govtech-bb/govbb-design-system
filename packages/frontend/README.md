# @govtech-bb/frontend

Framework-agnostic CSS, design tokens, assets, and progressive-enhancement
JavaScript for the GovBB Design System.

## Install

```sh
pnpm add @govtech-bb/frontend@alpha
```

Import the complete stylesheet once in your application entry:

```js
import '@govtech-bb/frontend/css';
```

The stylesheet includes the GovBB tokens, Figtree font faces, base styles,
layout helpers, components, focus states, and utilities. Tokens are exposed as
prefixed CSS custom properties such as `--govbb-color-brand` and
`--govbb-space-s`.

## Tailwind

Tailwind v4 consumers can register the tokens as theme values, so utilities
like `bg-teal-80`, `p-s` and `text-body` resolve to the same custom properties
the components use:

```css
@import 'tailwindcss';
@import '@govtech-bb/frontend/tailwind';
@import '@govtech-bb/frontend/css' layer(components);
```

The `tailwind` export registers names only. Import `css` as well for the token
values and the components — separately, so you choose which cascade layer they
land in. Putting them in a layer keeps them below your own utilities, which is
usually what you want.

Colour utilities follow the design system's ramp, where `10` is lightest and
`80`/`90` darkest — `bg-teal-80` is the dark teal. Spacing uses the token
names (`p-s`, `gap-xs`, `mb-m`), and every `text-*` size carries its paired
line height.

`dist/tailwind.css` is generated from `src/tokens.css` at build time, so it
cannot drift from the tokens. Add a token and the build maps it; a test fails
if a new token is neither mapped nor explicitly skipped.

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
