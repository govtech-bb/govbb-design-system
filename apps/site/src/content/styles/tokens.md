---
title: Tokens
description: The custom properties for colour, type, spacing and radii that every component is built on.
lede: Custom properties for colour, type, spacing and radii, in two tiers.
order: 1
---

Design tokens are CSS custom properties, all prefixed `--govbb-`. They ship
inside the design system stylesheet — there is no separate token package —
and every component style resolves to them. Use them in your own CSS so your
service stays consistent with the components, and picks up palette changes
automatically when the system updates.

## Two tiers

Tokens come in two tiers, and the tier tells you whether you should reach for
one.

**Primitives** mirror the Figma variable ramp — the raw palette, named by hue
and step: `--govbb-blue-100`, `--govbb-teal-00`, `--govbb-red-10` and so on.
Each colour family runs from a dark `00` shade through pale tints (`10`, `40`)
to the saturated `100`. Primitives say what a colour _is_, not what it is
_for_, so treat them as the source the semantic tier resolves to rather than
something to use directly.

**Semantic tokens** are the small tier built on top. Each one names a job —
`--govbb-color-brand`, `--govbb-color-error`, `--govbb-color-interactive` —
and aliases the primitive that currently does that job. Prefer these: if the
palette is retuned, the semantic name keeps meaning the right thing and your
CSS needs no changes.

## Using tokens

Import the stylesheet once — everything else is plain CSS.

```js
import '@govtech-bb/frontend/css';
```

If you are not using a bundler, link the built file (`dist/govbb.css`) in your
page `<head>` instead. The tokens are declared on `:root`, so any rule on the
page can use them:

```css
.app-panel {
  background: var(--govbb-color-highlight);
  padding: var(--govbb-space-m);
  border-radius: var(--govbb-radius);
}
```

## Semantic colour tokens

These are the colour tokens to build with. The [Colour](/styles/colour/) page
resolves each one to its hex value and documents the full primitive ramp.

| Token                              | Maps to               | Use for                                       |
| ---------------------------------- | --------------------- | --------------------------------------------- |
| `--govbb-color-brand`              | `--govbb-blue-100`    | Brand ultramarine — headers, brand surfaces   |
| `--govbb-color-brand-accent`       | `--govbb-yellow-100`  | Brand gold accent                             |
| `--govbb-color-ink`                | `--govbb-black-00`    | Body text                                     |
| `--govbb-color-surface`            | `--govbb-white-00`    | Page and component backgrounds                |
| `--govbb-color-muted`              | `--govbb-mid-grey-00` | Secondary text, hints                         |
| `--govbb-color-interactive`        | `--govbb-teal-00`     | Primary actions, checked form-control fill    |
| `--govbb-color-interactive-active` | own value             | Pressed state of the primary action           |
| `--govbb-color-focus`              | `--govbb-teal-100`    | Focus ring                                    |
| `--govbb-color-focus-danger`       | `--govbb-red-100`     | Focus ring on destructive actions             |
| `--govbb-color-error`              | `--govbb-red-00`      | Invalid state — error text, borders, messages |
| `--govbb-color-neutral`            | `--govbb-grey-00`     | Secondary fills, dividers                     |
| `--govbb-color-highlight`          | `--govbb-blue-10`     | Selected surfaces                             |
| `--govbb-color-tertiary`           | `--govbb-green-00`    | Tertiary actions                              |

`--govbb-color-interactive-active` is the one semantic token with its own
value (`#0a4549`, a darkened interactive teal) rather than a primitive alias.

## Type, spacing and radius tokens

The other token groups follow the same pattern — a small named scale you use
instead of raw values:

- **Type** — `--govbb-font-sans` (the Figtree stack) plus a size ramp from
  `--govbb-font-size-display` down to `--govbb-font-size-caption-sm`, with
  matching line-height tokens. See [Typography](/styles/typography/).
- **Spacing** — a scale from `--govbb-space-xxs` (4px) to `--govbb-space-xl`
  (128px). See [Spacing](/styles/spacing/).
- **Radius and borders** — `--govbb-radius` (4px) for rounded corners and
  `--govbb-border-width-form` (2px) for form-control borders, plus
  `--govbb-opacity-disabled` and `--govbb-shadow-form-hover` for form states.
