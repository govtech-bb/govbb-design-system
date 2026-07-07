---
title: Pill
description: Use pills to label items with a short category or type.
lede: A small rounded label that tags an item with its category or type.
group: Content
---

## Preview

```html title="Pill"
<span class="govbb-pill">Information service</span>
<span class="govbb-pill">Digital service</span>
```

```tsx
import { Pill } from '@govtech-bb/react';

<Pill>Information service</Pill>
<Pill>Digital service</Pill>
```

The pill is a small rounded label for tagging an item with its category or
type — for example marking a service in a list as a _Digital service_.

## When to use this component

Use a pill to add a short piece of metadata to an item in a list or card, so
users can tell items apart at a glance. Keep the text to a word or two.

## When not to use this component

Do not use a pill for status that changes or needs attention — a phase or
disruption notice belongs in a [status banner](/components/status-banner/).
Do not make pills interactive; if it needs to be clickable, use a
[link](/components/link/) or [button](/components/button/) instead. Avoid
covering an item in several pills — one, maybe two, or the labels stop
meaning anything.
