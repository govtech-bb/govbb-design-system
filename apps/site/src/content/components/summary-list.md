---
title: Summary list
description: Use a summary list to present pairs of keys and values, such as a user's answers.
lede: Presents pairs of keys and values — such as answers at the end of a form.
group: Content
---

## Preview

```html title="Summary list" full
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
    <dt class="govbb-summary-list__key">
      Have you been known by any other last name?
    </dt>
    <dd class="govbb-summary-list__value">No</dd>
  </div>
</dl>
```

```tsx
import { SummaryList } from '@govtech-bb/react';

<SummaryList
  rows={[
    { key: 'Name', value: 'Alex Nurse' },
    { key: 'Date of birth', value: '14 March 1990' },
    { key: 'Have you been known by any other last name?', value: 'No' },
  ]}
/>;
```

The summary list presents pairs of keys and values as rows of a description
list — most commonly a _Check your answers_ page at the end of a form, where
users review what they entered before submitting.

## When to use this component

Use a summary list to play back a user's answers before they submit, or to
show a small set of facts about one thing — an application, a person, a
booking. The `<dl>` structure ties each value to its key for screen readers.

## When not to use this component

Do not use a summary list to compare several things across the same fields —
that is tabular data, so use a [table](/components/table/). Do not use it for
content that is not key–value pairs; use a [list](/components/list/) or prose.
