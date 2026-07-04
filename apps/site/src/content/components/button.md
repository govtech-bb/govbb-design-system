---
title: Button
description: Use buttons to help users carry out an action.
lede: Buttons let users carry out an action.
group: Actions
---

## Preview

```html title="Button variants"
<button class="govbb-btn" type="button">Primary</button>
<button class="govbb-btn--secondary" type="button">Secondary</button>
<button class="govbb-btn--tertiary" type="button">Tertiary</button>
```

```tsx
import { Button } from '@govtech-bb/react';

<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
```

The Button component lets users initiate an action, such as submitting a form,
starting an application, or saving their information. The label on a button
describes the action it performs.

## When to use this component

Use a button for the primary action on a page — the thing you most want the user
to do next, such as _Save and continue_. Write button text as a short, specific
verb phrase in sentence case.

## When not to use this component

Do not use a button to navigate between pages — use a link instead. If a user is
moving to another page rather than triggering an action, a link sets the right
expectation.

## Variants

Use the **secondary** button for actions that sit alongside the primary one but
are less important. Use the **tertiary** button for the least prominent actions.

## Disabled buttons

Avoid disabling buttons wherever possible. A disabled button gives the user no
information about what they need to do to enable it. Prefer keeping the button
active and showing an error when the user tries to continue.

```html title="Disabled button"
<button class="govbb-btn" type="button" disabled>Submit application</button>
```

```tsx
import { Button } from '@govtech-bb/react';

<Button disabled>Submit application</Button>;
```
