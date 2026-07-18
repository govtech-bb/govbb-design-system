---
title: Link
description: Use links to let users navigate to another page.
lede: Lets users navigate to another page or place on a page.
group: Navigation
---

## Preview

```html title="Link in body text"
<p style="margin: 0">
  Read about
  <a class="govbb-link" href="/services/passports/renew/"
    >renewing your passport</a
  >
  before you apply.
</p>
```

```tsx
import { Link } from '@govtech-bb/react';

<p>
  Read about{' '}
  <Link href="/services/passports/renew/">renewing your passport</Link>
  before you apply.
</p>;
```

The Link component styles a text link with an underline and clear highlight
states: hovering shows a light teal background, and keyboard focus shows a
gold background instead of an outline, matching links in the error summary and
show/hide components.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="link-when-to-use">
    <h3 id="link-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a link to move to another page, service, file or location on the current page.</li>
      <li>Use descriptive text that still makes sense when read without the surrounding sentence.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="link-when-not-to-use">
    <h3 id="link-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use a link to submit, save, delete or otherwise change data; use a <a href="/components/button/">button</a>.</li>
      <li>Do not use vague text such as “Click here” or repeat the same “Read more” label for different destinations.</li>
    </ul>
  </section>
</div>

## Best practices

### Describe the destination

Front-load meaningful words, for example “Apply for a driver's licence”. Tell
users about a file type or unusual destination when that information affects
their decision.

### Keep familiar link behaviour

Use an underline in body content, provide visible hover and focus states and
show visited state where it helps orientation. Avoid opening a new tab unless
there is a strong user need, and warn users when you do.

## Links without a permanent underline

Add the `govbb-link--no-underline` modifier to show the underline only on
interaction. Use this in dense contexts or alongside already-underlined text,
where a permanent underline would add noise, for example a list of ministry
services in a navigation panel.

```html title="Link without a permanent underline"
<a
  class="govbb-link govbb-link--no-underline"
  href="/services/nis-contributions/"
>
  Check your NIS contributions
</a>
```

```tsx
import { Link } from '@govtech-bb/react';

<Link href="/services/nis-contributions/" noUnderline>
  Check your NIS contributions
</Link>;
```

## Visited links

Add the `govbb-link--no-visited` modifier to keep visited links in the
surrounding text colour. Use this in navigation, where a changed visited
colour adds no useful information, but leave it off in long content pages,
where knowing which links you have already followed helps.

```html title="Link that keeps its colour after visiting"
<a class="govbb-link govbb-link--no-visited" href="/ministries/home-affairs/">
  Ministry of Home Affairs
</a>
```

```tsx
import { Link } from '@govtech-bb/react';

<Link href="/ministries/home-affairs/" noVisited>
  Ministry of Home Affairs
</Link>;
```
