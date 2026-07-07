---
title: Link
description: Use links to let users navigate to another page.
lede: Takes users to another page or another part of the same page.
group: Navigation
---

## Preview

```html title="Link in a sentence"
<p>
  Read about
  <a class="govbb-link" href="/passports/renew">renewing your passport</a>
  before you apply.
</p>
```

```tsx
import { Link } from '@govtech-bb/react';

<p>
  Read about <Link href="/passports/renew">renewing your passport</Link> before
  you apply.
</p>;
```

Links take users to another page, or another part of the same page. They are
underlined by default so they are recognisable without relying on colour
alone, and they show a distinct visited state.

## When to use this component

Use a link whenever the user is navigating rather than acting — moving to
another page, section, or document. Write link text that describes the
destination, such as _renewing your passport_, so it makes sense read on its
own.

## When not to use this component

Do not use a link for an action such as submitting a form — use a
[button](/components/button/) instead. Avoid link text like _click here_ or
_read more_, which tells screen reader users nothing about where the link
goes.

## No-underline links

Use the `--no-underline` modifier for links in dense navigational contexts —
lists of links, cards, menus — where the underline on every item adds noise.
The underline returns on hover and focus.

```html title="No-underline link"
<a class="govbb-link govbb-link--no-underline" href="/services">
  Quiet link that underlines on hover
</a>
```

```tsx
import { Link } from '@govtech-bb/react';

<Link href="/services" noUnderline>
  Quiet link that underlines on hover
</Link>;
```

## No-visited-state links

Use the `--no-visited` modifier where the visited state would be confusing or
unhelpful, such as in a navigation menu that users revisit constantly. Keep
the default visited state in body content — it helps users keep track of what
they have already read.

```html title="Link without a visited state"
<a class="govbb-link govbb-link--no-visited" href="/status"
  >Check application status</a
>
```

```tsx
import { Link } from '@govtech-bb/react';

<Link href="/status" noVisited>
  Check application status
</Link>;
```
