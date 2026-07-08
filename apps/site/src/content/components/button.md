---
title: Button
description: Use buttons to help users carry out an action.
lede: Buttons let users carry out an action.
group: Actions
---

## Preview

```html title="Button variants"
<button class="govbb-button" type="button">Primary</button>
<button class="govbb-button govbb-button--secondary" type="button">
  Secondary
</button>
<button class="govbb-button govbb-button--tertiary" type="button">
  Tertiary
</button>
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

Use a button for the primary action on a page: the thing you most want the user
to do next, such as _Save and continue_. Write button text as a short, specific
verb phrase in sentence case.

## When not to use this component

Do not use a button to navigate between pages. Use a link instead. If a user is
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
<button class="govbb-button" type="button" disabled>Submit application</button>
```

```tsx
import { Button } from '@govtech-bb/react';

<Button disabled>Submit application</Button>;
```

## Grouping buttons

When a page offers more than one action at the same point, wrap them in a
`govbb-button-group`. It lays out the actions in a row with a consistent gap,
wrapping on narrow screens. Put the primary action first, and use secondary or
tertiary buttons for the rest. A text link, such as _Cancel_, can sit in the
group alongside the buttons.

```html title="Button group"
<div class="govbb-button-group">
  <button class="govbb-button" type="button">Save and continue</button>
  <button class="govbb-button govbb-button--secondary" type="button">
    Save as draft
  </button>
  <a class="govbb-link" href="#">Cancel</a>
</div>
```

Add the `govbb-button-group--vertical` modifier to stack the actions and
stretch each one to the full width of the group, for narrow layouts or
full-width action stacks, such as accept and reject choices on mobile.

```html title="Vertical button group"
<div class="govbb-button-group govbb-button-group--vertical">
  <button class="govbb-button" type="button">Accept</button>
  <button class="govbb-button govbb-button--secondary" type="button">
    Reject
  </button>
</div>
```
