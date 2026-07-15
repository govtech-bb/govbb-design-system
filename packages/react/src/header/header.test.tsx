import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ComponentPropsWithoutRef } from 'react';
import { Header } from './header';

function RouterLink(props: ComponentPropsWithoutRef<'a'>) {
  return <a data-router="true" {...props} />;
}

describe('Header', () => {
  it('links the logo home', () => {
    render(<Header logoSrc="/logo.svg" />);
    const logo = screen.getByRole('img', { name: 'gov.bb' });
    expect(logo.getAttribute('src')).toBe('/logo.svg');
    const anchor = logo.closest('a')!;
    expect(anchor.getAttribute('href')).toBe('/');
    expect(anchor.hasAttribute('data-router')).toBe(false);
  });

  it('renders the home link with a custom link component', () => {
    render(
      <Header
        logoSrc="/logo.svg"
        homeHref="/home"
        linkComponent={RouterLink}
      />,
    );
    const anchor = screen.getByRole('img', { name: 'gov.bb' }).closest('a')!;
    expect(anchor.getAttribute('data-router')).toBe('true');
    expect(anchor.getAttribute('href')).toBe('/home');
  });

  it('renders nav links in a labelled nav landmark', () => {
    render(
      <Header logoSrc="/logo.svg" nav={<a href="/services">Services</a>} />,
    );
    const nav = screen.getByRole('navigation', { name: 'Menu' });
    expect(nav.classList.contains('govbb-header__nav')).toBe(true);
    expect(
      screen.getByRole('link', { name: 'Services' }).getAttribute('href'),
    ).toBe('/services');
  });

  it('omits the nav landmark when no nav is given', () => {
    render(<Header logoSrc="/logo.svg" />);
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Header logoSrc="/logo.svg" nav={<a href="/services">Services</a>} />,
  );
  await expectNoAxeViolations(container);
});
