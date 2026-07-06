import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer, FooterLink } from './footer';

describe('Footer', () => {
  it('renders nav links, coat and copy', () => {
    render(
      <Footer coatSrc="/coat.svg" copy="© 2026 Government of Barbados">
        <FooterLink href="/cookies">Cookie policy</FooterLink>
      </Footer>,
    );
    expect(
      screen.getByRole('navigation', { name: 'Footer navigation' }),
    ).toBeDefined();
    expect(screen.getByRole('link', { name: 'Cookie policy' }).className).toBe(
      'govbb-footer__link',
    );
    expect(screen.getByText('© 2026 Government of Barbados').className).toBe(
      'govbb-footer__copy',
    );
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Footer coatSrc="/coat.svg" copy="© 2026 Government of Barbados">
      <FooterLink href="/cookies">Cookie policy</FooterLink>
    </Footer>,
  );
  await expectNoAxeViolations(container);
});
