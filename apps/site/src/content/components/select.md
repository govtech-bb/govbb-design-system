---
title: Select
description: Use the select component to let users choose one option from a long list.
lede: Lets users choose one option from a long, familiar list.
group: Form elements
---

## Preview

```html title="Select with hint text"
<div class="govbb-form-group">
  <label class="govbb-label" for="parish">Parish</label>
  <p class="govbb-hint" id="parish-hint">Where you currently live</p>
  <select
    class="govbb-select"
    id="parish"
    name="parish"
    aria-describedby="parish-hint"
  >
    <option value="" disabled selected>Select a parish</option>
    <option value="christ-church">Christ Church</option>
    <option value="st-andrew">Saint Andrew</option>
    <option value="st-george">Saint George</option>
    <option value="st-james">Saint James</option>
    <option value="st-john">Saint John</option>
    <option value="st-joseph">Saint Joseph</option>
    <option value="st-lucy">Saint Lucy</option>
    <option value="st-michael">Saint Michael</option>
    <option value="st-peter">Saint Peter</option>
    <option value="st-philip">Saint Philip</option>
    <option value="st-thomas">Saint Thomas</option>
  </select>
</div>
```

```tsx
import { FormGroup, Hint, Label, Select } from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="parish">Parish</Label>
  <Hint id="parish-hint">Where you currently live</Hint>
  <Select
    id="parish"
    name="parish"
    defaultValue=""
    aria-describedby="parish-hint"
  >
    <option value="" disabled>
      Select a parish
    </option>
    <option value="christ-church">Christ Church</option>
    <option value="st-andrew">Saint Andrew</option>
    <option value="st-george">Saint George</option>
    <option value="st-james">Saint James</option>
    <option value="st-john">Saint John</option>
    <option value="st-joseph">Saint Joseph</option>
    <option value="st-lucy">Saint Lucy</option>
    <option value="st-michael">Saint Michael</option>
    <option value="st-peter">Saint Peter</option>
    <option value="st-philip">Saint Philip</option>
    <option value="st-thomas">Saint Thomas</option>
  </Select>
</FormGroup>;
```

The Select component is a dropdown that lets users choose a single option from a
long list, such as a parish or a country. It is a last resort for long lists:
most questions are easier to answer with visible options.

## When to use this component

Use a select when there are more than about five options and the list is one
users already know, such as a parish or a month. Selects work well when the
options are long and predictable enough that hiding them behind a dropdown does
not slow users down.

## When not to use this component

Do not use a select for five or fewer options: radio buttons show every choice
at once and are easier to scan and select. Do not use a select for data users
would want to search for, such as a long list of countries, without also
offering a typeahead. And do not use a select when more than one answer is
allowed. Use checkboxes instead.

## Guidance

Start the list with a non-selectable placeholder option, such as _"Select a
parish"_, so users make an active choice rather than submitting a default value
by accident.

Always pair a select with a visible `<label>`. Use hint text (`.govbb-hint`)
beneath the label to explain what is being asked, and link it to the select with
`aria-describedby`.

## Errors

When a select fails validation, show an error message (`.govbb-error-message`)
above the select with `role="alert"`, and mark the select itself with
`aria-invalid="true"` and `aria-describedby` pointing at the error message id.
Keep error messages specific and actionable, such as "Select a parish".

```html title="Select with error"
<div class="govbb-form-group">
  <label class="govbb-label" for="parish">Parish</label>
  <p class="govbb-error-message" id="parish-error" role="alert">
    Select a parish
  </p>
  <select
    class="govbb-select"
    id="parish"
    name="parish"
    aria-invalid="true"
    aria-describedby="parish-error"
  >
    <option value="" disabled selected>Select a parish</option>
    <option value="christ-church">Christ Church</option>
    <option value="st-michael">Saint Michael</option>
    <option value="st-james">Saint James</option>
  </select>
</div>
```

```tsx
import { ErrorMessage, FormGroup, Label, Select } from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="parish">Parish</Label>
  <ErrorMessage id="parish-error" role="alert">
    Select a parish
  </ErrorMessage>
  <Select
    id="parish"
    name="parish"
    defaultValue=""
    aria-invalid
    aria-describedby="parish-error"
  >
    <option value="" disabled>
      Select a parish
    </option>
    <option value="christ-church">Christ Church</option>
    <option value="st-michael">Saint Michael</option>
    <option value="st-james">Saint James</option>
  </Select>
</FormGroup>;
```

## Disabled selects

Avoid disabling selects wherever possible. A disabled select gives the user no
information about what they need to do to enable it, and its content is skipped
by many screen readers. Prefer showing the value as read-only text, or explaining
why the field is unavailable.

```html title="Disabled select"
<div class="govbb-form-group">
  <label class="govbb-label" for="parish-disabled">Parish</label>
  <select class="govbb-select" id="parish-disabled" name="parish" disabled>
    <option value="" disabled selected>Select a parish</option>
    <option value="christ-church">Christ Church</option>
  </select>
</div>
```

```tsx
import { FormGroup, Label, Select } from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="parish-disabled">Parish</Label>
  <Select id="parish-disabled" name="parish" defaultValue="" disabled>
    <option value="" disabled>
      Select a parish
    </option>
    <option value="christ-church">Christ Church</option>
  </Select>
</FormGroup>;
```
