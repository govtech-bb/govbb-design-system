---
title: List
description: Use lists to present related items, plain or with bullets or numbers.
lede: Lists group related items, plain by default or with bullets or numbers.
group: Content
---

## Preview

```html title="List variants"
<ul class="govbb-list" role="list">
  <li>
    <a class="govbb-link" href="/services/passports/">Apply for a passport</a>
  </li>
  <li>
    <a class="govbb-link" href="/services/register-birth/">Register a birth</a>
  </li>
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

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="list-when-to-use">
    <h3 id="list-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a bulleted list for related items when their order does not matter.</li>
      <li>Use a numbered list for steps, rankings or instructions where sequence matters.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="list-when-not-to-use">
    <h3 id="list-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use a list for values users need to compare across columns; use a <a href="/components/table/">table</a>.</li>
      <li>Do not use it for key–value facts or review answers; use a <a href="/components/summary-list/">summary list</a>.</li>
    </ul>
  </section>
</div>

## Best practices

### Keep list items parallel

Start items with the same kind of word or phrase and keep them similar in
length. Introduce the list with a sentence that explains what the items share.

### Use real list markup

Use `ul` or `ol` with `li` elements rather than typed bullets, line breaks or
visual spacing. Keep each item focused; split complicated instructions into
separate steps.
