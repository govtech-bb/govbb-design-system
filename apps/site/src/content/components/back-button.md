---
title: Back button
description: Use the back button to let users return to the previous page in a multi-page transaction.
lede: A link that takes users back to the previous page.
group: Navigation
---

## Preview

```html title="Back button"
<a class="govbb-link govbb-back-button" href="/service/previous-step/">Back</a>
```

```tsx
import { BackButton } from '@govtech-bb/react';

<BackButton href="/previous-page" />;
```

The back button is a link with the brand's swept arrow that takes users back to
the previous page. It composes with the link component: use both classes,
`govbb-link govbb-back-button`, so the arrow follows the link's colour on
hover, active and focus. Point `href` at the previous page in the journey so
the link works without JavaScript.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="back-button-when-to-use">
    <h3 id="back-button-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a back button to return to the previous page in a linear, multi-page service.</li>
      <li>Use a more specific label, such as “Back to contact details”, when the destination may not be obvious.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="back-button-when-not-to-use">
    <h3 id="back-button-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use a back button to represent the website hierarchy; use <a href="/components/breadcrumbs/">breadcrumbs</a>.</li>
      <li>Do not show a back button and breadcrumbs on the same page.</li>
    </ul>
  </section>
</div>

## Best practices

### Return users to the page as they left it

The destination should be the previous service step, with entered answers and
selections preserved. The service must also cope with users choosing their
browser's back button.

### Keep the back button in a consistent place

Place it near the top of the page, before the page title and main task. Make it
work without JavaScript wherever possible.
