---
title: Status banner
description: Use a status banner to tell users the phase of a page or a service disruption.
lede: Tells users a page is in alpha or beta, has moved, or that a service is disrupted.
group: Feedback
---

## Preview

```html title="Beta banner" full
<div class="govbb-status-banner govbb-status-banner--beta">
  <p>
    This page is in <a href="/beta">Beta</a>. Your feedback will help us improve
    it.
  </p>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="beta">
  This page is in <a href="/beta">Beta</a>. Your feedback will help us improve
  it.
</StatusBanner>;
```

The status banner is a full-width strip that sets expectations about the page
it sits on: that it is a new page still being tested, that it has moved from
an older site, or that the service it describes is disrupted. It sits below
the header, above the page content.

## When to use this component

Use a status banner when the page's status genuinely changes what users
should expect — and link to somewhere they can learn more or give feedback.
Remove the banner when the status no longer applies; a permanent banner
teaches users to ignore it.

## When not to use this component

Do not use a status banner for form validation — use the
[error summary](/components/error-summary/) for that. Do not use it for
labelling items in a list; that is a [pill](/components/pill/).

## Variants

The variant is required and sets the banner's colour and role: **alpha** and
**beta** mark the phase of a new page, **migrated** marks content moved from
an older site, and **service** flags a disruption to the service itself.

```html title="Alpha banner" full
<div class="govbb-status-banner govbb-status-banner--alpha">
  <p>
    This page is in <a href="/alpha">Alpha</a>. Your feedback will help us
    improve it.
  </p>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="alpha">
  This page is in <a href="/alpha">Alpha</a>. Your feedback will help us improve
  it.
</StatusBanner>;
```

```html title="Service disruption banner" full
<div class="govbb-status-banner govbb-status-banner--service">
  <p>This service is currently disrupted. <a href="/status">Check status</a></p>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="service">
  This service is currently disrupted. <a href="/status">Check status</a>
</StatusBanner>;
```

## Rounded corners

Add the `--rounded` modifier when the banner sits inset within content rather
than spanning the full page width.

```html title="Migrated banner, rounded"
<div
  class="govbb-status-banner govbb-status-banner--migrated govbb-status-banner--rounded"
>
  <p>This page has moved from an older site. <a href="/about">Learn more</a></p>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="migrated" rounded>
  This page has moved from an older site. <a href="/about">Learn more</a>
</StatusBanner>;
```
