import { expectNoAxeViolations } from '../testing/axe';
import { fireEvent, render, screen } from '@testing-library/react';
import { StrictMode, createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Combobox } from './combobox';

const options = [
  { value: '', label: 'Select a country', disabled: true },
  { value: 'ag', label: 'Antigua and Barbuda' },
  { value: 'bb', label: 'Barbados' },
  { value: 'lc', label: 'Saint Lucia' },
];

describe('Combobox', () => {
  it('self-composes a labelled field and enhances it into a combobox', () => {
    const { container } = render(
      <Combobox
        label="Country of birth"
        description="Start typing to filter the list"
        name="country"
        defaultValue=""
        options={options}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Country of birth' });
    expect(input.id).toBe('country');
    expect(input.getAttribute('aria-describedby')).toBe(
      screen.getByText('Start typing to filter the list').id,
    );
    expect(container.querySelector('.govbb-form-group')).not.toBeNull();
    const select = container.querySelector('select')!;
    expect(select.name).toBe('country');
    expect(select.getAttribute('aria-hidden')).toBe('true');
  });

  it('filters as the user types and fires onChange when an option is chosen', () => {
    const onChange = vi.fn();
    render(
      <Combobox
        aria-label="Country"
        name="country"
        defaultValue=""
        options={options}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('combobox', {
      name: 'Country',
    }) as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'saint' } });
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Saint Lucia',
    ]);
    fireEvent.click(screen.getByRole('option', { name: 'Saint Lucia' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe('lc');
    expect(input.value).toBe('Saint Lucia');
  });

  it('shows a controlled value and follows updates to it', () => {
    function Controlled() {
      const [value, setValue] = useState('bb');
      return (
        <>
          <Combobox
            aria-label="Country"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            options={options}
          />
          <button type="button" onClick={() => setValue('lc')}>
            Set Saint Lucia
          </button>
        </>
      );
    }
    render(<Controlled />);
    const input = screen.getByRole('combobox', {
      name: 'Country',
    }) as HTMLInputElement;
    expect(input.value).toBe('Barbados');
    fireEvent.click(screen.getByRole('button', { name: 'Set Saint Lucia' }));
    expect(input.value).toBe('Saint Lucia');
  });

  it('marks the field invalid and describes it by the error', () => {
    render(
      <Combobox
        label="Country of birth"
        error="Enter and select a country"
        name="country"
        options={options}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Country of birth' });
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(
      screen.getByText('Enter and select a country').id,
    );
  });

  it('passes emptyLabel through to the list', () => {
    render(
      <Combobox aria-label="Country" options={options} emptyLabel="No match" />,
    );
    fireEvent.input(screen.getByRole('combobox'), { target: { value: 'zz' } });
    expect(screen.getByRole('option', { name: 'No match' })).toBeDefined();
  });

  it('forwards the ref to the select', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Combobox ref={ref} aria-label="Country" options={options} />);
    expect(ref.current?.tagName).toBe('SELECT');
  });

  it('mounts once under StrictMode double effects', () => {
    render(
      <StrictMode>
        <Combobox aria-label="Country" options={options} />
      </StrictMode>,
    );
    expect(screen.getAllByRole('combobox')).toHaveLength(1);
  });
});

it('has no axe violations, closed and open', async () => {
  const { container } = render(
    <Combobox
      label="Country of birth"
      description="Start typing to filter the list"
      name="country"
      defaultValue=""
      options={options}
    />,
  );
  await expectNoAxeViolations(container);
  fireEvent.click(screen.getByRole('combobox'));
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
  await expectNoAxeViolations(container);
});
