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

```tsx
import { SummaryList } from '@govtech-bb/react';

<SummaryList
  rows={[
    { key: 'Name', value: 'Alex Nurse' },
    { key: 'Date of birth', value: '14 March 1990' },
  ]}
/>;
```

The Summary list component displays pairs of related information (a bold key
and a plain value), one row per pair. It is built on a description list
(`<dl>`), so each key is a `<dt>` and each value a `<dd>`. On small screens the
key stacks above the value; from tablet widths up they sit side by side with
the keys in a fixed-width column.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="summary-list-when-to-use">
    <h3 id="summary-list-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a summary list for key–value facts about one person, application, service or record.</li>
      <li>Use it to let users review answers before submitting a service.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="summary-list-when-not-to-use">
    <h3 id="summary-list-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it to compare the same fields across several records; use a <a href="/components/table/">table</a>.</li>
      <li>Do not use it for a plain list of links, tasks or steps.</li>
    </ul>
  </section>
</div>

## Best practices

### Use clear keys and complete values

Choose short labels such as “Date of birth” and show the value exactly as users
need to verify it. Group multiple summary lists under meaningful headings.

### Give every action context

If a row includes a “Change” link, add visually hidden text such as “Change
date of birth” so links remain distinct out of context. Return users to the
review page after the change.
