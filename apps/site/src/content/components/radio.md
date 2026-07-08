---
title: Radio
description: Use radio buttons to let users select a single option from a list.
lede: Radio buttons let users pick exactly one option from a short list.
group: Form elements
css: checkbox-radio
---

## Preview

```html title="Radio group"
<fieldset class="govbb-fieldset">
  <legend class="govbb-fieldset__legend">Where do you live?</legend>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="parish-st-michael"
      type="radio"
      name="parish"
      value="st-michael"
    />
    <label class="govbb-radio-item__label" for="parish-st-michael"
      >Saint Michael</label
    >
  </div>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="parish-christ-church"
      type="radio"
      name="parish"
      value="christ-church"
    />
    <label class="govbb-radio-item__label" for="parish-christ-church"
      >Christ Church</label
    >
  </div>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="parish-st-james"
      type="radio"
      name="parish"
      value="st-james"
    />
    <label class="govbb-radio-item__label" for="parish-st-james"
      >Saint James</label
    >
  </div>
</fieldset>
```

```tsx
import { Fieldset, Radio } from '@govtech-bb/react';

<Fieldset legend="Where do you live?">
  <Radio name="parish" value="st-michael" label="Saint Michael" />
  <Radio name="parish" value="christ-church" label="Christ Church" />
  <Radio name="parish" value="st-james" label="Saint James" />
</Fieldset>;
```

The Radio component lets users pick exactly one option from a short list of
mutually exclusive choices. Always wrap a group of radios in a `<fieldset>` with
a `<legend>` that asks the question, since screen readers announce the legend
with every option so users hear what they are answering.

## When to use this component

Use radios when users must pick exactly one option and the list is short enough
to show all options , roughly five or fewer. Put the most common or
recommended option first, and fall back to alphabetical order only when no
meaningful priority exists.

## When not to use this component

Do not use radios when users can pick more than one option. Use checkboxes
instead. If the list of options is long, a select fits better than a full list
of radios.

## Per-option hints

Add a hint to a single option to clarify its meaning. Use `aria-describedby` so
screen readers announce it alongside the option's label.

```html title="Radio group with per-option hints"
<fieldset class="govbb-fieldset">
  <legend class="govbb-fieldset__legend">
    How would you like to be contacted?
  </legend>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="contact-email"
      type="radio"
      name="contact"
      value="email"
      aria-describedby="contact-email-hint"
    />
    <label class="govbb-radio-item__label" for="contact-email">Email</label>
    <div class="govbb-hint" id="contact-email-hint">
      We'll only use this to send updates about your application.
    </div>
  </div>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="contact-phone"
      type="radio"
      name="contact"
      value="phone"
      aria-describedby="contact-phone-hint"
    />
    <label class="govbb-radio-item__label" for="contact-phone">Phone</label>
    <div class="govbb-hint" id="contact-phone-hint">
      A government officer may call between 9am and 5pm.
    </div>
  </div>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="contact-post"
      type="radio"
      name="contact"
      value="post"
    />
    <label class="govbb-radio-item__label" for="contact-post">Post</label>
  </div>
</fieldset>
```

```tsx
import { Fieldset, Radio } from '@govtech-bb/react';

<Fieldset legend="How would you like to be contacted?">
  <Radio
    name="contact"
    value="email"
    label="Email"
    hint="We'll only use this to send updates about your application."
  />
  <Radio
    name="contact"
    value="phone"
    label="Phone"
    hint="A government officer may call between 9am and 5pm."
  />
  <Radio name="contact" value="post" label="Post" />
</Fieldset>;
```

## Conditional reveal

Show follow-up content when a specific option is selected. The conditional block
sits as a sibling of its radio item and appears only when that radio is checked.

```html title="Radio group with conditional reveal"
<fieldset class="govbb-fieldset">
  <legend class="govbb-fieldset__legend">Preferred contact method</legend>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="r-email"
      type="radio"
      name="contact2"
      value="email"
    />
    <label class="govbb-radio-item__label" for="r-email">Email</label>
  </div>
  <div class="govbb-radio-item__conditional">
    <div class="govbb-form-group">
      <label class="govbb-label" for="r-email-addr">Email address</label>
      <input class="govbb-input" id="r-email-addr" type="email" />
    </div>
  </div>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="r-phone"
      type="radio"
      name="contact2"
      value="phone"
      checked
    />
    <label class="govbb-radio-item__label" for="r-phone">Phone</label>
  </div>
  <div class="govbb-radio-item__conditional">
    <div class="govbb-form-group">
      <label class="govbb-label" for="r-phone-num">Phone number</label>
      <input class="govbb-input" id="r-phone-num" type="tel" />
    </div>
  </div>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="r-post"
      type="radio"
      name="contact2"
      value="post"
      disabled
    />
    <label class="govbb-radio-item__label" for="r-post">Post (disabled)</label>
  </div>
</fieldset>
```

```tsx
import { Fieldset, FormGroup, Input, Label, Radio } from '@govtech-bb/react';

<Fieldset legend="Preferred contact method">
  <Radio
    name="contact2"
    value="email"
    label="Email"
    conditional={
      <FormGroup>
        <Label htmlFor="r-email-addr">Email address</Label>
        <Input id="r-email-addr" type="email" />
      </FormGroup>
    }
  />
  <Radio
    name="contact2"
    value="phone"
    label="Phone"
    defaultChecked
    conditional={
      <FormGroup>
        <Label htmlFor="r-phone-num">Phone number</Label>
        <Input id="r-phone-num" type="tel" />
      </FormGroup>
    }
  />
  <Radio name="contact2" value="post" label="Post (disabled)" disabled />
</Fieldset>;
```

## Tips

Do not pre-select an answer. Letting users make an active choice ensures they
give an answer they actually mean: pre-selecting an option skips the decision
and can produce answers users did not intend to give.
