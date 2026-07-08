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
hierarchy, starting from the homepage. It does not include the current page —
users can see that from the page title. The chevron separators are drawn with
CSS, so nothing extra is announced to screen readers.

## When to use this component

Use breadcrumbs when a page sits within a hierarchy of more than one level and
users are likely to want to move back up it — for example, from a guide about
renewing a passport up to the passports topic page.

## When not to use this component

Do not use breadcrumbs inside a linear, multi-step transaction — use the
[back button](/components/back-button) instead. Avoid breadcrumbs if the site
is only one level deep, where a link back to the homepage does the same job
with less noise.

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
