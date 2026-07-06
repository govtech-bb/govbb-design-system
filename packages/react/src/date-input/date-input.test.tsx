import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DateInput } from './date-input';

describe('DateInput', () => {
  it('renders labelled day/month/year fields and wires the hint', () => {
    render(
      <DateInput
        legend="Date of birth"
        hint="For example, 27 3 1990"
        dayProps={{ name: 'dob-day' }}
      />,
    );
    const group = screen.getByRole('group', { name: 'Date of birth' });
    const hint = screen.getByText('For example, 27 3 1990');
    expect(group.getAttribute('aria-describedby')).toBe(hint.id);
    const day = screen.getByLabelText('Day') as HTMLInputElement;
    expect(day.name).toBe('dob-day');
    expect(screen.getByLabelText('Year').className).toContain(
      'govbb-date-input__field--year',
    );
    expect(screen.getByLabelText('Month')).toBeDefined();
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <DateInput legend="Date of birth" hint="For example, 27 3 1990" />,
  );
  await expectNoAxeViolations(container);
});
