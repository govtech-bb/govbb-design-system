import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SummaryList } from './summary-list';

const rows = [
  { key: 'Name', value: 'Alex Nurse' },
  { key: 'Date of birth', value: '14 March 1990' },
];

describe('SummaryList', () => {
  it('renders one row per pair with the BEM classes', () => {
    const { container } = render(<SummaryList rows={rows} />);
    expect(container.querySelector('dl')?.className).toBe('govbb-summary-list');
    expect(container.querySelectorAll('.govbb-summary-list__row')).toHaveLength(
      2,
    );
    expect(screen.getByText('Name').className).toBe('govbb-summary-list__key');
    expect(screen.getByText('Alex Nurse').className).toBe(
      'govbb-summary-list__value',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<SummaryList rows={rows} />);
    await expectNoAxeViolations(container);
  });
});
