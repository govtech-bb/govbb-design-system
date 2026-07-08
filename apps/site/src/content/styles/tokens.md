---
title: Tokens
description: The custom properties for colour, type, spacing and radii that every component is built on.
lede: Custom properties for colour, type, spacing and radii, in two tiers.
order: 1
---

Design tokens are CSS custom properties, all prefixed `--govbb-`. They ship
inside the design system stylesheet (there is no separate token package)
and every component style resolves to them. Use them in your own CSS so your
service stays consistent with the components, and picks up palette changes
automatically when the system updates.

The tables on this page are generated from the design system's `tokens.css`
at build time, so the values shown are always the values that ship.

## Two tiers

Tokens come in two tiers, and the tier tells you whether you should reach for
one.

**Primitives** mirror the Figma variable ramp: the raw palette, named by hue
and step, such as `--govbb-blue-100`, `--govbb-teal-00` or `--govbb-red-10`.
Each colour family runs from a dark `00` shade through pale tints (`10`, `40`)
to the saturated `100`. Primitives say what a colour _is_, not what it is
_for_, so treat them as the source the semantic tier resolves to rather than
something to use directly.

**Semantic tokens** are the small tier built on top. Each one names a job
(`--govbb-color-brand`, `--govbb-color-error`, `--govbb-color-interactive`)
and aliases the primitive that currently does that job. Prefer these: if the
palette is retuned, the semantic name keeps meaning the right thing and your
CSS needs no changes.

## How tokens build a component

The real button, annotated. Each callout is a token its stylesheet actually
references, and the fill resolves through the semantic tier to one primitive.
Pick a new value for `--govbb-teal-00` and the button, the callout, and every
other component on the same tokens follow. No component CSS changes.

```token-demo
live: true
```

## Using tokens

Import the stylesheet once. Everything else is plain CSS.

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
documents the full primitive ramp each one resolves to.

```token-table
tokens: semantic-colors
kind: color
aliases: true
label: Semantic colour tokens
```

`--govbb-color-interactive-active` is the one semantic token with its own
value (a darkened interactive teal) rather than a primitive alias.

## Type tokens

The typeface stack and the size ramp. The [Typography](/styles/typography/)
page pairs each size with its line height and shows the `.govbb-text-*`
utility classes that apply them.

```token-table
tokens: pick --govbb-font-sans
label: Font stack token
```

```token-table
tokens: prefix --govbb-font-size-
kind: size
label: Font size tokens
```

## Spacing tokens

A single rem-based scale, from `xxs` to `xl`. See [Spacing](/styles/spacing/)
for how to apply it.

```token-table
tokens: prefix --govbb-space-
kind: space
label: Spacing tokens
```

## Radius and form tokens

Rounded corners, form-control borders and form states.

```token-table
tokens: pick --govbb-radius
kind: radius
label: Radius token
```

```token-table
tokens: pick --govbb-border-width-form --govbb-opacity-disabled --govbb-shadow-form-hover
label: Form state tokens
```
