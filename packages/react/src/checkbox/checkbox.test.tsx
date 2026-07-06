import { expectNoAxeViolations } from '../testing/axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './checkbox';

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

it('has no axe violations', async () => {
  const { container } = render(<Checkbox label="I agree to the terms" />);
  await expectNoAxeViolations(container);
});
