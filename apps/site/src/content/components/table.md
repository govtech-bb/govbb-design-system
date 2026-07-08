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

The Table component presents structured data with bold left-aligned headers, a
navy rule under the header row and pale-blue hairline separators between rows.
When the first column identifies each row, mark it up as a row header
(`<th scope="row">`): it renders as a highlighted cell, and screen readers
associate the row's cells with it. Always include a caption describing what
the table shows, and use `scope="col"` on column headers. There is no React
wrapper yet, so use the HTML directly.

## When to use this component

Use a table to present data that users need to scan, compare or look up, for
example fees, processing times or opening hours across several government
services.

## When not to use this component

Do not use a table for content that is not tabular, such as a list of steps or
a set of links. Use a list instead. Do not use a table purely for visual
layout. If you are showing a single set of key/value pairs, such as a user's
answers, use the summary list component instead.

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
