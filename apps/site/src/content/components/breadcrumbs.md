---
title: Breadcrumbs
description: Use breadcrumbs to show users where a page sits in the site structure.
lede: Shows where the current page sits in the site hierarchy.
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
      <a class="govbb-breadcrumbs__link" href="/services">Services</a>
    </li>
    <li class="govbb-breadcrumbs__item">
      <a class="govbb-breadcrumbs__link" href="/services/passports"
        >Passports</a
      >
    </li>
  </ol>
</nav>
```

```tsx
import { Breadcrumbs } from '@govtech-bb/react';

<Breadcrumbs
  items={[
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/services/passports', label: 'Passports' },
  ]}
/>;
```

Breadcrumbs show the pages above the current one in the site hierarchy, so
users can orient themselves and move up a level. They sit at the top of the
page, before the page heading.

## When to use this component

Use breadcrumbs on content pages that sit within a hierarchy of sections, such
as a service page inside a category. Start with _Home_ and list each ancestor
in order. The current page does not need to appear in the trail.

## When not to use this component

Do not use breadcrumbs inside a multi-page form or transaction — showing exit
routes mid-journey invites users to abandon their progress. Use a
[back button](/components/back-button/) there instead. Avoid showing both on
the same page.

## Collapsing on mobile

On small screens the full trail can wrap awkwardly. Use the
`--collapse-on-mobile` modifier to show only the parent crumb on mobile,
giving users the single most useful destination.

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
      <a class="govbb-breadcrumbs__link" href="/services">Services</a>
    </li>
    <li class="govbb-breadcrumbs__item">
      <a class="govbb-breadcrumbs__link" href="/services/passports"
        >Passports</a
      >
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
    { href: '/services', label: 'Services' },
    { href: '/services/passports', label: 'Passports' },
  ]}
/>;
```
