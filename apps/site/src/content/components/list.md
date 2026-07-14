---
title: List
description: Use lists to present related items, plain or with bullets or numbers.
lede: Lists group related items, plain by default or with bullets or numbers.
group: Content
---

## Preview

```html title="List variants"
<ul class="govbb-list">
  <li><a class="govbb-link" href="#">Apply for a passport</a></li>
  <li><a class="govbb-link" href="#">Register a birth</a></li>
</ul>
<ul class="govbb-list govbb-list--bullet">
  <li>Proof of address</li>
  <li>National ID card</li>
</ul>
<ol class="govbb-list govbb-list--number">
  <li>Fill in the form</li>
  <li>Pay the fee</li>
</ol>
```

```tsx
import { List } from '@govtech-bb/react';

<List>
  <li>Apply for a passport</li>
</List>
<List variant="bullet">
  <li>Proof of address</li>
</List>
<List variant="number">
  <li>Fill in the form</li>
</List>
```

Lists are plain by default, with no markers and no indent, which suits lists
of links or short rows. Add the `--bullet` modifier for an unordered list of
items, or `--number` for steps that must happen in order. The React `List`
renders a `<ul>` for the plain and bullet variants and an `<ol>` for the
number variant.

## When to use this component

Use a list to make blocks of related content easier to scan, such as a set of
task links, the documents a user must provide, or the steps in a process. Use
the number variant only when the order matters.

## When not to use this component

Do not use a list for tabular data with more than one value per item, such as
fees and processing times together. Use the [table](/components/table/)
component instead. Do not use a list for a user's answers as key/value pairs;
use the [summary list](/components/summary-list/) component.
