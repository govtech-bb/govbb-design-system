---
title: Back button
description: Use the back button to help users return to the previous page.
lede: Lets users return to the previous page in a multi-page transaction.
group: Navigation
---

## Preview

```html title="Back button"
<a class="govbb-link govbb-back-button" href="#">Back</a>
```

```tsx
import { BackButton } from '@govtech-bb/react';

<BackButton href="#" />;
```

The back button takes users to the previous page in a journey. It sits at the
top of the page, above the page heading, and is styled as a link with a
leading chevron.

## When to use this component

Use a back button on question pages in a multi-page form or transaction, where
users may want to change an earlier answer. Place it at the top of the page,
consistently in the same position on every page of the journey.

## When not to use this component

Do not use a back button on pages users arrive at from search or navigation —
use [breadcrumbs](/components/breadcrumbs/) to show where the page sits
instead. Avoid showing both a back button and breadcrumbs on the same page.

Do not rely on the back button as the only way to recover from an error — the
browser back button must also work, and going back must not lose the user's
answers.

## Writing the label

Keep the label as the single word _Back_. If the destination needs naming,
name it — for example _Back to applications_ — but prefer the short form.
