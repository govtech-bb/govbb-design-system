---
title: Back button
description: Use the back button to let users return to the previous page in a multi-page transaction.
lede: A link that takes users back to the previous page.
group: Navigation
---

## Preview

```html title="Back button"
<a class="govbb-link govbb-back-button" href="#">Back</a>
```

The back button is a link with the brand's swept arrow that takes users back to
the previous page. It composes with the link component — use both classes,
`govbb-link govbb-back-button` — so the arrow follows the link's colour on
hover, active and focus. Point `href` at the previous page in the journey so
the link works without JavaScript.

## When to use this component

Use the back button inside a multi-page transaction, such as applying for a
passport or registering for National Insurance, so users can check or change
an earlier answer. Place it at the top of the page, above the page title, and
keep the label as _Back_.

## When not to use this component

Do not rely on the back button as the only way to reverse a step — users may
use the browser's back button instead, so the service must handle that too. Do
not use it together with [breadcrumbs](/components/breadcrumbs) on the same
page: pick the one that matches the journey, breadcrumbs for a hierarchy and
the back button for a linear transaction.
