import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Select } from './select';

describe('Select', () => {
  it('renders a govbb-select and forwards the ref', () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Select ref={ref} aria-label="Parish">
        <option value="a">A</option>
      </Select>,
    );
    expect(ref.current).toBe(screen.getByRole('combobox', { name: 'Parish' }));
    expect(ref.current!.className).toBe('govbb-select');
  });
});
