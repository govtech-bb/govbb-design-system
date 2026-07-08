---
title: Link
description: Use links to let users navigate to another page.
lede: Lets users navigate to another page or place on a page.
group: Navigation
---

## Preview

```html title="Link in body text"
<p style="margin: 0">
  Read about <a class="govbb-link" href="#">renewing your passport</a> before
  you apply.
</p>
```

```tsx
import { Link } from '@govtech-bb/react';

<p>
  Read about <Link href="#">renewing your passport</Link> before you apply.
</p>;
```

The Link component styles a text link with an underline and clear highlight
states — hovering shows a light teal background, and keyboard focus shows a
gold background instead of an outline, matching links in the error summary and
show/hide components.

## When to use this component

Use a link whenever the user is navigating — moving to another page, another
service, or another place on the same page. Write link text that describes the
destination, such as "Apply for a driver's licence", so it makes sense read on
its own.

## When not to use this component

Do not use a link to trigger an action, such as submitting a form or saving
information — use a button instead. Avoid vague link text like "click here" or
"read more", which tells screen reader users nothing about where the link
goes.

## Links without a permanent underline

Add the `govbb-link--no-underline` modifier to show the underline only on
interaction. Use this in dense contexts or alongside already-underlined text,
where a permanent underline would add noise — for example a list of ministry
services in a navigation panel.

```html title="Link without a permanent underline"
<a class="govbb-link govbb-link--no-underline" href="#">
  Check your NIS contributions
</a>
```

```tsx
import { Link } from '@govtech-bb/react';

<Link href="#" noUnderline>
  Check your NIS contributions
</Link>;
```

## Visited links

Add the `govbb-link--no-visited` modifier to keep visited links in the
surrounding text colour. Use this in navigation, where a changed visited
colour adds no useful information — but leave it off in long content pages,
where knowing which links you have already followed helps.

```html title="Link that keeps its colour after visiting"
<a class="govbb-link govbb-link--no-visited" href="#">
  Ministry of Home Affairs
</a>
```

```tsx
import { Link } from '@govtech-bb/react';

<Link href="#" noVisited>
  Ministry of Home Affairs
</Link>;
```
