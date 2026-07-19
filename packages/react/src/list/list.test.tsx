import { expectNoAxeViolations } from '../testing/axe';
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

it('keeps list semantics on the plain variant', async () => {
  const { container, rerender } = render(
    <List>
      <li>Apply for a passport</li>
    </List>,
  );
  expect(container.firstElementChild!.getAttribute('role')).toBe('list');
  rerender(
    <List variant="bullet">
      <li>Apply for a passport</li>
    </List>,
  );
  expect(container.firstElementChild!.hasAttribute('role')).toBe(false);
  await expectNoAxeViolations(container);
});

it('has no axe violations', async () => {
  const { container } = render(
    <List variant="bullet">
      <li>Proof of address</li>
      <li>National ID card</li>
    </List>,
  );
  await expectNoAxeViolations(container);
});
