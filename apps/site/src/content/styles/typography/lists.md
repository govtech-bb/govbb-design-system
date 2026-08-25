---
title: Lists
description: Use lists to make blocks of text easier to read and scan.
lede: Lists group related items so they are easier to read and scan.
examples: true
order: 1
---

## Preview

```html title="Plain list"
<ul class="govbb-list">
  <li>
    <a class="govbb-link" href="/services/passports/">Apply for a passport</a>
  </li>
  <li>
    <a class="govbb-link" href="/services/register-birth/">Register a birth</a>
  </li>
  <li>
    <a class="govbb-link" href="/services/drivers-licence/">
      Renew a driver's licence
    </a>
  </li>
</ul>
```

```tsx
import { List } from '@govtech-bb/react';

<List>
  <li>
    <a className="govbb-link" href="/services/passports/">
      Apply for a passport
    </a>
  </li>
  <li>
    <a className="govbb-link" href="/services/register-birth/">
      Register a birth
    </a>
  </li>
  <li>
    <a className="govbb-link" href="/services/drivers-licence/">
      Renew a driver's licence
    </a>
  </li>
</List>;
```

Lists are plain by default (no markers and no indent), which suits
lists of links or rows, like a list of government services. Bulleted and
numbered variants opt back into markers with a hanging indent.

## When to use lists

Use a list to group related items, such as documents to bring, steps to
follow, or links to services. The plain list works well for navigation-style
lists of links; the bulleted and numbered variants suit items within body text.

## When not to use lists

Do not use a list for key/value information such as a user's answers. Use a
summary list instead. Do not use it for data that users need to compare across
columns. Use a table instead.

## Bulleted and numbered lists

Use the `--bullet` modifier for an unordered set of items, and the `--number`
modifier (on an `<ol>`) when the order matters, such as the steps in a process.

Introduce a bulleted list with a lead-in line ending in a colon. Start each
item with a lowercase letter and leave off the full stop. Numbered lists need
no lead-in, and each item is a full sentence ending in a full stop.

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
