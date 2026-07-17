---
title: Checkbox
description: Use checkboxes to let users select one or more options from a list.
lede: Checkboxes let users select any number of options from a list, including none.
group: Form elements
css: checkbox-radio
---

## Preview

```html title="Checkbox group"
<fieldset class="govbb-fieldset">
  <legend class="govbb-fieldset__legend">
    How would you like to be contacted?
  </legend>
  <span class="govbb-hint">Select all that apply</span>
  <div class="govbb-checkbox-item">
    <input
      class="govbb-checkbox"
      id="contact-email"
      type="checkbox"
      name="contact"
      value="email"
    />
    <label class="govbb-checkbox-item__label" for="contact-email">Email</label>
  </div>
  <div class="govbb-checkbox-item">
    <input
      class="govbb-checkbox"
      id="contact-phone"
      type="checkbox"
      name="contact"
      value="phone"
    />
    <label class="govbb-checkbox-item__label" for="contact-phone">Phone</label>
  </div>
  <div class="govbb-checkbox-item">
    <input
      class="govbb-checkbox"
      id="contact-post"
      type="checkbox"
      name="contact"
      value="post"
    />
    <label class="govbb-checkbox-item__label" for="contact-post">Post</label>
  </div>
</fieldset>
```

```tsx
import { Checkbox, Fieldset, Hint } from '@govtech-bb/react';

<Fieldset legend="How would you like to be contacted?">
  <Hint>Select all that apply</Hint>
  <Checkbox name="contact" value="email" label="Email" />
  <Checkbox name="contact" value="phone" label="Phone" />
  <Checkbox name="contact" value="post" label="Post" />
</Fieldset>;
```

The Checkbox component lets users select any number of options from a list,
including none, or toggle a single option on or off. Each checkbox operates
independently, so selecting one does not affect the others.

## When to use this component

Use checkboxes when users can select more than one option from a list, or need to
toggle a single option on or off, such as agreeing to terms and conditions.

## When not to use this component

Do not use checkboxes when a user must choose exactly one option from a list of
mutually exclusive choices. Use radio buttons instead.

## Guidance

Group related checkboxes in a `<fieldset>` with a `<legend>` that frames the
question, for example _"How would you like to be contacted?"_. This associates
the options with their question for assistive technology.

Do not pre-select options. Pre-selected checkboxes make it more likely that users
will not notice they have skipped a question, or will submit an answer they did
not intend. Let users make an active choice.

Order options by relevance, listing the most common or recommended choices first.
Fall back to alphabetical order only when no meaningful priority exists.

Make the number of selectable options clear. Do not assume users will infer from
the visual difference between checkboxes and radio buttons that they can select
more than one. Add a hint such as _"Select all that apply"_ where it helps.

## Per-option hints

Add a hint to an individual option when its label needs clarification. Link the
hint to the checkbox with `aria-describedby`.

```html title="Checkbox with a per-option hint"
<div class="govbb-checkbox-item">
  <input
    class="govbb-checkbox"
    id="nationality-british"
    type="checkbox"
    name="nationality"
    value="british"
    aria-describedby="nationality-british-hint"
  />
  <label class="govbb-checkbox-item__label" for="nationality-british">
    British
  </label>
  <span class="govbb-hint" id="nationality-british-hint">
    Including English, Scottish, Welsh and Northern Irish
  </span>
</div>
```

```tsx
import { Checkbox } from '@govtech-bb/react';

<Checkbox
  name="nationality"
  value="british"
  label="British"
  hint="Including English, Scottish, Welsh and Northern Irish"
/>;
```

## Single checkbox

Use a standalone checkbox, without a fieldset, for a single opt-in, such as
accepting terms and conditions.

```html title="Single checkbox"
<div class="govbb-checkbox-item">
  <input
    class="govbb-checkbox"
    id="terms"
    type="checkbox"
    name="terms"
    value="yes"
  />
  <label class="govbb-checkbox-item__label" for="terms"
    >I agree to the terms of service</label
  >
</div>
```

```tsx
import { Checkbox } from '@govtech-bb/react';

<Checkbox name="terms" value="yes" label="I agree to the terms of service" />;
```

## Disabled checkboxes

Disable a checkbox only when an option is genuinely unavailable to the user, and
say why in the label, for example _"(unavailable)"_. As with buttons, avoid
disabling wherever possible: a disabled checkbox gives the user no information
about what they need to do to enable it.

```html title="Disabled checkbox"
<div class="govbb-checkbox-item">
  <input
    class="govbb-checkbox"
    id="sms"
    type="checkbox"
    name="contact"
    value="sms"
    disabled
  />
  <label class="govbb-checkbox-item__label" for="sms">SMS (unavailable)</label>
</div>
```

```tsx
import { Checkbox } from '@govtech-bb/react';

<Checkbox name="contact" value="sms" label="SMS (unavailable)" disabled />;
```
