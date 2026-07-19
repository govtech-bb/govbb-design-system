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

  it('renders row actions with visually hidden context', () => {
    const { container } = render(
      <SummaryList
        rows={[
          {
            key: 'Name',
            value: 'Alex Nurse',
            actions: {
              href: '/name/',
              label: 'Change',
              visuallyHiddenText: 'name',
            },
          },
          { key: 'Date of birth', value: '14 March 1990' },
        ]}
      />,
    );
    const link = screen.getByRole('link', { name: 'Change name' });
    expect(link.getAttribute('href')).toBe('/name/');
    expect(link.parentElement?.className).toBe('govbb-summary-list__actions');
    expect(
      container.querySelectorAll('.govbb-summary-list__actions'),
    ).toHaveLength(1);
  });

  it('renders multiple actions and a custom link component', () => {
    render(
      <SummaryList
        linkComponent={(props) => <a data-router {...props} />}
        rows={[
          {
            key: 'File',
            value: 'passport.pdf',
            actions: [
              { href: '/view/', label: 'View' },
              { href: '/remove/', label: 'Remove' },
            ],
          },
        ]}
      />,
    );
    const view = screen.getByRole('link', { name: 'View' });
    expect(view.getAttribute('data-router')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Remove' })).toBeDefined();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <SummaryList
        rows={[
          {
            ...rows[0],
            actions: {
              href: '/name/',
              label: 'Change',
              visuallyHiddenText: 'name',
            },
          },
          rows[1],
        ]}
      />,
    );
    await expectNoAxeViolations(container);
  });
});
