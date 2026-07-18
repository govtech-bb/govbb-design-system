---
title: Table
description: Use tables to let users compare information in rows and columns.
lede: Tables let users compare information in rows and columns.
group: Content
---

## Preview

```html title="Table"
<table class="govbb-table">
  <caption class="govbb-table__caption">
    Passport processing times
  </caption>
  <thead>
    <tr>
      <th class="govbb-table__header" scope="col">Service</th>
      <th class="govbb-table__header" scope="col">Processing time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th class="govbb-table__header" scope="row">Passport renewal</th>
      <td class="govbb-table__cell">10 working days</td>
    </tr>
    <tr>
      <th class="govbb-table__header" scope="row">First adult passport</th>
      <td class="govbb-table__cell">15 working days</td>
    </tr>
    <tr>
      <th class="govbb-table__header" scope="row">Child passport</th>
      <td class="govbb-table__cell">10 working days</td>
    </tr>
  </tbody>
</table>
```

```tsx
import { Table, TableCell, TableHeader } from '@govtech-bb/react';

<Table caption="Passport processing times">
  <thead>
    <tr>
      <TableHeader scope="col">Service</TableHeader>
      <TableHeader scope="col">Processing time</TableHeader>
    </tr>
  </thead>
  <tbody>
    <tr>
      <TableHeader scope="row">Passport renewal</TableHeader>
      <TableCell>10 working days</TableCell>
    </tr>
  </tbody>
</Table>;
```

The Table component presents structured data with bold left-aligned headers, a
navy rule under the header row and pale-blue hairline separators between rows.
When the first column identifies each row, mark it up as a row header
(`<th scope="row">`): it renders as a highlighted cell, and screen readers
associate the row's cells with it. Always include a caption describing what
the table shows, and use `scope="col"` on column headers.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="table-when-to-use">
    <h3 id="table-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a table when users need to compare or look up structured data across rows and columns.</li>
      <li>Use it when every record shares the same fields, such as fees, dates or service locations.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="table-when-not-to-use">
    <h3 id="table-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use a table for page layout, long prose or records with different structures.</li>
      <li>Do not use it for one set of key–value facts; use a <a href="/components/summary-list/">summary list</a>.</li>
    </ul>
  </section>
</div>

## Best practices

### Make comparison effortless

Use a descriptive caption, short headers and consistent formats within each
column. Left-align text and right-align numbers that users compare as values.

### Keep the structure semantic at every width

Use header cells with the correct `scope` and never remove them in a responsive
layout. Prefer horizontal scrolling for a genuinely wide table rather than
turning rows into ambiguous blocks or shrinking text until it is hard to read.

## Wide tables

A table with many columns can be wider than a phone screen. Wrap it in a
`govbb-table-container` so the table scrolls sideways inside the wrapper
instead of forcing the whole page to scroll. Give the wrapper `tabindex="0"`,
`role="region"` and an `aria-label` so keyboard users can focus it and scroll,
and screen readers announce what it contains.

```html title="Table that scrolls on small screens"
<div
  class="govbb-table-container"
  tabindex="0"
  role="region"
  aria-label="Passport processing times"
>
  <table class="govbb-table">
    <!-- caption, thead, tbody as above -->
  </table>
</div>
```

## Numeric columns

Add the `--numeric` modifier to a column's header and cells to right-align the
values and use tabular figures, so digits line up for easy comparison.

```html title="Table with a numeric column"
<table class="govbb-table">
  <caption class="govbb-table__caption">
    Application fees
  </caption>
  <thead>
    <tr>
      <th class="govbb-table__header" scope="col">Service</th>
      <th class="govbb-table__header govbb-table__header--numeric" scope="col">
        Fee
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="govbb-table__cell">Passport renewal</td>
      <td class="govbb-table__cell govbb-table__cell--numeric">$150.00</td>
    </tr>
    <tr>
      <td class="govbb-table__cell">Birth certificate</td>
      <td class="govbb-table__cell govbb-table__cell--numeric">$25.00</td>
    </tr>
    <tr>
      <td class="govbb-table__cell">Driver's licence renewal</td>
      <td class="govbb-table__cell govbb-table__cell--numeric">$80.00</td>
    </tr>
  </tbody>
</table>
```
