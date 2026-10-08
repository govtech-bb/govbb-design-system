---
title: Label
description: Use the label component to name the field a form control sits above.
lede: Names the field it sits above. Every form control needs one.
group: Form elements
css: form
---

## Preview

```html title="Label with hint text"
<div class="govbb-form-group">
  <label class="govbb-label" for="nrn">National registration number</label>
  <span class="govbb-hint" id="nrn-description">
    It is on your national ID card. For example, 850101-0123
  </span>
  <input
    class="govbb-input"
    id="nrn"
    name="nrn"
    type="text"
    aria-describedby="nrn-description"
  />
</div>
```

```tsx
import { FormGroup, Hint, Input, Label } from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="nrn">National registration number</Label>
  <Hint id="nrn-description">
    It is on your national ID card. For example, 850101-0123
  </Hint>
  <Input id="nrn" name="nrn" aria-describedby="nrn-description" />
</FormGroup>;
```

The Label component names the field it sits above, so users know what answer is
expected before they start typing. Every form control (input, select, text area,
checkbox, or radio) needs a visible label.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="label-when-to-use">
    <h3 id="label-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a visible label for every form control.</li>
      <li>Use a legend instead when one question describes a group of related controls.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="label-when-not-to-use">
    <h3 id="label-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use placeholder text as a replacement for a label.</li>
      <li>Do not use a label as a container for long instructions or unrelated content.</li>
    </ul>
  </section>
</div>

## Best practices

### Connect the label to its control

Match the label's `for` value to the control's `id`. This lets users select the
label to focus the control and gives assistive technology a reliable name.

### Write short, direct label text

Use sentence case, put the important words first and do not end labels with a
colon. Put examples, format rules and explanations in hint text instead.

## Writing label text

Write labels as short noun phrases, such as _"Email address"_, rather than
questions or instructions. Keep the label focused on naming the field. Put any
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

```tsx
import { FormGroup, Input, Label } from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="email-address">Email address</Label>
  <Input id="email-address" name="email-address" type="email" />
</FormGroup>;
```

## Marking optional fields

Most fields on a government form are required, so required fields carry no
mark. Never use asterisks. When a field is genuinely optional, say so in the
label with a muted "(optional)" suffix.

```html title="Optional field"
<div class="govbb-form-group">
  <label class="govbb-label" for="middle-name">
    Middle name <span class="govbb-label__optional">(optional)</span>
  </label>
  <input class="govbb-input" id="middle-name" name="middle-name" type="text" />
</div>
```

```tsx
import { FormGroup, Input, Label } from '@govtech-bb/react';

// Standalone label
<Label htmlFor="middle-name" optional>
  Middle name
</Label>;

// Self-composing fields derive it from an explicit required={false}
<Input label="Middle name" name="middle-name" required={false} />;
```

- Use "(optional)" only when most fields in the form are required. If most
  fields are optional, question the form before questioning the labels.
- Be consistent within a form: mark every optional field or none.
- A field with no indicator is assumed required, so make sure it really is.
- The indicator does not validate anything. Pair it with the `required`
  attribute on the controls that must be filled in; the suffix sits inside the
  label, so screen readers announce it with the field name.

## Grouping controls

Use only one label per control. To name a group of related controls, such as a
set of checkboxes or radio buttons, use a `<fieldset>` with a `<legend>` instead
of a label. This frames the question for the whole group rather than a single
field.
