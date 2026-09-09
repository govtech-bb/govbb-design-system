import { expectNoAxeViolations } from '../testing/axe';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { AutocompleteSuggestion } from '../autocomplete/autocomplete';
import { Search } from './search';

const SERVICES = ['Apply for a passport', 'Renew a passport', 'Pay land tax'];

/** A site search stand-in: suggests services once there is text. */
function SiteSearch({
  onPick,
}: {
  onPick?: (s: AutocompleteSuggestion) => void;
}) {
  const [query, setQuery] = useState('');
  const typed = query.trim().toLowerCase();
  return (
    <Search
      onSubmit={(e) => e.preventDefault()}
      inputProps={{ value: query, onChange: (e) => setQuery(e.target.value) }}
      suggestions={SERVICES.filter(
        (name) => typed && name.toLowerCase().includes(typed),
      ).map((name) => ({ value: name }))}
      onSuggestionSelect={onPick}
    />
  );
}

describe('Search', () => {
  it('renders a labelled searchbox and submit button', () => {
    render(<Search onSubmit={(e) => e.preventDefault()} />);
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Search' })).toBeDefined();
  });

  it('falls back to "Search" for empty labels so both controls keep a name', () => {
    render(<Search label="" buttonLabel="" />);
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Search' })).toBeDefined();
  });

  it('applies the borderless variant and reaches the input via inputProps', () => {
    const { container } = render(
      <Search borderless inputProps={{ name: 'query', defaultValue: 'tax' }} />,
    );
    expect(container.firstElementChild!.className).toBe(
      'govbb-search govbb-search--borderless',
    );
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    expect(input.name).toBe('query');
    expect(input.value).toBe('tax');
  });

  it('offers suggestions in an inline list beneath the bar and reports the pick', () => {
    const onPick = vi.fn();
    const { container } = render(<SiteSearch onPick={onPick} />);
    const input = screen.getByRole('combobox', {
      name: 'Search',
    }) as HTMLInputElement;
    expect(input.type).toBe('text');
    expect(input.name).toBe('q');
    expect(input.className).toBe('govbb-search__input');
    expect(input.closest('.govbb-combobox')!.className).toBe(
      'govbb-combobox govbb-combobox--inline',
    );
    expect(container.querySelector('.govbb-search__button')).not.toBeNull();
    act(() => input.focus());
    fireEvent.input(input, { target: { value: 'pass' } });
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Apply for a passport',
      'Renew a passport',
    ]);
    fireEvent.click(screen.getByRole('option', { name: 'Renew a passport' }));
    expect(input.value).toBe('Renew a passport');
    expect(onPick).toHaveBeenCalledWith({ value: 'Renew a passport' }, 1);
    expect(screen.queryByRole('option')).toBeNull();
  });
});

it('has no axe violations', async () => {
  const { container } = render(<Search />);
  await expectNoAxeViolations(container);
});

it('has no axe violations with suggestions, closed and open', async () => {
  const { container } = render(<SiteSearch />);
  await expectNoAxeViolations(container);
  const input = screen.getByRole('combobox');
  act(() => input.focus());
  fireEvent.input(input, { target: { value: 'pass' } });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  await expectNoAxeViolations(container);
});
