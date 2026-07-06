import { render, screen, fireEvent } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NumberInput } from './number-input';

describe('NumberInput', () => {
  it('steps and fires onChange from the stepper buttons', () => {
    function Qty() {
      const [value, setValue] = useState('1');
      return (
        <NumberInput
          aria-label="Quantity"
          min={1}
          max={10}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    }
    render(<Qty />);
    const input = screen.getByRole('spinbutton', {
      name: 'Quantity',
    }) as HTMLInputElement;
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(input.value).toBe('2');
    fireEvent.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(input.value).toBe('1');
  });

  it('does nothing when disabled', () => {
    const onChange = vi.fn();
    render(
      <NumberInput
        aria-label="Qty"
        defaultValue={1}
        disabled
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<NumberInput ref={ref} aria-label="Qty" />);
    expect(ref.current).toBe(screen.getByRole('spinbutton', { name: 'Qty' }));
  });
});
