---
title: Breadcrumbs
description: Use breadcrumbs to help users understand where they are in the site and move back up the hierarchy.
lede: A trail of links showing where the current page sits in the site hierarchy.
group: Navigation
---

## Preview

```html title="Breadcrumbs"
<nav class="govbb-breadcrumbs" aria-label="Breadcrumb">
  <ol class="govbb-breadcrumbs__list">
    <li class="govbb-breadcrumbs__item">
      <a class="govbb-breadcrumbs__link" href="/">Home</a>
    </li>
    <li class="govbb-breadcrumbs__item">
      <a class="govbb-breadcrumbs__link" href="/travel">
        Travel and identification
      </a>
    </li>
    <li class="govbb-breadcrumbs__item">
      <a class="govbb-breadcrumbs__link" href="/travel/passports">Passports</a>
    </li>
  </ol>
</nav>
```

```tsx
import { Breadcrumbs } from '@govtech-bb/react';

<Breadcrumbs
  items={[
    { href: '/', label: 'Home' },
    { href: '/travel', label: 'Travel and identification' },
    { href: '/travel/passports', label: 'Passports' },
  ]}
/>;
```

The Breadcrumbs component shows the pages above the current one in the site
hierarchy, starting from the homepage. It does not include the current page:
users can see that from the page title. The chevron separators are drawn with
CSS, so nothing extra is announced to screen readers.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="breadcrumbs-when-to-use">
    <h3 id="breadcrumbs-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use breadcrumbs when a page sits several levels deep in a website hierarchy.</li>
      <li>Use them when users may arrive on an interior page from search or an external link and need orientation.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="breadcrumbs-when-not-to-use">
    <h3 id="breadcrumbs-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use breadcrumbs to show progress through a linear service; use the <a href="/components/back-button/">back button</a>.</li>
      <li>Do not add them to a flat website or when the same path is already clear from nearby navigation.</li>
    </ul>
  </section>
</div>

## Best practices

### Reflect the website structure

Start with the homepage and end with the parent of the current page. Use short,
recognisable labels that match the destination headings.

### Use semantic navigation

Wrap the ordered list in a `nav` labelled “Breadcrumb”. Keep separators out of
the accessible name and mark the current page when it appears in the trail.

## Collapsing on mobile

If a deep trail risks crowding a small screen, use the
`govbb-breadcrumbs--collapse-on-mobile` modifier. On mobile it shows only the
first and last items in the trail; on larger screens the full trail returns.

```html title="Collapsed on mobile"
<nav
  class="govbb-breadcrumbs govbb-breadcrumbs--collapse-on-mobile"
  aria-label="Breadcrumb"
>
  <ol class="govbb-breadcrumbs__list">
    <li class="govbb-breadcrumbs__item">
      <a class="govbb-breadcrumbs__link" href="/">Home</a>
    </li>
    <li class="govbb-breadcrumbs__item">
      <a class="govbb-breadcrumbs__link" href="/business">Business</a>
    </li>
    <li class="govbb-breadcrumbs__item">
      <a class="govbb-breadcrumbs__link" href="/business/licences">Licences</a>
    </li>
    <li class="govbb-breadcrumbs__item">
      <a class="govbb-breadcrumbs__link" href="/business/licences/liquor">
        Liquor licences
      </a>
    </li>
  </ol>
</nav>
```

```tsx
import { Breadcrumbs } from '@govtech-bb/react';

<Breadcrumbs
  collapseOnMobile
  items={[
    { href: '/', label: 'Home' },
    { href: '/business', label: 'Business' },
    { href: '/business/licences', label: 'Licences' },
    { href: '/business/licences/liquor', label: 'Liquor licences' },
  ]}
/>;
```
