---
title: Colour
description: 'The palette: semantic colour tokens and the primitive ramp they resolve to, with hex values.'
lede: Use colour through semantic tokens; reach for the primitive ramp only for a specific shade.
order: 2
---

Always apply colour through [tokens](/styles/tokens/), never hex values. Start
with the semantic tokens: they name a job, stay correct if the palette is
retuned, and cover almost every case. Drop down to a primitive only when you
genuinely need a specific shade with no semantic meaning.

Every swatch, value and contrast ratio on this page is generated from the
design system's `tokens.css` at build time, so what you see is what ships.

## Semantic colours

```token-table
tokens: semantic-colors
kind: color
aliases: true
contrast: true
label: Semantic colour tokens
```

## Primitive ramp

Primitives mirror the Figma variable ramp. Each family runs from a dark `00`
shade through pale tints (`10`, `40`) to the saturated `100`. The last column
records which semantic token, if any, aliases the shade.

### Neutrals

```token-table
tokens: pick --govbb-white-00 --govbb-black-00 --govbb-grey-20 --govbb-grey-70
kind: color
contrast: true
notes: aliased-by
label: Neutral primitives
```

### Blue

```token-table
tokens: family blue
kind: color
contrast: true
notes: aliased-by
label: Blue primitives
```

### Teal

```token-table
tokens: family teal
kind: color
contrast: true
notes: aliased-by
label: Teal primitives
```

### Green

```token-table
tokens: family green
kind: color
contrast: true
notes: aliased-by
label: Green primitives
```

### Red

```token-table
tokens: family red
kind: color
contrast: true
notes: aliased-by
label: Red primitives
```

### Yellow

```token-table
tokens: family yellow
kind: color
contrast: true
notes: aliased-by
label: Yellow primitives
```

### Pink

```token-table
tokens: family pink
kind: color
contrast: true
notes: aliased-by
label: Pink primitives
```

### Purple

```token-table
tokens: family purple
kind: color
contrast: true
notes: aliased-by
label: Purple primitives
```

## Accessibility

Every text and background combination must meet
[WCAG AA contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html):
4.5:1 for body text, 3:1 for large text and interface graphics. The "on
white" column above shows each shade's computed ratio against a white
background. As a rule the dark `00` shades pass as text on white (except
`--govbb-yellow-80`); the pale `10` and `40` tints and the vivid `100` shades
do not, so treat those as backgrounds and accents. Check any combination the
ratios above do not already cover before you ship it.
