import { expectNoAxeViolations } from '../testing/axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Checkbox, CheckboxGroup } from './checkbox';

describe('Checkbox', () => {
  it('wires the label to the input and toggles on label click', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="I agree" />);
    const input = screen.getByRole('checkbox', { name: 'I agree' });
    expect(ref.current).toBe(input);
    fireEvent.click(screen.getByText('I agree'));
    expect(ref.current!.checked).toBe(true);
  });

  it('respects an explicit id', () => {
    render(<Checkbox id="terms" label="Terms" />);
    expect(screen.getByRole('checkbox', { name: 'Terms' }).id).toBe('terms');
  });
});

describe('CheckboxGroup', () => {
  it('wraps children in a fieldset with legend, hint and error', () => {
    render(
      <CheckboxGroup
        legend="Select all that apply"
        hint="Leave blank any that do not"
        error="Choose at least one"
      >
        <Checkbox label="Email" value="email" />
        <Checkbox label="Phone" value="phone" />
      </CheckboxGroup>,
    );
    const group = screen.getByRole('group', { name: /select all that apply/i });
    const error = screen.getByText('Choose at least one');
    const hint = screen.getByText('Leave blank any that do not');
    expect(error.className).toBe('govbb-error-message');
    expect(group.getAttribute('aria-describedby')).toBe(
      `${hint.id} ${error.id}`,
    );
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <CheckboxGroup legend="Select all that apply">
        <Checkbox label="Email" value="email" />
        <Checkbox label="Phone" value="phone" />
      </CheckboxGroup>,
    );
    await expectNoAxeViolations(container);
  });
});

it('has no axe violations', async () => {
  const { container } = render(<Checkbox label="I agree to the terms" />);
  await expectNoAxeViolations(container);
});
