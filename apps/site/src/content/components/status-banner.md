---
title: Status banner
description: Use a status banner to tell users where a page sits in its lifecycle.
lede: A coloured strip stating where a page sits in its lifecycle.
group: Feedback
---

## Preview

```html title="Alpha status banner"
<div class="govbb-status-banner govbb-status-banner--alpha">
  <p>
    This page is in <a href="#">Alpha</a>. Your feedback will help us improve
    it.
  </p>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="alpha">
  This page is in <a href="#">Alpha</a>. Your feedback will help us improve it.
</StatusBanner>;
```

The Status banner component is a full-width coloured strip that tells users
where a page sits in its lifecycle: in Alpha or Beta testing, migrated from an
older site, or affected by a service disruption. It holds one or two short
paragraphs.

## When to use this component

Use a status banner when the state of the page changes what users should
expect from it: a service still being tested, content moved from an older
site, or a disruption to the service the page describes. Show one banner per
page, directly below the header, and keep the message to a sentence or two
with a link to more detail or a feedback route.

## When not to use this component

Do not use a status banner for form validation errors. Use the error summary
and error messages instead. Do not stack more than one banner on a page, and
do not use one for routine content that isn't about the page's status.

## Variants

Each variant has its own background colour: `--alpha` and `--beta` for pages
under test, `--migrated` for content moved from an older site, and `--service`
for service disruptions.

```html title="Status banner variants"
<div class="govbb-status-banner govbb-status-banner--beta">
  <p>
    This page is in <a href="#">Beta</a>. Your feedback will help us improve it.
  </p>
</div>
<div class="govbb-status-banner govbb-status-banner--migrated">
  <p>This page has moved from an older site. <a href="#">Learn more</a></p>
</div>
<div class="govbb-status-banner govbb-status-banner--service">
  <p>
    Passport appointments are currently disrupted. <a href="#">Check status</a>
  </p>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="beta">
  This page is in <a href="#">Beta</a>. Your feedback will help us improve it.
</StatusBanner>
<StatusBanner variant="migrated">
  This page has moved from an older site. <a href="#">Learn more</a>
</StatusBanner>
<StatusBanner variant="service">
  Passport appointments are currently disrupted. <a href="#">Check status</a>
</StatusBanner>
```

## Rounded corners

Add the `govbb-status-banner--rounded` modifier for a softer corner when the
banner is nested inside content rather than sitting edge-to-edge below the
header.

```html title="Rounded status banner"
<div
  class="govbb-status-banner govbb-status-banner--migrated govbb-status-banner--rounded"
>
  <p>This page has moved from an older site. <a href="#">Learn more</a></p>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="migrated" rounded>
  This page has moved from an older site. <a href="#">Learn more</a>
</StatusBanner>;
```
