---
title: Number Input
description: Use the number input component to let users enter a small integer with visible increment and decrement controls.
lede: Lets users enter a number, with buttons to step the value up or down.
group: Form elements
---

## Preview

```html title="Number input with hint text"
<div class="govbb-form-group">
  <label class="govbb-label" id="quantity-label" for="quantity">Quantity</label>
  <span class="govbb-hint" id="quantity-hint">Between 1 and 10</span>
  <div
    class="govbb-number-input-wrapper"
    role="group"
    aria-labelledby="quantity-label"
    data-govbb-module="number-input"
  >
    <input
      class="govbb-number-input"
      id="quantity"
      name="quantity"
      type="number"
      inputmode="numeric"
      min="1"
      max="10"
      step="1"
      value="1"
      aria-describedby="quantity-hint"
    />
    <div class="govbb-number-input__steppers">
      <button
        class="govbb-number-input__step"
        type="button"
        tabindex="-1"
        aria-label="Increment"
        aria-controls="quantity"
      ></button>
      <span class="govbb-number-input__divider" aria-hidden="true"></span>
      <button
        class="govbb-number-input__step govbb-number-input__step--down"
        type="button"
        tabindex="-1"
        aria-label="Decrement"
        aria-controls="quantity"
      ></button>
    </div>
  </div>
</div>
```

```tsx
import { FormGroup, Hint, Label, NumberInput } from '@govtech-bb/react';

<FormGroup>
  <Label id="quantity-label" htmlFor="quantity">
    Quantity
  </Label>
  <Hint id="quantity-hint">Between 1 and 10</Hint>
  <NumberInput
    id="quantity"
    name="quantity"
    labelId="quantity-label"
    min={1}
    max={10}
    step={1}
    defaultValue={1}
    aria-describedby="quantity-hint"
  />
</FormGroup>;
```

The Number Input component lets users enter a small whole number, such as a
quantity or a number of people, using visible increment and decrement buttons
alongside the field. It is paired with a visible label, just like a regular
input.

## When to use this component

Use a number input for small ranges where tapping the up or down button is
quicker and less error-prone than typing, such as a quantity, a number of
copies, or a number of people. Always set `min` and `max` when the range is
known: the stepper buttons step the native input, so they cannot push the
value outside it. The stepper behaviour ships in the package's
progressive-enhancement runtime: call `initAll()` from `@govtech-bb/frontend`
once per page and every `data-govbb-module="number-input"` wrapper is wired
up. The React component enhances itself.

## When not to use this component

Do not use a number input for long numbers such as an ID, phone number, or
year. Use a plain input with `inputmode="numeric"` instead. Do not use it for
values that are not whole numbers unless you also set a suitable `step`. And do
not use it as a substitute for a select or radio buttons when you are really
offering a fixed, small set of choices.

## Labels and hint text

Always pair a number input with a visible `<label>`. Use hint text
(`.govbb-hint`) beneath the label to explain the expected range, such as
"Between 1 and 10", and link it to the input with `aria-describedby`.

## Setting limits

Set `type="number"`, `inputmode="numeric"`, and the `min`, `max`, and `step`
attributes so both the native control and assistive technology understand the
valid range. The stepper buttons sit inside `.govbb-number-input-wrapper` with
`role="group"` named via `aria-labelledby` pointing at the field's label, and
each button carries an `aria-label` ("Increment" or "Decrement") together with
`aria-controls` pointing at the input, since the buttons show no visible text of
their own. The steppers use the input's native `stepUp()` and `stepDown()`, so
they respect `min`, `max` and `step` without any extra code.

## Errors

When a number input fails validation, show an error message
(`.govbb-error-message`) above the input with `role="alert"`, and mark the input
itself with `aria-invalid="true"` and `aria-describedby` pointing at the error
message id. Keep error messages specific and actionable, such as "Enter a
quantity between 1 and 10".

```html title="Number input with error"
<div class="govbb-form-group">
  <label class="govbb-label" id="quantity-label" for="quantity">Quantity</label>
  <span class="govbb-error-message" id="quantity-error" role="alert">
    Enter a quantity between 1 and 10
  </span>
  <div
    class="govbb-number-input-wrapper"
    role="group"
    aria-labelledby="quantity-label"
    data-govbb-module="number-input"
  >
    <input
      class="govbb-number-input"
      id="quantity"
      name="quantity"
      type="number"
      inputmode="numeric"
      min="1"
      max="10"
      step="1"
      aria-invalid="true"
      aria-describedby="quantity-error"
    />
    <div class="govbb-number-input__steppers">
      <button
        class="govbb-number-input__step"
        type="button"
        tabindex="-1"
        aria-label="Increment"
        aria-controls="quantity"
      ></button>
      <span class="govbb-number-input__divider" aria-hidden="true"></span>
      <button
        class="govbb-number-input__step govbb-number-input__step--down"
        type="button"
        tabindex="-1"
        aria-label="Decrement"
        aria-controls="quantity"
      ></button>
    </div>
  </div>
</div>
```

```tsx
import { ErrorMessage, FormGroup, Label, NumberInput } from '@govtech-bb/react';

<FormGroup>
  <Label id="quantity-label" htmlFor="quantity">
    Quantity
  </Label>
  <ErrorMessage id="quantity-error" role="alert">
    Enter a quantity between 1 and 10
  </ErrorMessage>
  <NumberInput
    id="quantity"
    name="quantity"
    labelId="quantity-label"
    min={1}
    max={10}
    step={1}
    aria-invalid
    aria-describedby="quantity-error"
  />
</FormGroup>;
```
