---
title: Form group
description: Use the form group to wrap a label, hint and error message around a form control.
lede: Wraps a form control with its label, hint text and error message.
group: Form elements
---

## Preview

```html title="Form group with hint text"
<div class="govbb-form-group">
  <label class="govbb-label" for="nis-number">NIS number</label>
  <span class="govbb-hint" id="nis-number-hint">
    Your National Insurance number, for example 123456
  </span>
  <input
    class="govbb-input"
    id="nis-number"
    name="nis-number"
    type="text"
    aria-describedby="nis-number-hint"
  />
</div>
```

```tsx
import { FormGroup, Hint, Input, Label } from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="nis-number">NIS number</Label>
  <Hint id="nis-number-hint">
    Your National Insurance number, for example 123456
  </Hint>
  <Input id="nis-number" name="nis-number" aria-describedby="nis-number-hint" />
</FormGroup>;
```

The Form group is the shared scaffolding around every form control: a wrapper
(`.govbb-form-group`) that stacks the label (`.govbb-label`), optional hint
text (`.govbb-hint`), optional error message (`.govbb-error-message`) and the
control itself with consistent spacing. It holds no state: compose the pieces
you need.

## When to use this component

Wrap every form control (input, select, textarea, date input and the rest)
in a form group so the label, hint and error message sit in a consistent
order. Use hint text to explain a format or give an example, such as "For
example, 27 3 1990", and link it to the control with `aria-describedby` so
screen readers announce it.

## When not to use this component

Do not use a form group for content that isn't a form field, such as headings
or body text. Do not put hint text inside the label or use placeholder text as
a hint: placeholder text disappears as soon as the user starts typing.

## Error messages

When a field fails validation, add an error message between the label (or
hint) and the control. Give it `role="alert"` so it is announced, mark the
control with `aria-invalid="true"`, and point `aria-describedby` at the error
message id. Keep messages specific and actionable, such as "Enter your NIS
number".

```html title="Form group with error message"
<div class="govbb-form-group">
  <label class="govbb-label" for="licence-number">Licence number</label>
  <span class="govbb-error-message" id="licence-number-error" role="alert">
    Enter your driver's licence number
  </span>
  <input
    class="govbb-input"
    id="licence-number"
    name="licence-number"
    type="text"
    aria-invalid="true"
    aria-describedby="licence-number-error"
  />
</div>
```

```tsx
import { ErrorMessage, FormGroup, Input, Label } from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="licence-number">Licence number</Label>
  <ErrorMessage id="licence-number-error" role="alert">
    Enter your driver's licence number
  </ErrorMessage>
  <Input
    id="licence-number"
    name="licence-number"
    aria-invalid
    aria-describedby="licence-number-error"
  />
</FormGroup>;
```

## Grouping related fields with a fieldset

When several controls answer a single question (radios, checkboxes, or the
parts of a date), wrap them in a fieldset (`.govbb-fieldset`) with a legend
(`.govbb-fieldset__legend`) inside the form group. The legend acts as the
question; each control keeps its own label.

```html title="Fieldset with legend and hint"
<div class="govbb-form-group">
  <fieldset class="govbb-fieldset" aria-describedby="collection-hint">
    <legend class="govbb-fieldset__legend">
      Where do you want to collect your passport?
    </legend>
    <span class="govbb-hint" id="collection-hint">
      Choose the office closest to you
    </span>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="collect-bridgetown"
        type="radio"
        name="collection"
      />
      <label class="govbb-radio-item__label" for="collect-bridgetown">
        Bridgetown
      </label>
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="collect-holetown"
        type="radio"
        name="collection"
      />
      <label class="govbb-radio-item__label" for="collect-holetown">
        Holetown
      </label>
    </div>
  </fieldset>
</div>
```

```tsx
import { Fieldset, FormGroup, Hint, Radio } from '@govtech-bb/react';

<FormGroup>
  <Fieldset
    legend="Where do you want to collect your passport?"
    aria-describedby="collection-hint"
  >
    <Hint id="collection-hint">Choose the office closest to you</Hint>
    <Radio id="collect-bridgetown" name="collection" label="Bridgetown" />
    <Radio id="collect-holetown" name="collection" label="Holetown" />
  </Fieldset>
</FormGroup>;
```
