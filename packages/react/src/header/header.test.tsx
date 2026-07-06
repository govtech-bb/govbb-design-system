import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  it('links the logo home', () => {
    render(<Header logoSrc="/logo.svg" />);
    const logo = screen.getByRole('img', { name: 'gov.bb' });
    expect(logo.getAttribute('src')).toBe('/logo.svg');
    expect(logo.closest('a')!.getAttribute('href')).toBe('/');
  });
});

it('has no axe violations', async () => {
  const { container } = render(<Header logoSrc="/logo.svg" />);
  await expectNoAxeViolations(container);
});
