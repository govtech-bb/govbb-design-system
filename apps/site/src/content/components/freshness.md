---
title: Freshness
description: Use the freshness line to tell users when a content page was last updated.
lede: A quiet line under the page heading saying when the content last changed.
group: Content
---

## Preview

```html title="Freshness line"
<p class="govbb-freshness">
  Last updated on <time datetime="2026-03-12">12 March 2026</time>
</p>
```

```tsx
import { Freshness } from '@govtech-bb/react';

<Freshness>
  Last updated on <time dateTime="2026-03-12">12 March 2026</time>
</Freshness>;
```

The freshness line tells users how current a page's content is. It sits under
the page heading, in muted, medium-weight small text, with a rule underneath
that separates it from the content that follows. Do not add
`govbb-text-body-sm` to it: that class resets the weight to regular.

Wrap the date in a `time` element with a machine-readable `datetime`
attribute. In React the whole line is children, so you keep control of the
wording and the date format. Pass inline content only, such as text and a
`time` element. The line is already a paragraph, so wrapping it in
`<Text as="p">` nests one paragraph inside another.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="freshness-when-to-use">
    <h3 id="freshness-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use it on guidance and information pages where users need to know whether the content is current.</li>
      <li>Place it once, directly under the page heading.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="freshness-when-not-to-use">
    <h3 id="freshness-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it on form pages or transactional steps; the date says nothing useful there.</li>
      <li>Do not use it to announce that a page has moved or changed status; use a <a href="/components/status-banner/">status banner</a>.</li>
    </ul>
  </section>
</div>

## Best practices

### Show the date the content changed

Use the date someone last changed what the page says, not the date it was
last deployed or rebuilt. A date that moves without the content changing
teaches users to ignore it.

### Write the date in full

Write dates as day, month in words and year, for example 12 March 2026, so
they cannot be misread.
