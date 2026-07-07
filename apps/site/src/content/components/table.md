---
title: Table
description: Use tables to let users compare information in rows and columns.
lede: Presents data in rows and columns so users can compare values.
group: Content
---

## Preview

```html title="Table" full
<table class="govbb-table">
  <caption class="govbb-table__caption">
    Application fees
  </caption>
  <thead>
    <tr>
      <th class="govbb-table__header" scope="col">Service</th>
      <th class="govbb-table__header" scope="col">Processing time</th>
      <th class="govbb-table__header govbb-table__header--numeric" scope="col">
        Fee
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="govbb-table__cell">Passport renewal</td>
      <td class="govbb-table__cell">10 working days</td>
      <td class="govbb-table__cell govbb-table__cell--numeric">$150.00</td>
    </tr>
    <tr>
      <td class="govbb-table__cell">Birth certificate</td>
      <td class="govbb-table__cell">5 working days</td>
      <td class="govbb-table__cell govbb-table__cell--numeric">$25.00</td>
    </tr>
  </tbody>
</table>
```

```tsx
import { Table, TableCell, TableHeader } from '@govtech-bb/react';

<Table caption="Application fees">
  <thead>
    <tr>
      <TableHeader scope="col">Service</TableHeader>
      <TableHeader scope="col">Processing time</TableHeader>
      <TableHeader scope="col" numeric>
        Fee
      </TableHeader>
    </tr>
  </thead>
  <tbody>
    <tr>
      <TableCell>Passport renewal</TableCell>
      <TableCell>10 working days</TableCell>
      <TableCell numeric>$150.00</TableCell>
    </tr>
    <tr>
      <TableCell>Birth certificate</TableCell>
      <TableCell>5 working days</TableCell>
      <TableCell numeric>$25.00</TableCell>
    </tr>
  </tbody>
</Table>;
```

The table presents data in rows and columns so users can scan down a column
and compare values — fees, processing times, opening hours.

## When to use this component

Use a table when users need to compare values across several items, or look
up a value at the intersection of a row and a column. Always give the table a
`<caption>` describing what it shows, and mark header cells with `scope` so
screen readers can relate each cell to its headers.

## When not to use this component

Do not use a table for layout, or for content that is not data. For the
details of a single item — one application, one person — use a
[summary list](/components/summary-list/) instead.

## Numeric columns

Add the `--numeric` modifier to the header and cells of columns containing
numbers. It right-aligns the values so their digits line up, making amounts
easy to compare down the column.
