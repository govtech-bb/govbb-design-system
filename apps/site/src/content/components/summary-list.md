---
title: Summary list
description: Use summary lists to show a set of key/value pairs, such as a user's answers.
lede: Summary lists show information as key/value pairs, one row per pair.
group: Content
---

## Preview

```html title="Summary list"
<dl class="govbb-summary-list">
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Name</dt>
    <dd class="govbb-summary-list__value">Alex Nurse</dd>
  </div>
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Date of birth</dt>
    <dd class="govbb-summary-list__value">14 March 1990</dd>
  </div>
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">National registration number</dt>
    <dd class="govbb-summary-list__value">900314-0052</dd>
  </div>
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">
      Have you been known by any other last name?
    </dt>
    <dd class="govbb-summary-list__value">No</dd>
  </div>
</dl>
```

The Summary list component displays pairs of related information (a bold key
and a plain value), one row per pair. It is built on a description list
(`<dl>`), so each key is a `<dt>` and each value a `<dd>`. On small screens the
key stacks above the value; from tablet widths up they sit side by side with
the keys in a fixed-width column.

```tsx
import { SummaryList } from '@govtech-bb/react';

<SummaryList
  rows={[
    { key: 'Name', value: 'Alex Nurse' },
    { key: 'Date of birth', value: '14 March 1990' },
  ]}
/>;
```

## When to use this component

Use a summary list to present information a user has already given, or facts
about a person, application or service. It is the core of the
_check your answers_ pattern: at the end of a form, show the user's answers as
a summary list so they can confirm everything is correct before submitting,
for example before submitting a passport renewal or an NIS claim.

## When not to use this component

Do not use a summary list for data that users need to compare across several
items. Use a table instead. Do not use it for simple lists of links or steps. Use a list
instead.
