import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ComponentPropsWithoutRef } from 'react';
import { Footer, FooterLink } from './footer';

function RouterLink(props: ComponentPropsWithoutRef<'a'>) {
  return <a data-router="true" {...props} />;
}

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
      'govbb-link govbb-footer__link',
    );
    expect(screen.getByText('© 2026 Government of Barbados').className).toBe(
      'govbb-footer__copy',
    );
  });

  it('renders a footer link with a custom link component', () => {
    render(
      <Footer>
        <FooterLink linkComponent={RouterLink} href="/cookies">
          Cookie policy
        </FooterLink>
      </Footer>,
    );
    const link = screen.getByRole('link', { name: 'Cookie policy' });
    expect(link.getAttribute('data-router')).toBe('true');
    expect(link.className).toBe('govbb-link govbb-footer__link');
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
