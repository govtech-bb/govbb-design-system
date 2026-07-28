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

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="button-when-to-use">
    <h3 id="button-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a button for a clear action that changes the page, saves progress or moves the task forward.</li>
      <li>Use the button style that matches the importance and consequence of the action.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="button-when-not-to-use">
    <h3 id="button-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use a button for navigation when a link would be clearer.</li>
      <li>Do not use vague labels that force users to guess what happens next.</li>
    </ul>
  </section>
</div>

## Best practices

<div class="govbb-practice-grid">
  <article class="govbb-practice">
    <div class="govbb-practice__preview">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      <button class="govbb-button" type="button">Save changes</button>
    </div>
    <h3>Use a clear action label</h3>
    <p>Specific labels help users understand the outcome before they act.</p>
  </article>
  <article class="govbb-practice">
    <div class="govbb-practice__preview">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      <button class="govbb-button" type="button">Click here</button>
    </div>
    <h3>Do not use vague labels</h3>
    <p>Generic labels force users to read surrounding text to understand what happens.</p>
  </article>
</div>

## Variants

Use the **secondary** button for actions that sit alongside the primary one but
are less important. Use the **tertiary** button for the least prominent actions.

Use `LinkButton` when navigation is the primary call to action. It remains a
semantic link and also supports `external` when a separate service must open
in a new tab.

```html title="External link styled as a button"
<a
  class="govbb-button"
  href="https://www.gov.bb/"
  target="_blank"
  rel="noopener noreferrer"
>
  Start on an external service
</a>
```

```tsx
import { LinkButton } from '@govtech-bb/react';

<LinkButton href="https://www.gov.bb/" external>
  Start on an external service
</LinkButton>;
```

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
  <a class="govbb-link" href="/service/">Cancel</a>
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

```tsx
import { Button, ButtonGroup } from '@govtech-bb/react';

<ButtonGroup>
  <Button>Save and continue</Button>
  <Button variant="secondary">Save as draft</Button>
  <a className="govbb-link" href="/service/">
    Cancel
  </a>
</ButtonGroup>;
```
