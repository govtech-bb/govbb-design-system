---
title: List
description: Use lists to present related items as plain, bulleted or numbered lists.
lede: Presents related items — plain, bulleted, or numbered.
group: Content
---

## Preview

```html title="Plain list"
<ul class="govbb-list">
  <li><a class="govbb-link" href="/passports">Apply for a passport</a></li>
  <li><a class="govbb-link" href="/births">Register a birth</a></li>
</ul>
```

```tsx
import { Link, List } from '@govtech-bb/react';

<List>
  <li>
    <Link href="/passports">Apply for a passport</Link>
  </li>
  <li>
    <Link href="/births">Register a birth</Link>
  </li>
</List>;
```

The list component styles related items consistently with the design system's
type scale and spacing. The plain variant has no markers and suits lists of
links; bulleted and numbered variants suit body content.

## When to use this component

Use a list to make a set of related items easier to scan than a sentence.
Choose the variant by meaning: plain for navigation-style lists of links,
bullets for items with no order, numbers for steps that happen in order.

## When not to use this component

Do not use a list for a single item, or to break up prose that reads fine as
a sentence. For pairs of terms and values — like an application summary — use
the [summary list](/components/summary-list/) instead.

## Bulleted list

```html title="Bulleted list"
<ul class="govbb-list govbb-list--bullet">
  <li>Proof of address</li>
  <li>National ID card</li>
</ul>
```

```tsx
import { List } from '@govtech-bb/react';

<List variant="bullet">
  <li>Proof of address</li>
  <li>National ID card</li>
</List>;
```

## Numbered list

Use numbers when the order matters, such as the steps of a process.

```html title="Numbered list"
<ol class="govbb-list govbb-list--number">
  <li>Fill in the form</li>
  <li>Pay the fee</li>
</ol>
```

```tsx
import { List } from '@govtech-bb/react';

<List variant="number">
  <li>Fill in the form</li>
  <li>Pay the fee</li>
</List>;
```
