import { expectNoAxeViolations } from '../testing/axe';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Autocomplete, type AutocompleteSuggestion } from './autocomplete';

const STREETS: AutocompleteSuggestion[] = [
  { value: '12 Bay Street', label: '12 Bay Street, Bridgetown' },
  { value: 'Bay Street' },
];

/** A lookup stand-in: suggests streets once there is text, like a fetch would. */
function Address({ onPick }: { onPick?: (s: AutocompleteSuggestion) => void }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  return (
    <Autocomplete
      label="Street"
      description="Start typing and pick a suggestion"
      name="street"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        setSuggestions(e.target.value ? STREETS : []);
      }}
      suggestions={suggestions}
      onSuggestionSelect={onPick}
    />
  );
}

describe('Autocomplete', () => {
  it('self-composes a labelled free-text combobox over a datalist', () => {
    const { container } = render(<Address />);
    const input = screen.getByRole('combobox', {
      name: 'Street',
    }) as HTMLInputElement;
    expect(input.id).toBe('street');
    expect(input.name).toBe('street');
    expect(input.getAttribute('aria-describedby')).toBe(
      screen.getByText('Start typing and pick a suggestion').id,
    );
    expect(container.querySelector('datalist')).not.toBeNull();
    expect(input.hasAttribute('list')).toBe(false); // the module's list replaces it
  });

  it('shows the suggestions passed for the typed text and reports the pick', () => {
    const onPick = vi.fn();
    render(<Address onPick={onPick} />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    act(() => input.focus());
    fireEvent.input(input, { target: { value: 'ba' } });
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      '12 Bay Street, Bridgetown',
      'Bay Street',
    ]);
    fireEvent.click(
      screen.getByRole('option', { name: '12 Bay Street, Bridgetown' }),
    );
    expect(input.value).toBe('12 Bay Street');
    expect(onPick).toHaveBeenCalledWith(STREETS[0], 0);
    expect(screen.queryByRole('option')).toBeNull();
  });

  it('keeps free text that matches no suggestion', () => {
    render(<Address />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    act(() => input.focus());
    fireEvent.input(input, { target: { value: 'Nowhere Lane' } });
    fireEvent.blur(input);
    expect(input.value).toBe('Nowhere Lane');
  });

  it('closes the list when the suggestions empty out', () => {
    render(<Address />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    act(() => input.focus());
    fireEvent.input(input, { target: { value: 'ba' } });
    expect(screen.getAllByRole('option')).toHaveLength(2);
    fireEvent.input(input, { target: { value: '' } });
    expect(screen.queryByRole('option')).toBeNull();
  });

  it('forwards the ref to the input and marks errors', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Autocomplete
        ref={ref}
        label="Street"
        error="Enter a street"
        name="street"
      />,
    );
    expect(ref.current?.tagName).toBe('INPUT');
    expect(ref.current?.getAttribute('aria-invalid')).toBe('true');
  });
});

it('has no axe violations, closed and open', async () => {
  const { container } = render(<Address />);
  await expectNoAxeViolations(container);
  const input = screen.getByRole('combobox');
  act(() => input.focus());
  fireEvent.input(input, { target: { value: 'ba' } });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  await expectNoAxeViolations(container);
});
