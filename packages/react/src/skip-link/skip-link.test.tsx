import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkipLink } from './skip-link';

describe('SkipLink', () => {
  it('renders a link with the default label and the BEM class', () => {
    render(<SkipLink href="#main-content" />);
    const link = screen.getByRole('link', { name: 'Skip to main content' });
    expect(link.className).toBe('govbb-skip-link');
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('accepts a custom label', () => {
    render(<SkipLink href="#main">Skip to content</SkipLink>);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toBeDefined();
  });

  it('has no axe violations', async () => {
    const { container } = render(<SkipLink href="#main-content" />);
    await expectNoAxeViolations(container);
  });
});
