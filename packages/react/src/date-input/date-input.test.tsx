import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DateInput } from './date-input';

describe('DateInput', () => {
  it('renders labelled day/month/year fields and wires the hint', () => {
    const { container } = render(
      <DateInput
        legend="Date of birth"
        hint="For example, 27 3 1990"
        dayProps={{ name: 'dob-day' }}
      />,
    );
    const group = screen.getByRole('group', { name: 'Date of birth' });
    expect(group.parentElement).toBe(
      container.querySelector('.govbb-form-group'),
    );
    const hint = screen.getByText('For example, 27 3 1990');
    expect(group.getAttribute('aria-describedby')).toBe(hint.id);
    const day = screen.getByLabelText('Day') as HTMLInputElement;
    expect(day.name).toBe('dob-day');
    expect(screen.getByLabelText('Year').className).toContain(
      'govbb-date-input__field--year',
    );
    expect(screen.getByLabelText('Month')).toBeDefined();
  });

  it('respects consumer-provided ids on the part inputs', () => {
    render(
      <DateInput
        legend="Start date"
        dayProps={{ id: 'start-date-day' }}
        monthProps={{ id: 'start-date-month' }}
      />,
    );
    const day = screen.getByLabelText('Day');
    expect(day.id).toBe('start-date-day');
    expect(screen.getByLabelText('Month').id).toBe('start-date-month');
    // Year gets the auto-generated fallback and stays labelled.
    expect(screen.getByLabelText('Year').id).not.toBe('');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <DateInput legend="Date of birth" hint="For example, 27 3 1990" />,
  );
  await expectNoAxeViolations(container);
});

it('renders an error message wired into the group description', () => {
  render(<DateInput legend="Date of birth" error="Enter a valid date" />);
  const group = screen.getByRole('group', { name: 'Date of birth' });
  const error = screen.getByText('Enter a valid date');
  expect(error.className).toBe('govbb-error-message');
  expect(group.getAttribute('aria-describedby')).toBe(error.id);
});

it('shows the error and drops the hint if both are passed', () => {
  render(
    // @ts-expect-error hint/error are mutually exclusive
    <DateInput
      legend="Date of birth"
      hint="For example, 27 3 1990"
      error="Enter a valid date"
    />,
  );
  const group = screen.getByRole('group', { name: 'Date of birth' });
  const error = screen.getByText('Enter a valid date');
  expect(screen.queryByText('For example, 27 3 1990')).toBeNull();
  expect(group.getAttribute('aria-describedby')).toBe(error.id);
});
