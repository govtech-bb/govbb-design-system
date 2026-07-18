---
title: Number input
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

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="number-input-when-to-use">
    <h3 id="number-input-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a number input for a quantity users may type or adjust in small steps, such as the number of copies.</li>
      <li>Use it when minimum, maximum or step rules have a clear meaning.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="number-input-when-not-to-use">
    <h3 id="number-input-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it for an identifier, telephone number, year or other digit string that is not a quantity.</li>
      <li>Do not use it when the valid answers are a small, fixed set that can be shown as radio buttons.</li>
    </ul>
  </section>
</div>

## Best practices

### Set meaningful constraints

Add `min`, `max` and `step` when the service has those rules, and explain the
unit in the label or suffix. Validate on the server and return a message that
states the allowed range.

### Keep typing available

The step controls are a convenience, not the only input method. Let users type,
paste and edit the value with the keyboard. Initialise the HTML enhancement with
`initAll()` from `@govtech-bb/frontend`; the React component enhances itself.

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
