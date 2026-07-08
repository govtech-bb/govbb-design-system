---
title: Typography
description: The Figtree typeface, the type scale and the text utility classes.
lede: Figtree, a nine-step type scale, and utility classes to apply it.
order: 5
examples: true
---

## Typeface

The design system uses [Figtree](https://fonts.google.com/specimen/Figtree),
a friendly geometric sans-serif. The font files ship with the
`@govtech-bb/frontend` package as variable-weight woff2 subsets, so you do
not need to load it from a font service — importing the design system CSS is
enough.

The stack is published as `--govbb-font-sans`, which falls back to the system
sans-serif stack while the font loads or where it lacks a glyph. Figtree is
served in the 400–700 weight range; the design system only uses regular (400)
and bold (700).

Body text is set at 20px (`--govbb-font-size-body`) with a line height of 1.5
by default — you get this for free on any page that includes the design
system CSS.

## Type scale

The scale is published two ways: as tokens (`--govbb-font-size-*` and
`--govbb-line-height-*`) and as opt-in `.govbb-text-*` utility classes that
pair each size with its line height and weight. Prefer the classes; reach for
the raw tokens only in your own CSS.

| Class                   | Size           | Line height | Use for                          |
| ----------------------- | -------------- | ----------- | -------------------------------- |
| `govbb-text-display`    | 5rem (80px)    | 1           | hero headings on landing pages   |
| `govbb-text-h1`         | 3.5rem (56px)  | 1.15        | page titles                      |
| `govbb-text-h2`         | 2.5rem (40px)  | 1.25        | section headings                 |
| `govbb-text-h3`         | 1.5rem (24px)  | 1.25        | sub-section headings             |
| `govbb-text-h4`         | 1.25rem (20px) | 1.5         | minor headings                   |
| `govbb-text-body-lg`    | 2rem (32px)    | 1.5         | lead paragraphs and pull-outs    |
| `govbb-text-body`       | 1.25rem (20px) | 1.5         | body text (the default)          |
| `govbb-text-caption`    | 1rem (16px)    | 1.5         | supporting text, hints, metadata |
| `govbb-text-caption-sm` | 0.75rem (12px) | 1.5         | fine print                       |

The display and heading classes are bold (700); the body and caption classes
are regular (400). Because they are utilities, they win over component
typography — applying one to a component element is an explicit override.

```html title="Type scale"
<p class="govbb-text-display">Display</p>
<p class="govbb-text-h1">Heading 1</p>
<p class="govbb-text-h2">Heading 2</p>
<p class="govbb-text-h3">Heading 3</p>
<p class="govbb-text-h4">Heading 4</p>
<p class="govbb-text-body-lg">Large body text</p>
<p class="govbb-text-body">Body text</p>
<p class="govbb-text-caption">Caption</p>
<p class="govbb-text-caption-sm">Small caption</p>
```

## Headings

Choose the heading element for the document structure and the class for the
size — they are deliberately independent:

```html title="Heading with a size class"
<h1 class="govbb-text-h1">Register a birth</h1>
```

Bare headings only get weight and rhythm from the base styles, so put a
`.govbb-text-*` class on every heading you want on the scale. Keep heading
levels in order without skipping — if an `h3` looks too small for its place
on the page, change its class, not its level. Use one `h1` per page, and
reserve `govbb-text-display` for landing-page heroes rather than routine page
titles.

## Links

Links inside body content get quiet base styles automatically. Where a link
needs the full treatment — underline offset, hover and focus highlight states
— use the `govbb-link` class or the React `Link` component. See the
[Link component](/components/link/) for guidance and examples.

## Lists

```html title="Plain list"
<ul class="govbb-list">
  <li><a class="govbb-link" href="#">Apply for a passport</a></li>
  <li><a class="govbb-link" href="#">Register a birth</a></li>
  <li><a class="govbb-link" href="#">Renew a driver's licence</a></li>
</ul>
```

```tsx
import { List } from '@govtech-bb/react';

<List>
  <li>
    <a className="govbb-link" href="#">
      Apply for a passport
    </a>
  </li>
  <li>
    <a className="govbb-link" href="#">
      Register a birth
    </a>
  </li>
  <li>
    <a className="govbb-link" href="#">
      Renew a driver's licence
    </a>
  </li>
</List>;
```

Lists are plain by default — no markers and no indent — which suits
lists of links or rows, like a list of government services. Bulleted and
numbered variants opt back into markers with a hanging indent.

### When to use lists

Use a list to group related items — such as documents to bring, steps to
follow, or links to services. The plain list works well for navigation-style
lists of links; the bulleted and numbered variants suit items within body text.

### When not to use lists

Do not use a list for key/value information such as a user's answers — use a
summary list instead. Do not use it for data that users need to compare across
columns — use a table instead.

### Bulleted and numbered lists

Use the `--bullet` modifier for an unordered set of items, and the `--number`
modifier (on an `<ol>`) when the order matters, such as the steps in a process.

```html title="Bulleted and numbered lists"
<ul class="govbb-list govbb-list--bullet">
  <li>Proof of address</li>
  <li>National ID card</li>
  <li>Two passport photos</li>
</ul>

<ol class="govbb-list govbb-list--number">
  <li>Fill in the application form</li>
  <li>Pay the fee</li>
  <li>Collect your licence from the Barbados Licensing Authority</li>
</ol>
```

```tsx
import { List } from '@govtech-bb/react';

<List variant="bullet">
  <li>Proof of address</li>
  <li>National ID card</li>
  <li>Two passport photos</li>
</List>

<List variant="number">
  <li>Fill in the application form</li>
  <li>Pay the fee</li>
  <li>Collect your licence from the Barbados Licensing Authority</li>
</List>
```
