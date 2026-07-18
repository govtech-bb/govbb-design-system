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
    This page is in <a href="/service/alpha/">Alpha</a>. Your feedback will help
    us improve it.
  </p>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="alpha">
  <p>
    This page is in <a href="/service/alpha/">Alpha</a>. Your feedback will help
    us improve it.
  </p>
</StatusBanner>;
```

The Status banner component is a coloured strip that tells users where a page
sits in its lifecycle: in Alpha or Beta testing, migrated from an older site,
or affected by a service disruption. It holds one or two short paragraphs.

It comes in two shapes. The default is an inline block that sits inside the
page content column and brings its own padding. For the strip directly below
the header, use the full-width shape instead: the background bleeds edge to
edge while the text stays aligned with the page content column.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="status-banner-when-to-use">
    <h3 id="status-banner-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a status banner when a page or service condition changes what users should expect.</li>
      <li>Use it for a service disruption, moved content or a relevant lifecycle message.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="status-banner-when-not-to-use">
    <h3 id="status-banner-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it for form validation; use an <a href="/components/error-summary/">error summary</a> and inline messages.</li>
      <li>Do not stack banners or use one for routine content that belongs in the page body.</li>
    </ul>
  </section>
</div>

## Best practices

### State the impact and next step

Explain what has changed, who is affected and what users can do. Keep the
message to one or two sentences and link to detail only when it helps users act.

### Match urgency to semantics

Do not rely on colour alone to communicate the variant. Use an assertive live
role only for an urgent change that must interrupt the user; use ordinary
content for information already present when the page loads.

## Page-level use

For the one-per-page strip directly below the header, add the
`govbb-status-banner--full-width` modifier and wrap the content in
`govbb-width-container govbb-status-banner__inner`. This is the same
full-bleed pattern the official banner, header and footer use: the tinted
background spans the viewport and the text lines up with the rest of the page
content. Do not wrap the banner in your own container or override its padding.

```html title="Full-width status banner"
<div
  class="govbb-status-banner govbb-status-banner--alpha govbb-status-banner--full-width"
>
  <div class="govbb-width-container govbb-status-banner__inner">
    <p>
      This page is in <a href="/service/alpha/">Alpha</a>. Your feedback will
      help us improve it.
    </p>
  </div>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="alpha" fullWidth>
  <p>
    This page is in <a href="/service/alpha/">Alpha</a>. Your feedback will help
    us improve it.
  </p>
</StatusBanner>;
```

In React the `fullWidth` prop adds the modifier and renders the inner width
container for you.

## Variants

Each variant has its own background colour: `--alpha` and `--beta` for pages
under test, `--migrated` for content moved from an older site, and `--service`
for service disruptions.

```html title="Status banner variants"
<div class="govbb-status-banner govbb-status-banner--beta">
  <p>
    This page is in <a href="/service/beta/">Beta</a>. Your feedback will help
    us improve it.
  </p>
</div>
<div class="govbb-status-banner govbb-status-banner--migrated">
  <p>
    This page has moved from an older site.
    <a href="/service/moved/">Learn more</a>
  </p>
</div>
<div class="govbb-status-banner govbb-status-banner--service">
  <p>
    Passport appointments are currently disrupted.
    <a href="/service-status/">Check status</a>
  </p>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="beta">
  <p>
    This page is in <a href="/service/beta/">Beta</a>. Your feedback will help us improve it.
  </p>
</StatusBanner>
<StatusBanner variant="migrated">
  <p>
    This page has moved from an older site.
    <a href="/service/moved/">Learn more</a>
  </p>
</StatusBanner>
<StatusBanner variant="service">
  <p>
    Passport appointments are currently disrupted.
    <a href="/service-status/">Check status</a>
  </p>
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
  <p>
    This page has moved from an older site.
    <a href="/service/moved/">Learn more</a>
  </p>
</div>
```

```tsx
import { StatusBanner } from '@govtech-bb/react';

<StatusBanner variant="migrated" rounded>
  <p>
    This page has moved from an older site.
    <a href="/service/moved/">Learn more</a>
  </p>
</StatusBanner>;
```
