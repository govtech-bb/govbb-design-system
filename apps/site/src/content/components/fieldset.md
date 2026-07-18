---
title: Fieldset
description: Use the fieldset component to group related form controls under one question.
lede: Groups related form controls with a shared, accessible legend.
group: Form elements
css: form
---

## Preview

```html title="Fieldset with related inputs"
<div class="govbb-form-group">
  <fieldset class="govbb-fieldset">
    <legend class="govbb-fieldset__legend">What is your address?</legend>

    <div class="govbb-form-group">
      <label class="govbb-label" for="address-line-1">Address line 1</label>
      <input
        class="govbb-input"
        id="address-line-1"
        name="address-line-1"
        type="text"
        autocomplete="address-line1"
      />
    </div>

    <div class="govbb-form-group">
      <label class="govbb-label" for="address-line-2">
        Address line 2 (optional)
      </label>
      <input
        class="govbb-input"
        id="address-line-2"
        name="address-line-2"
        type="text"
        autocomplete="address-line2"
      />
    </div>

    <div class="govbb-form-group">
      <label class="govbb-label" for="town">Town or city</label>
      <input
        class="govbb-input"
        id="town"
        name="town"
        type="text"
        autocomplete="address-level2"
      />
    </div>
  </fieldset>
</div>
```

```tsx
import { Fieldset, Input } from '@govtech-bb/react';

<Fieldset legend="What is your address?">
  <Input
    label="Address line 1"
    name="address-line-1"
    autoComplete="address-line1"
  />
  <Input
    label="Address line 2 (optional)"
    name="address-line-2"
    autoComplete="address-line2"
  />
  <Input label="Town or city" name="town" autoComplete="address-level2" />
</Fieldset>;
```

Use a fieldset when several form controls make up one answer or need one shared
question. The `<legend>` names the group, so screen readers announce the
relationship between the controls. The React `Fieldset` component supplies the
outer `.govbb-form-group`; include that wrapper explicitly when writing HTML.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="fieldset-when-to-use">
    <h3 id="fieldset-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a fieldset when several controls answer one question, such as an address or the parts of a date.</li>
      <li>Use it for groups of radio buttons or checkboxes so the shared question is announced with every option.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="fieldset-when-not-to-use">
    <h3 id="fieldset-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use a fieldset around one ordinary input; use a <a href="/components/form/">form group</a> with a label.</li>
      <li>Do not use a fieldset only for visual layout or to divide unrelated sections of a form.</li>
    </ul>
  </section>
</div>

## How it works

The first child of the fieldset must be a legend. Write the legend as a clear
question or group name. Every control inside the fieldset still needs its own
label; the legend does not replace those labels.

Keep the fieldset inside a `.govbb-form-group` so it follows the same vertical
rhythm as other form controls. Nested inputs can each use their own form group
to keep their labels, hints, errors and controls together.

Use the dedicated [radio](/components/radio/),
[checkbox](/components/checkbox/) or [date input](/components/date-input/)
guidance when one of those components already matches the question.

## Legend as the page heading

On a one-question-per-page form, the legend can contain the page heading. This
avoids repeating the same question as both a heading and a legend.

```html title="Legend as the page heading"
<div class="govbb-form-group">
  <fieldset class="govbb-fieldset">
    <legend class="govbb-fieldset__legend">
      <h1 class="govbb-text-h1">How would you like to be contacted?</h1>
    </legend>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="contact-email"
        name="contact-method"
        type="radio"
        value="email"
      />
      <label class="govbb-radio-item__label" for="contact-email">Email</label>
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="contact-phone"
        name="contact-method"
        type="radio"
        value="phone"
      />
      <label class="govbb-radio-item__label" for="contact-phone">Phone</label>
    </div>
  </fieldset>
</div>
```

```tsx
import { Fieldset, Radio } from '@govtech-bb/react';

<Fieldset
  legend={
    <h1 className="govbb-text-h1">How would you like to be contacted?</h1>
  }
>
  <Radio name="contact-method" value="email" label="Email" />
  <Radio name="contact-method" value="phone" label="Phone" />
</Fieldset>;
```

Use only one `<h1>` on the page. Keep any general help text inside the legend
short; put longer instructions after the legend as hint text and connect them
to the fieldset with `aria-describedby`.

## Accessibility

- Do not remove the fieldset or legend because the visual design seems to make
  the grouping obvious. Screen reader users need the semantic relationship.
- Keep the legend concise. Screen readers may announce it before every control
  in the group.
- Do not add `role="group"` to a native fieldset unless a specific compatibility
  issue requires it; the fieldset already provides group semantics.
- Connect group-level hints and errors to the fieldset with
  `aria-describedby`, using stable element IDs.
