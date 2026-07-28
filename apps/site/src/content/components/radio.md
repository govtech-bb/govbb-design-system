---
title: Radio
description: Use radio buttons to let users select a single option from a list.
lede: Radio buttons let users pick exactly one option from a short list.
group: Form elements
css: checkbox-radio
---

## Preview

```html title="Radio group"
<div class="govbb-form-group">
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
</div>
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

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="radio-when-to-use">
    <h3 id="radio-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use radio buttons when users must choose exactly one option from a short list.</li>
      <li>Use them when seeing all choices at once helps users compare and decide.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="radio-when-not-to-use">
    <h3 id="radio-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use radio buttons when more than one option may be selected; use <a href="/components/checkbox/">checkboxes</a>.</li>
      <li>Do not use them for a long list that is difficult to scan; consider a <a href="/components/select/">select</a>.</li>
    </ul>
  </section>
</div>

## Best practices

### Group one question with a legend

Put related radios in a `fieldset`, use the question as the `legend` and add a
hint such as “Select one option” when needed. Place each radio before its label.

### Avoid influencing the answer

Do not preselect an option for a question. Order choices logically, add “None
of the above” when it is a real answer, and use per-option hints only where they
help users distinguish similar choices.

## Per-option hints

Add a hint to a single option to clarify its meaning. Use `aria-describedby` so
screen readers announce it alongside the option's label.

```html title="Radio group with per-option hints"
<div class="govbb-form-group">
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
        aria-describedby="contact-email-description"
      />
      <label class="govbb-radio-item__label" for="contact-email">Email</label>
      <span class="govbb-hint" id="contact-email-description">
        We'll only use this to send updates about your application.
      </span>
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="contact-phone"
        type="radio"
        name="contact"
        value="phone"
        aria-describedby="contact-phone-description"
      />
      <label class="govbb-radio-item__label" for="contact-phone">Phone</label>
      <span class="govbb-hint" id="contact-phone-description">
        A government officer may call between 9am and 5pm.
      </span>
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
</div>
```

```tsx
import { Fieldset, Radio } from '@govtech-bb/react';

<Fieldset legend="How would you like to be contacted?">
  <Radio
    name="contact"
    value="email"
    label="Email"
    description="We'll only use this to send updates about your application."
  />
  <Radio
    name="contact"
    value="phone"
    label="Phone"
    description="A government officer may call between 9am and 5pm."
  />
  <Radio name="contact" value="post" label="Post" />
</Fieldset>;
```

## Conditional reveal

Show follow-up content when a specific option is selected. The conditional block
sits as a sibling of its radio item and appears only when that radio is checked.

```html title="Radio group with conditional reveal"
<div class="govbb-form-group">
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
      <label class="govbb-radio-item__label" for="r-post"
        >Post (disabled)</label
      >
    </div>
  </fieldset>
</div>
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
