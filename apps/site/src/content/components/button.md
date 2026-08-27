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
<button class="govbb-button govbb-button--ghost" type="button">Ghost</button>
<button class="govbb-button govbb-button--text" type="button">Text</button>
```

```tsx
import { Button } from '@govtech-bb/react';

<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="text">Text</Button>
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

Use the **ghost** button for an action that must not compete with the buttons
around it, such as _Cancel_ beside a primary button or the _Menu_ control in
the [header](/components/header/). It carries no fill or outline, only an
underlined label, but it keeps the same box as the other variants, so a row of
mixed buttons lines up and the target stays full size.

Use the **text** button only where there is no room for that box, such as
_Remove_ in a table cell or a list row. It is the ghost button without its
padding, so it sits flush with the text around it.

Both are still buttons: use them for actions, and use a
[link](/components/link/) for navigation.

```html title="Ghost and text buttons"
<div class="govbb-button-group">
  <button class="govbb-button" type="button">Save and continue</button>
  <button class="govbb-button govbb-button--ghost" type="button">Cancel</button>
</div>
<p>
  passport.pdf
  <button class="govbb-button govbb-button--text" type="button">Remove</button>
</p>
```

```tsx
import { Button, ButtonGroup } from '@govtech-bb/react';

<ButtonGroup>
  <Button>Save and continue</Button>
  <Button variant="ghost">Cancel</Button>
</ButtonGroup>
<p>
  passport.pdf <Button variant="text">Remove</Button>
</p>
```

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

## Destructive actions

Add the `negative` modifier to a primary, ghost or text button when the action
destroys data or cannot be undone, such as deleting a record. It is a warning,
not a substitute for confirmation: pair it with a step that lets the user check
what they are about to lose. Do not use it for ordinary actions, because a page
full of red buttons stops reading as a warning.

```html title="Destructive actions"
<button class="govbb-button govbb-button--negative" type="button">
  Delete application
</button>
<button
  class="govbb-button govbb-button--text govbb-button--negative"
  type="button"
>
  Remove file
</button>
```

```tsx
import { Button } from '@govtech-bb/react';

<Button negative>Delete application</Button>
<Button variant="text" negative>Remove file</Button>
```

## Buttons on dark backgrounds

Add the `inverse` modifier when a button sits on a dark or brand-coloured
surface, such as a hero panel. It flips the primary button to a white fill with
brand-blue text, and turns the tertiary, ghost and text variants white so they
stay visible. The surrounding surface must supply the dark background: the modifier
only recolours the button.

```html title="Inverse buttons"
<button class="govbb-button govbb-button--inverse" type="button">
  Start now
</button>
<button
  class="govbb-button govbb-button--tertiary govbb-button--inverse"
  type="button"
>
  Find out more
</button>
```

```tsx
import { Button } from '@govtech-bb/react';

<Button inverse>Start now</Button>
<Button variant="tertiary" inverse>Find out more</Button>
```

## Client-side routing

`LinkButton` accepts an href-compatible router component through
`linkComponent`, so a start button can navigate without a full page load. The
router renders the same markup a plain link-button does.

```html title="Start button rendered by a client-side router"
<a class="govbb-button" href="/apply/">Start now</a>
```

```tsx
import NextLink from 'next/link';
import { LinkButton } from '@govtech-bb/react';

<LinkButton linkComponent={NextLink} href="/apply/">
  Start now
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

A link cannot take the `disabled` attribute, so a `LinkButton` that must appear
unavailable uses `aria-disabled="true"` instead. That styles it as disabled and
announces it as such, but the link still works: stop the navigation in your own
handler.

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
