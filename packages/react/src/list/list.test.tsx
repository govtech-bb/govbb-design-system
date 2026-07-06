import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { List } from './list';

describe('List', () => {
  it('renders ul by default and ol for number', () => {
    const { container, rerender } = render(<List />);
    expect(container.firstElementChild!.tagName).toBe('UL');
    rerender(<List variant="number" />);
    const ol = container.firstElementChild!;
    expect(ol.tagName).toBe('OL');
    expect(ol.className).toBe('govbb-list govbb-list--number');
  });
});
