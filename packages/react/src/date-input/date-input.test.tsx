import { expectNoAxeViolations } from '../testing/axe';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  DateInput,
  formatDateInput,
  parseDateInput,
  type DateInputValue,
} from './date-input';

describe('DateInput', () => {
  it('renders labelled day/month/year fields and wires the description', () => {
    const { container } = render(
      <DateInput
        legend="Date of birth"
        description="For example, 27 3 1990"
        dayProps={{ name: 'dob-day' }}
      />,
    );
    const group = screen.getByRole('group', { name: 'Date of birth' });
    expect(group.parentElement).toBe(
      container.querySelector('.govbb-form-group'),
    );
    const description = screen.getByText('For example, 27 3 1990');
    expect(group.getAttribute('aria-describedby')).toBe(description.id);
    const day = screen.getByLabelText('Day') as HTMLInputElement;
    expect(day.name).toBe('dob-day');
    expect(screen.getByLabelText('Year').className).toContain(
      'govbb-date-input__field--year',
    );
    expect(screen.getByLabelText('Month')).toBeDefined();
  });

  it('derives part names and ids from the name prefix, overridable per part', () => {
    render(
      <DateInput legend="Date of birth" name="dob" dayProps={{ name: 'dd' }} />,
    );
    expect((screen.getByLabelText('Day') as HTMLInputElement).name).toBe('dd');
    expect(screen.getByLabelText('Day').id).toBe('dob-day');
    expect(screen.getByLabelText('Year').id).toBe('dob-year');
    expect((screen.getByLabelText('Month') as HTMLInputElement).name).toBe(
      'dob-month',
    );
    expect((screen.getByLabelText('Year') as HTMLInputElement).name).toBe(
      'dob-year',
    );
  });

  it('drives the fields from value and emits the merged object on change', () => {
    const onChange = vi.fn();
    const value: DateInputValue = { day: '27', month: '', year: '1990' };
    render(
      <DateInput legend="Date of birth" value={value} onChange={onChange} />,
    );
    expect((screen.getByLabelText('Day') as HTMLInputElement).value).toBe('27');
    fireEvent.change(screen.getByLabelText('Month'), {
      target: { value: '3' },
    });
    expect(onChange).toHaveBeenCalledWith({
      day: '27',
      month: '3',
      year: '1990',
    });
  });

  it('spreads extra attributes onto the fieldset', () => {
    render(
      <DateInput legend="Start date" id="start-date" data-testid="date" />,
    );
    const group = screen.getByRole('group', { name: 'Start date' });
    expect(group.id).toBe('start-date');
    expect(group.getAttribute('data-testid')).toBe('date');
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

describe('formatDateInput / parseDateInput', () => {
  it('pads to YYYY-MM-DD and round-trips', () => {
    expect(formatDateInput({ day: '5', month: '3', year: '2021' })).toBe(
      '2021-03-05',
    );
    expect(parseDateInput('2021-03-05')).toEqual({
      day: '05',
      month: '03',
      year: '2021',
    });
  });

  it('returns empty values for incomplete input', () => {
    expect(formatDateInput({ day: '5', month: '', year: '2021' })).toBe('');
    expect(parseDateInput('')).toEqual({ day: '', month: '', year: '' });
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <DateInput legend="Date of birth" description="For example, 27 3 1990" />,
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

it('keeps the description with an error and marks every date part invalid', () => {
  render(
    <DateInput
      legend="Date of birth"
      description="For example, 27 3 1990"
      error="Enter a valid date"
      dayProps={{ 'aria-invalid': false }}
    />,
  );
  const group = screen.getByRole('group', { name: 'Date of birth' });
  const description = screen.getByText('For example, 27 3 1990');
  const error = screen.getByText('Enter a valid date');
  expect(group.getAttribute('aria-describedby')).toBe(
    `${description.id} ${error.id}`,
  );
  for (const label of ['Day', 'Month', 'Year']) {
    expect(screen.getByLabelText(label).getAttribute('aria-invalid')).toBe(
      'true',
    );
  }
});
