import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SummaryList } from './summary-list';

describe('SummaryList', () => {
  it('renders a dl with a row per key–value pair', () => {
    const { container } = render(
      <SummaryList
        rows={[
          { key: 'Name', value: 'Alex Nurse' },
          { key: 'Date of birth', value: '14 March 1990' },
        ]}
      />,
    );
    const dl = container.firstElementChild!;
    expect(dl.tagName).toBe('DL');
    expect(dl.className).toBe('govbb-summary-list');
    expect(dl.querySelectorAll('.govbb-summary-list__row')).toHaveLength(2);
    expect(screen.getByText('Name').tagName).toBe('DT');
    expect(screen.getByText('Alex Nurse').tagName).toBe('DD');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <SummaryList rows={[{ key: 'Name', value: 'Alex Nurse' }]} />,
  );
  await expectNoAxeViolations(container);
});
