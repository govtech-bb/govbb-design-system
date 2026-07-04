---
title: Input
description: Use the input component to let users enter a single line of free-form text.
lede: Lets users enter a single line of short, free-form text.
group: Form elements
---

## Preview

```html title="Input with hint text"
<div class="govbb-form-group">
  <label class="govbb-label" for="full-name">Full name</label>
  <p class="govbb-hint" id="full-name-hint">As it appears on your ID</p>
  <div class="govbb-input-wrapper">
    <input
      class="govbb-input"
      id="full-name"
      name="full-name"
      type="text"
      aria-describedby="full-name-hint"
    />
  </div>
</div>
```

The Input component lets users enter a single line of short, free-form text, such
as a name, reference number, or email address. Every input is paired with a
visible label so it is clear what answer is expected.

## When to use this component

Use an input for short, single-line answers where you cannot offer a fixed set of
choices, such as a name, address line, or reference number. Choose a specific
`type` — for example `email`, `tel`, or `url` — so mobile keyboards and browser
validation match the answer you're asking for.

## When not to use this component

Do not use an input when the answer spans more than a sentence — use a text area
instead. Do not use an input for numeric answers that need step controls, such as
a quantity; use a number input instead. And do not use an input when you can offer
users a fixed set of choices — a select, radio buttons, or checkboxes are easier
and less error-prone to answer.

## Labels and hint text

Always pair an input with a visible `<label>` — never rely on placeholder text as
a label, because placeholder text disappears as soon as the user starts typing
and is easy to miss altogether. Use hint text (`.govbb-hint`) beneath the label
to explain a format or give an example, such as "As it appears on your ID", and
link it to the input with `aria-describedby`.

## Choosing the right type

Pick the `type` attribute that matches the expected answer — `email`, `tel`,
`url`, or `password` — so mobile keyboards and built-in validation behave
correctly. Avoid `type="number"` on a plain input; use the dedicated number
input component instead when you need step controls.

## Errors

When an input fails validation, show an error message (`.govbb-error-message`)
above the input with `role="alert"`, and mark the input itself with
`aria-invalid="true"` and `aria-describedby` pointing at the error message id.
Keep error messages specific and actionable, such as "Enter a valid email
address".

```html title="Input with error"
<div class="govbb-form-group">
  <label class="govbb-label" for="email">Email address</label>
  <p class="govbb-error-message" id="email-error" role="alert">
    Enter a valid email address
  </p>
  <div class="govbb-input-wrapper">
    <input
      class="govbb-input"
      id="email"
      name="email"
      type="email"
      aria-invalid="true"
      aria-describedby="email-error"
    />
  </div>
</div>
```

## Disabled inputs

Avoid disabling inputs wherever possible. A disabled input gives the user no
information about what they need to do to enable it, and its content is skipped
by many screen readers. Prefer showing the value as read-only text, or explaining
why the field is unavailable.

```html title="Disabled input"
<div class="govbb-form-group">
  <label class="govbb-label" for="disabled-input">Disabled input</label>
  <div class="govbb-input-wrapper">
    <input
      class="govbb-input"
      id="disabled-input"
      name="disabled-input"
      type="text"
      value="Read only"
      disabled
    />
  </div>
</div>
```
