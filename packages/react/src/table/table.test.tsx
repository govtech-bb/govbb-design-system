import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table, TableCell, TableHeader } from './table';

function renderTable() {
  return render(
    <Table caption="Application fees">
      <thead>
        <tr>
          <TableHeader scope="col">Service</TableHeader>
          <TableHeader scope="col" numeric>
            Fee
          </TableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <TableHeader scope="row">Passport renewal</TableHeader>
          <TableCell numeric>$150.00</TableCell>
        </tr>
      </tbody>
    </Table>,
  );
}

describe('Table', () => {
  it('renders the caption and BEM classes', () => {
    renderTable();
    expect(screen.getByText('Application fees').className).toBe(
      'govbb-table__caption',
    );
    expect(screen.getByRole('table').className).toBe('govbb-table');
    expect(screen.getByRole('columnheader', { name: 'Fee' }).className).toBe(
      'govbb-table__header govbb-table__header--numeric',
    );
    expect(screen.getByRole('cell', { name: '$150.00' }).className).toBe(
      'govbb-table__cell govbb-table__cell--numeric',
    );
  });

  it('marks up row headers with scope', () => {
    renderTable();
    expect(
      screen
        .getByRole('rowheader', { name: 'Passport renewal' })
        .getAttribute('scope'),
    ).toBe('row');
  });

  it('has no axe violations', async () => {
    const { container } = renderTable();
    await expectNoAxeViolations(container);
  });
});
