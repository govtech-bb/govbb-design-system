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
  <span class="govbb-hint" id="full-name-description"
    >As it appears on your ID</span
  >
  <input
    class="govbb-input"
    id="full-name"
    name="full-name"
    type="text"
    aria-describedby="full-name-description"
  />
</div>
```

```tsx
import { FormGroup, Hint, Input, Label } from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="full-name">Full name</Label>
  <Hint id="full-name-description">As it appears on your ID</Hint>
  <Input
    id="full-name"
    name="full-name"
    aria-describedby="full-name-description"
  />
</FormGroup>;
```

The Input component lets users enter a single line of short, free-form text, such
as a name, reference number, or email address. Every input is paired with a
visible label so it is clear what answer is expected.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="input-when-to-use">
    <h3 id="input-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use an input for a short, single-line answer that users know or may paste, such as a name or reference number.</li>
      <li>Use the input type and width that match the value being collected.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="input-when-not-to-use">
    <h3 id="input-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use a single-line input for a long response; use a text area.</li>
      <li>Do not make users type an answer when a short, predictable set of choices would be easier.</li>
    </ul>
  </section>
</div>

## Best practices

### Use a visible, persistent label

Place a short label above the input and use hint text for format requirements or
examples. Do not use placeholder text as the only instruction because it
disappears when users type.

### Match browser behaviour to the answer

Use `email`, `tel`, `url` and relevant `autocomplete` values where appropriate.
Use `inputmode="numeric"` with a text input for identifiers, telephone numbers
and other digit strings that are not quantities.

## Labels and hint text

Always pair an input with a visible `<label>`. Never rely on placeholder text as
a label, because placeholder text disappears as soon as the user starts typing
and is easy to miss altogether. Use hint text (`.govbb-hint`) beneath the label
to explain a format or give an example, such as "As it appears on your ID", and
link it to the input with `aria-describedby`. We don't use placeholder text at
all — see [why we don't use placeholder text](/design-log/placeholder-text/).

## Choosing the right type

Pick the `type` attribute that matches the expected answer (`email`, `tel`,
`url`, or `password`) so mobile keyboards and built-in validation behave
correctly. Avoid `type="number"` on a plain input; use the dedicated number
input component instead when you need step controls.

## Prefixes and suffixes

Use a prefix or suffix to show a unit or currency, such as "$" or "per day",
so users do not type it themselves. Keep it to a symbol or one or two words:
the adornment does not shrink, so a long one takes width from the field. Mark
it `aria-hidden="true"` and make sure the label or hint carries its meaning,
for example "Fee, in dollars per day". When there is no room for the field
beside them, the adornments move onto rows of their own.

```html title="Input with a prefix and suffix"
<div class="govbb-form-group">
  <label class="govbb-label" for="fee">Fee, in dollars per day</label>
  <div class="govbb-input-wrapper">
    <span class="govbb-input__prefix" aria-hidden="true">$</span>
    <input
      class="govbb-input"
      id="fee"
      name="fee"
      type="text"
      inputmode="decimal"
    />
    <span class="govbb-input__suffix" aria-hidden="true">per day</span>
  </div>
</div>
```

```tsx
import { Input } from '@govtech-bb/react';

<Input
  label="Fee, in dollars per day"
  name="fee"
  inputMode="decimal"
  prefix="$"
  suffix="per day"
/>;
```

## Errors

When an input fails validation, show an error message (`.govbb-error-message`)
above the input with `role="alert"`, and mark the input itself with
`aria-invalid="true"` and `aria-describedby` pointing at the error message id.
Keep error messages specific and actionable: say what correct looks like,
such as "Enter an email address in the correct format, like name@example.com",
rather than calling the answer invalid.

```html title="Input with error"
<div class="govbb-form-group">
  <label class="govbb-label" for="email">Email address</label>
  <span class="govbb-error-message" id="email-error" role="alert">
    Enter an email address in the correct format, like name@example.com
  </span>
  <input
    class="govbb-input"
    id="email"
    name="email"
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
</div>
```

```tsx
import { ErrorMessage, FormGroup, Input, Label } from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="email">Email address</Label>
  <ErrorMessage id="email-error" role="alert">
    Enter an email address in the correct format, like name@example.com
  </ErrorMessage>
  <Input
    id="email"
    name="email"
    type="email"
    aria-invalid
    aria-describedby="email-error"
  />
</FormGroup>;
```

## Disabled inputs

Avoid disabling inputs wherever possible. A disabled input gives the user no
information about what they need to do to enable it, and its content is skipped
by many screen readers. Prefer showing the value as read-only text, or explaining
why the field is unavailable.

```html title="Disabled input"
<div class="govbb-form-group">
  <label class="govbb-label" for="disabled-input">Disabled input</label>
  <input
    class="govbb-input"
    id="disabled-input"
    name="disabled-input"
    type="text"
    value="Read only"
    disabled
  />
</div>
```

```tsx
import { FormGroup, Input, Label } from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="disabled-input">Disabled input</Label>
  <Input
    id="disabled-input"
    name="disabled-input"
    defaultValue="Read only"
    disabled
  />
</FormGroup>;
```
