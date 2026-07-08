---
title: Button group
description: Use a button group to lay out related actions together.
lede: Lays out related actions in a row that wraps, or a stacked column.
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

The Button group component lays out a set of related actions — buttons, or
buttons alongside a text link — in a row with a consistent gap. The row wraps
on narrow screens so the actions never overflow.

## When to use this component

Use a button group whenever a page offers more than one action at the same
point, such as _Save and continue_ next to _Save as draft_ at the end of a
form. Put the primary action first, and use secondary or tertiary buttons for
the rest so the most important action stands out. A text link, such as
_Cancel_, can sit in the group alongside the buttons.

## When not to use this component

Do not use a button group for a single button — a button on its own does not
need a wrapper. Do not group actions that belong to different tasks or
different parts of the page; keep each group to one decision point.

## Vertical button groups

Add the `govbb-button-group--vertical` modifier to stack the actions and
stretch each one to the full width of the group. Use this for narrow layouts
or full-width action stacks, such as accept and reject choices on mobile.

```html title="Vertical button group"
<div class="govbb-button-group govbb-button-group--vertical">
  <button class="govbb-button" type="button">Accept</button>
  <button class="govbb-button govbb-button--secondary" type="button">
    Reject
  </button>
</div>
```
