---
title: Spacing
description: The spacing scale and how to apply it with tokens instead of hard-coded values.
order: 4
lede: A single rem-based scale for space inside and between elements.
---

All spacing in the design system comes from one scale, published as
`--govbb-space-*` custom properties in the design system CSS. The values are
in rem, so space grows with the user's text size setting rather than staying
fixed while the text gets bigger.

## The spacing scale

| Token               | Value     | Pixel equivalent |
| ------------------- | --------- | ---------------- |
| `--govbb-space-xxs` | `0.25rem` | 4px              |
| `--govbb-space-xs`  | `0.5rem`  | 8px              |
| `--govbb-space-s`   | `1rem`    | 16px             |
| `--govbb-space-xm`  | `1.5rem`  | 24px             |
| `--govbb-space-m`   | `2rem`    | 32px             |
| `--govbb-space-l`   | `4rem`    | 64px             |
| `--govbb-space-xl`  | `8rem`    | 128px            |

Pixel equivalents assume the default root size of 16px. Treat them as a
reading aid, not a target. Write the token, not the number.

## Use tokens, not hard-coded values

Reference the custom properties in your own CSS instead of typing lengths:

```css
.app-summary {
  padding: var(--govbb-space-m);
  margin-block-end: var(--govbb-space-s);
}
```

This keeps three things true:

- spacing stays consistent: everything sits on the same seven steps, so
  adjacent parts of a page do not drift a few pixels apart
- spacing scales with text: rem-based tokens respect users who increase
  their default font size
- future changes are cheap: if a step in the scale changes, every consumer
  picks it up without a find-and-replace

If a design calls for a value that is not on the scale, pick the nearest step
rather than inventing a one-off. A new step should be added to the scale, not
hard-coded in a component.

## Spacing and the layout grid

The scale and the [layout grid](/styles/layout/) share their key numbers:

- the 32px column gutter is `--govbb-space-m`
- the 128px page margin at the desktop frame is `--govbb-space-xl`

Use the grid for space **between** regions of a page: columns, sidebars,
page margins. Use spacing tokens for space **inside** a component and for
vertical rhythm between elements. Components own their internal spacing, so
you should rarely need to add space inside a design system component; if you
find yourself doing so, check whether a variant or a layout class already
covers it.
