---
title: Typography
description: The Figtree typeface, the type scale and the text utility classes.
lede: Figtree, an eight-step type scale, and utility classes to apply it.
order: 5
examples: true
---

## Typeface

The design system uses [Figtree](https://fonts.google.com/specimen/Figtree),
a friendly geometric sans-serif. The font files ship with the
`@govtech-bb/frontend` package as variable-weight woff2 subsets, so you do
not need to load it from a font service: importing the design system CSS is
enough.

The stack is published as `--govbb-font-sans`, which falls back to the system
sans-serif stack while the font loads or where it lacks a glyph. Figtree is
served in the 400 to 700 weight range: regular (400) for text, semibold (600)
for headings, and bold (700) for the display size and UI labels.

Body text is set at 20px (`--govbb-font-size-body`) with a line height of 1.5
by default. You get this for free on any page that includes the design
system CSS. Code and other figures that need to line up in a column use
`--govbb-font-mono`, a system monospace stack.

## Type scale

The scale is published two ways: as tokens (`--govbb-font-size-*` and
`--govbb-line-height-*`) and as opt-in `.govbb-text-*` utility classes that
pair each size with its line height and weight. Prefer the classes; reach for
the raw tokens only in your own CSS.

| Class                | Size (mobile/tablet/desktop) | Line height       | Use for                          |
| -------------------- | ---------------------------- | ----------------- | -------------------------------- |
| `govbb-text-display` | 48 / 64 / 80px               | 1                 | hero headings on landing pages   |
| `govbb-text-h1`      | 40 / 48 / 56px               | 1.2 / 1.17 / 1.14 | page titles                      |
| `govbb-text-h2`      | 28 / 32 / 40px               | 1.29 / 1.25 / 1.2 | section headings                 |
| `govbb-text-h3`      | 28px                         | 1.29              | sub-section headings             |
| `govbb-text-h4`      | 20px                         | 1.5               | minor headings                   |
| `govbb-text-body-lg` | 24px                         | 1.5               | lead paragraphs and pull-outs    |
| `govbb-text-body`    | 20px                         | 1.5               | body text (the default)          |
| `govbb-text-body-sm` | 16px                         | 1.5               | supporting text, hints, metadata |

Display, h1 and h2 step up with the viewport across three tiers. Everything
from h3 down holds one size at every width:
body drives the type inside buttons, inputs and labels, so a responsive body
would resize every control on a breakpoint, and the steps just above body stay
pinned so they never collapse into it. Display and h1
also carry a slight negative tracking (`--govbb-letter-spacing-heading`), which
large type needs and body text does not.

The display class is bold (700), the heading classes are semibold (600), and
the body classes are regular (400). Where a run of body text needs visual bolding,
add `govbb-text-bold`; where the emphasis is semantic, use `<strong>` instead.
Because they are utilities, they win over component typography, so applying
one to a component element is an explicit override.

Use `govbb-text-body-lg` once per page at most, as the opening paragraph that
summarises what follows. Use `govbb-text-body-sm` sparingly, for hints and
metadata: the bulk of body copy should be `govbb-text-body`.

In React, the `Heading` and `Text` components apply these classes for you:
`<Heading as="h1">` renders an `h1` with `govbb-text-h1`, and `size` changes
the class independently of the element. `Text` takes `as` (`p`, `span`, `div`),
`size` (`body-lg`, `body`, `body-sm`) and `weight` (`bold`).

```html title="Type scale"
<p class="govbb-text-display">Display</p>
<p class="govbb-text-h1">Heading 1</p>
<p class="govbb-text-h2">Heading 2</p>
<p class="govbb-text-h3">Heading 3</p>
<p class="govbb-text-h4">Heading 4</p>
<p class="govbb-text-body-lg">Large body text</p>
<p class="govbb-text-body">Body text</p>
<p class="govbb-text-body-sm">Small body text</p>
```

## Headings

Choose the heading element for the document structure and the class for the
size. The two are deliberately independent:

```html title="Heading with a size class"
<h1 class="govbb-text-h1">Register a birth</h1>
```

In React this is `<Heading as="h1" size="h1">`, or just `<Heading as="h1">`,
since `size` defaults to matching the element.

Headings balance their lines (`text-wrap: balance`) and paragraphs avoid a
lone word on the last line (`text-wrap: pretty`) without any class.

Bare `h1`–`h6` are already on the scale: `h1` through `h4` take their matching
step, `h5` matches body size and relies on weight, and `h6` drops to body-sm.
Server-rendered HTML is right with no classes at all, and a `.govbb-text-*`
class is only needed where the size should differ from the level. Keep heading
levels in order without skipping. If an `h3` looks too small for its place
on the page, change its class, not its level. Use one `h1` per page, and
reserve `govbb-text-display` for landing-page heroes rather than routine page
titles.

## Long-form content

Rendered markdown and other long-form copy goes in `.govbb-prose`. It sets the
vertical rhythm between blocks, sizes bare `h2`–`h4`, lists, code, blockquotes
and tables from the same tokens, and caps text at a 66-character measure
(`--govbb-measure`) so lines stay easy to track.

Components keep working inside it: every prose rule is written at zero
specificity, so a `govbb-` class always wins, and component blocks are exempt
from the measure so they can use the full column width.

```html title="Prose"
<div class="govbb-prose">
  <h2>Before you start</h2>
  <p>You will need your national registration number.</p>
  <div class="govbb-status-banner">…</div>
</div>
```

## Links

Links inside body content get quiet base styles automatically. Where a link
needs the full treatment (underline offset, hover and focus highlight states),
use the `govbb-link` class or the React `Link` component. See the
[Link component](/components/link/) for guidance and examples.

## Lists

Lists have their own page under typography. See
[Lists](/styles/typography/lists/) for the plain, bulleted and numbered
variants with live examples.
