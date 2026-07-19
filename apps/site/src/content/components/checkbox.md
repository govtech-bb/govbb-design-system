---
title: Checkbox
description: Use checkboxes to let users select one or more options from a list.
lede: Checkboxes let users select any number of options from a list, including none.
group: Form elements
css: checkbox-radio
---

## Preview

```html title="Checkbox group"
<div class="govbb-form-group">
  <fieldset class="govbb-fieldset" aria-describedby="contact-hint">
    <legend class="govbb-fieldset__legend">
      How would you like to be contacted?
    </legend>
    <span class="govbb-hint" id="contact-hint">Select all that apply</span>
    <div class="govbb-checkbox-item">
      <input
        class="govbb-checkbox"
        id="contact-email"
        type="checkbox"
        name="contact"
        value="email"
      />
      <label class="govbb-checkbox-item__label" for="contact-email"
        >Email</label
      >
    </div>
    <div class="govbb-checkbox-item">
      <input
        class="govbb-checkbox"
        id="contact-phone"
        type="checkbox"
        name="contact"
        value="phone"
      />
      <label class="govbb-checkbox-item__label" for="contact-phone"
        >Phone</label
      >
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
</div>
```

```tsx
import { Checkbox, Fieldset, Hint } from '@govtech-bb/react';

<Fieldset
  legend="How would you like to be contacted?"
  aria-describedby="contact-hint"
>
  <Hint id="contact-hint">Select all that apply</Hint>
  <Checkbox name="contact" value="email" label="Email" />
  <Checkbox name="contact" value="phone" label="Phone" />
  <Checkbox name="contact" value="post" label="Post" />
</Fieldset>;
```

The Checkbox component lets users select any number of options from a list,
including none, or toggle a single option on or off. Each checkbox operates
independently, so selecting one does not affect the others.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="checkbox-when-to-use">
    <h3 id="checkbox-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use checkboxes when users can select any number of options from a list.</li>
      <li>Use one checkbox for a single optional choice, such as receiving updates.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="checkbox-when-not-to-use">
    <h3 id="checkbox-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use checkboxes when users must choose exactly one option; use <a href="/components/radio/">radio buttons</a>.</li>
      <li>Do not use separate “Yes” and “No” checkboxes because both can be selected.</li>
    </ul>
  </section>
</div>

## Best practices

### Explain how many options users can choose

Add a hint such as “Select all that apply” when more than one selection is
allowed. Group related choices in a `fieldset` with a clear `legend`.

### Make every option easy to select

Place the checkbox before its label and connect them with matching `id` and
`for` values so the whole label activates the control. Avoid long, overloaded
groups; simplify or split the question when scanning becomes difficult.

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

## Conditional reveal

Show follow-up content when an option is ticked. The conditional block sits as
a sibling of its checkbox item and appears only while that checkbox is checked.

```html title="Checkbox with conditional reveal"
<div class="govbb-form-group">
  <fieldset class="govbb-fieldset">
    <legend class="govbb-fieldset__legend">
      How would you like to be contacted?
    </legend>
    <div class="govbb-checkbox-item">
      <input
        class="govbb-checkbox"
        id="c-email"
        type="checkbox"
        name="contact"
        value="email"
      />
      <label class="govbb-checkbox-item__label" for="c-email">Email</label>
    </div>
    <div class="govbb-checkbox-item__conditional">
      <div class="govbb-form-group">
        <label class="govbb-label" for="c-email-addr">Email address</label>
        <input class="govbb-input" id="c-email-addr" type="email" />
      </div>
    </div>
    <div class="govbb-checkbox-item">
      <input
        class="govbb-checkbox"
        id="c-phone"
        type="checkbox"
        name="contact"
        value="phone"
      />
      <label class="govbb-checkbox-item__label" for="c-phone">Phone</label>
    </div>
    <div class="govbb-checkbox-item__conditional">
      <div class="govbb-form-group">
        <label class="govbb-label" for="c-phone-num">Phone number</label>
        <input class="govbb-input" id="c-phone-num" type="tel" />
      </div>
    </div>
  </fieldset>
</div>
```

```tsx
import { Checkbox, Fieldset, FormGroup, Input, Label } from '@govtech-bb/react';

<Fieldset legend="How would you like to be contacted?">
  <Checkbox
    name="contact"
    value="email"
    label="Email"
    conditional={
      <FormGroup>
        <Label htmlFor="c-email-addr">Email address</Label>
        <Input id="c-email-addr" type="email" />
      </FormGroup>
    }
  />
  <Checkbox
    name="contact"
    value="phone"
    label="Phone"
    conditional={
      <FormGroup>
        <Label htmlFor="c-phone-num">Phone number</Label>
        <Input id="c-phone-num" type="tel" />
      </FormGroup>
    }
  />
</Fieldset>;
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
