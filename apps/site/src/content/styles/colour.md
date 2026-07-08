---
title: Colour
description: The palette — semantic colour tokens and the primitive ramp they resolve to, with hex values.
lede: Use colour through semantic tokens; reach for the primitive ramp only for a specific shade.
order: 2
examples: true
---

Always apply colour through [tokens](/styles/tokens/), never hex values. Start
with the semantic tokens — they name a job, stay correct if the palette is
retuned, and cover almost every case. Drop down to a primitive only when you
genuinely need a specific shade with no semantic meaning.

## Semantic colours

| Token                              | Hex       | Use for                                       |
| ---------------------------------- | --------- | --------------------------------------------- |
| `--govbb-color-brand`              | `#00267f` | Brand ultramarine — headers, brand surfaces   |
| `--govbb-color-brand-accent`       | `#ffc726` | Brand gold accent                             |
| `--govbb-color-ink`                | `#000`    | Body text                                     |
| `--govbb-color-surface`            | `#fff`    | Page and component backgrounds                |
| `--govbb-color-muted`              | `#595959` | Secondary text, hints                         |
| `--govbb-color-interactive`        | `#0e5f64` | Primary actions, checked form-control fill    |
| `--govbb-color-interactive-active` | `#0a4549` | Pressed state of the primary action           |
| `--govbb-color-focus`              | `#30c0c8` | Focus ring                                    |
| `--govbb-color-focus-danger`       | `#ff6b6b` | Focus ring on destructive actions             |
| `--govbb-color-error`              | `#a42c2c` | Invalid state — error text, borders, messages |
| `--govbb-color-neutral`            | `#e0e4e9` | Secondary fills, dividers                     |
| `--govbb-color-highlight`          | `#e5e9f2` | Selected surfaces                             |
| `--govbb-color-tertiary`           | `#00654a` | Tertiary actions                              |

```html
<div style="width: 120px; font-size: 14px; font-family: system-ui, sans-serif">
  <div
    style="height: 56px; border-radius: 4px; border: 1px solid #e0e4e9; background: var(--govbb-color-brand)"
  ></div>
  <p style="margin: 8px 0 0">brand</p>
</div>
<div style="width: 120px; font-size: 14px; font-family: system-ui, sans-serif">
  <div
    style="height: 56px; border-radius: 4px; border: 1px solid #e0e4e9; background: var(--govbb-color-brand-accent)"
  ></div>
  <p style="margin: 8px 0 0">brand-accent</p>
</div>
<div style="width: 120px; font-size: 14px; font-family: system-ui, sans-serif">
  <div
    style="height: 56px; border-radius: 4px; border: 1px solid #e0e4e9; background: var(--govbb-color-interactive)"
  ></div>
  <p style="margin: 8px 0 0">interactive</p>
</div>
<div style="width: 120px; font-size: 14px; font-family: system-ui, sans-serif">
  <div
    style="height: 56px; border-radius: 4px; border: 1px solid #e0e4e9; background: var(--govbb-color-tertiary)"
  ></div>
  <p style="margin: 8px 0 0">tertiary</p>
</div>
<div style="width: 120px; font-size: 14px; font-family: system-ui, sans-serif">
  <div
    style="height: 56px; border-radius: 4px; border: 1px solid #e0e4e9; background: var(--govbb-color-focus)"
  ></div>
  <p style="margin: 8px 0 0">focus</p>
</div>
<div style="width: 120px; font-size: 14px; font-family: system-ui, sans-serif">
  <div
    style="height: 56px; border-radius: 4px; border: 1px solid #e0e4e9; background: var(--govbb-color-error)"
  ></div>
  <p style="margin: 8px 0 0">error</p>
</div>
<div style="width: 120px; font-size: 14px; font-family: system-ui, sans-serif">
  <div
    style="height: 56px; border-radius: 4px; border: 1px solid #e0e4e9; background: var(--govbb-color-neutral)"
  ></div>
  <p style="margin: 8px 0 0">neutral</p>
</div>
<div style="width: 120px; font-size: 14px; font-family: system-ui, sans-serif">
  <div
    style="height: 56px; border-radius: 4px; border: 1px solid #e0e4e9; background: var(--govbb-color-highlight)"
  ></div>
  <p style="margin: 8px 0 0">highlight</p>
</div>
```

## Primitive ramp

Primitives mirror the Figma variable ramp. Each family runs from a dark `00`
shade through pale tints (`10`, `40`) to the saturated `100`. The notes column
records which semantic token, if any, aliases the shade.

### Neutrals

| Token                 | Hex       | Notes                   |
| --------------------- | --------- | ----------------------- |
| `--govbb-white-00`    | `#fff`    | `--govbb-color-surface` |
| `--govbb-black-00`    | `#000`    | `--govbb-color-ink`     |
| `--govbb-grey-00`     | `#e0e4e9` | `--govbb-color-neutral` |
| `--govbb-mid-grey-00` | `#595959` | `--govbb-color-muted`   |

### Blue

| Token              | Hex       | Notes                     |
| ------------------ | --------- | ------------------------- |
| `--govbb-blue-00`  | `#00164a` |                           |
| `--govbb-blue-10`  | `#e5e9f2` | `--govbb-color-highlight` |
| `--govbb-blue-40`  | `#99a8cc` | Fails AA as text on white |
| `--govbb-blue-100` | `#00267f` | `--govbb-color-brand`     |

### Teal

| Token              | Hex       | Notes                       |
| ------------------ | --------- | --------------------------- |
| `--govbb-teal-00`  | `#0e5f64` | `--govbb-color-interactive` |
| `--govbb-teal-10`  | `#eaf9f9` |                             |
| `--govbb-teal-40`  | `#ace6e9` |                             |
| `--govbb-teal-100` | `#30c0c8` | `--govbb-color-focus`       |

### Green

| Token               | Hex       | Notes                    |
| ------------------- | --------- | ------------------------ |
| `--govbb-green-00`  | `#00654a` | `--govbb-color-tertiary` |
| `--govbb-green-10`  | `#e9f9f3` |                          |
| `--govbb-green-40`  | `#a5e5ce` |                          |
| `--govbb-green-100` | `#1fbf84` |                          |

### Red

| Token             | Hex       | Notes                        |
| ----------------- | --------- | ---------------------------- |
| `--govbb-red-00`  | `#a42c2c` | `--govbb-color-error`        |
| `--govbb-red-10`  | `#fff0f0` |                              |
| `--govbb-red-40`  | `#ffc4c4` |                              |
| `--govbb-red-100` | `#ff6b6b` | `--govbb-color-focus-danger` |

### Yellow

| Token                | Hex       | Notes                        |
| -------------------- | --------- | ---------------------------- |
| `--govbb-yellow-00`  | `#e8a833` |                              |
| `--govbb-yellow-10`  | `#fff9e9` |                              |
| `--govbb-yellow-40`  | `#ffe9a8` |                              |
| `--govbb-yellow-100` | `#ffc726` | `--govbb-color-brand-accent` |

### Pink

| Token              | Hex       | Notes |
| ------------------ | --------- | ----- |
| `--govbb-pink-00`  | `#ad1157` |       |
| `--govbb-pink-10`  | `#fff4fb` |       |
| `--govbb-pink-40`  | `#ffd4f0` |       |
| `--govbb-pink-100` | `#ff94d9` |       |

### Purple

| Token                | Hex       | Notes                       |
| -------------------- | --------- | --------------------------- |
| `--govbb-purple-00`  | `#4a235a` |                             |
| `--govbb-purple-40`  | `#ddc0e9` |                             |
| `--govbb-purple-100` | `#a962c7` | The family has no `10` step |

## Accessibility

Every text and background combination must meet
[WCAG AA contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html):
4.5:1 for body text, 3:1 for large text and interface graphics. The dark `00`
shades pass as text on white (except `--govbb-yellow-00`); the pale `10` and
`40` tints and the vivid `100` shades generally do not — treat those as
backgrounds and accents. For
example, `--govbb-blue-40` on white is roughly 2.4:1, so it must never carry
text. Check any combination the tables do not already vouch for before you
ship it.
