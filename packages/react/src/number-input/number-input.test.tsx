import { Label } from '../form/form';
import { expectNoAxeViolations } from '../testing/axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NumberInput } from './number-input';

describe('NumberInput', () => {
  it('self-composes a labelled field with hint text', () => {
    const { container } = render(
      <NumberInput label="Quantity" hint="Between 1 and 10" name="quantity" />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    const hint = screen.getByText('Between 1 and 10');
    expect(input.id).toBe('quantity');
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(container.querySelector('.govbb-form-group')).not.toBeNull();
    expect(screen.getByRole('group', { name: 'Quantity' })).toBeDefined();
  });

  it('self-composes an error and marks the input invalid', () => {
    render(
      <NumberInput label="Quantity" error="Enter a quantity" name="quantity" />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    const error = screen.getByText('Enter a quantity');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

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

  it('disables each stepper when its limit is reached', () => {
    render(
      <NumberInput aria-label="Quantity" min={1} max={2} defaultValue={1} />,
    );
    const input = screen.getByRole('spinbutton', {
      name: 'Quantity',
    }) as HTMLInputElement;
    const up = screen.getByRole('button', {
      name: 'Increment',
    }) as HTMLButtonElement;
    const down = screen.getByRole('button', {
      name: 'Decrement',
    }) as HTMLButtonElement;

    expect(up.disabled).toBe(false);
    expect(down.disabled).toBe(true);

    fireEvent.click(up);
    expect(input.value).toBe('2');
    expect(up.disabled).toBe(true);
    expect(down.disabled).toBe(false);

    fireEvent.input(input, { target: { value: '1' } });
    expect(up.disabled).toBe(false);
    expect(down.disabled).toBe(true);
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

  it('keeps its native input type fixed', () => {
    // @ts-expect-error NumberInput intentionally does not expose the native type prop.
    render(<NumberInput aria-label="Qty" type="text" />);
    expect(screen.getByRole('spinbutton', { name: 'Qty' })).toBeDefined();
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <>
      <Label id="qty-label" htmlFor="qty">
        Quantity
      </Label>
      <NumberInput
        id="qty"
        labelId="qty-label"
        min={1}
        max={10}
        defaultValue={1}
      />
    </>,
  );
  await expectNoAxeViolations(container);
});
