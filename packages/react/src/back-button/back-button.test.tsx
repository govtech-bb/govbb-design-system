import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BackButton } from './back-button';

describe('BackButton', () => {
  it('renders a link with the back-button classes and a default label', () => {
    render(<BackButton href="/previous" />);
    const link = screen.getByRole('link', { name: 'Back' });
    expect(link.className).toBe('govbb-link govbb-back-button');
    expect(link.getAttribute('href')).toBe('/previous');
  });

  it('accepts a custom label', () => {
    render(<BackButton href="/apps">Back to applications</BackButton>);
    expect(
      screen.getByRole('link', { name: 'Back to applications' }),
    ).toBeDefined();
  });
});

it('has no axe violations', async () => {
  const { container } = render(<BackButton href="/previous" />);
  await expectNoAxeViolations(container);
});
