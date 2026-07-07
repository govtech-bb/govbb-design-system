---
title: Button group
description: Use a button group to lay out related buttons and links together.
lede: Lays out a set of related buttons and links with consistent spacing.
group: Actions
---

## Preview

```html title="Button group"
<div class="govbb-button-group">
  <button class="govbb-button" type="button">Save and continue</button>
  <button class="govbb-button govbb-button--secondary" type="button">
    Save as draft
  </button>
  <a class="govbb-link" href="#">Cancel</a>
</div>
```

```tsx
import { Button, ButtonGroup, Link } from '@govtech-bb/react';

<ButtonGroup>
  <Button>Save and continue</Button>
  <Button variant="secondary">Save as draft</Button>
  <Link href="#">Cancel</Link>
</ButtonGroup>;
```

The button group lays out two or more related actions in a row with consistent
spacing, wrapping when the space runs out. It aligns buttons and links on the
same baseline, so a _Cancel_ link can sit alongside the buttons.

## When to use this component

Use a button group whenever a page offers more than one action at the same
point, such as _Save and continue_ next to _Save as draft_. Put the primary
action first, and use secondary or tertiary [button](/components/button/)
variants for the rest so the primary action stays obvious.

## When not to use this component

Do not group unrelated actions just to save space — one primary action per
page is the goal, and extra buttons dilute it. A single button needs no group.

## Vertical layout

Use the `--vertical` modifier to stack the buttons instead, for narrow layouts
or when the actions read as a list of choices.

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

<ButtonGroup vertical>
  <Button>Accept</Button>
  <Button variant="secondary">Reject</Button>
</ButtonGroup>;
```
