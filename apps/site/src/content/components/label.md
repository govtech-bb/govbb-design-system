---
title: Label
description: Use the label component to name the field a form control sits above.
lede: Names the field it sits above. Every form control needs one.
group: Form elements
---

## Preview

```html title="Label with hint text"
<div class="govbb-form-group">
  <label class="govbb-label" for="nrn">National registration number</label>
  <p class="govbb-hint" id="nrn-hint">
    It is on your national ID card. For example, 850101-0123
  </p>
  <input
    class="govbb-input"
    id="nrn"
    name="nrn"
    type="text"
    aria-describedby="nrn-hint"
  />
</div>
```

The Label component names the field it sits above, so users know what answer is
expected before they start typing. Every form control — input, select, text area,
checkbox, or radio — needs a visible label.

## When to use this component

Use a label on every form control, without exception. Associate it with its
control using `for` and `id` so clicking the label focuses the control, and so
assistive technology announces the label whenever the control receives focus.

## When not to use this component

Do not use placeholder text in place of a label. Placeholder text disappears as
soon as the user starts typing, offers no persistent reminder of what is being
asked, and is easy to miss altogether — particularly for users of screen
magnification or those who are easily distracted.

## Writing label text

Write labels as short noun phrases, such as _"Email address"_, rather than
questions or instructions. Keep the label focused on naming the field — put any
extra detail, such as an expected format or example, in hint text instead.

## Pairing with hint text

Use hint text (`.govbb-hint`) beneath the label to explain a format or give an
example, such as _"It is on your national ID card"_. Link the hint to its control
with `aria-describedby` so it is announced alongside the label.

```html title="Label without hint text"
<div class="govbb-form-group">
  <label class="govbb-label" for="email-address">Email address</label>
  <input
    class="govbb-input"
    id="email-address"
    name="email-address"
    type="email"
  />
</div>
```

## Grouping controls

Use only one label per control. To name a group of related controls, such as a
set of checkboxes or radio buttons, use a `<fieldset>` with a `<legend>` instead
of a label — this frames the question for the whole group rather than a single
field.
