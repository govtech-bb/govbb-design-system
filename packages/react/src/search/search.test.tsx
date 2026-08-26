import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Search } from './search';

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
});

it('has no axe violations', async () => {
  const { container } = render(<Search />);
  await expectNoAxeViolations(container);
});
