import { expectNoAxeViolations } from '../testing/axe';
import { fireEvent, render, screen } from '@testing-library/react';
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
    const home = screen.getByRole('img', { name: 'gov.bb' }).closest('a')!;
    expect(home.getAttribute('data-router')).toBe('true');
    expect(home.getAttribute('href')).toBe('/home');
  });

  it('renders custom content in the header top row', () => {
    const { container } = render(
      <Header logoSrc="/logo.svg">
        <a href="/account">Account</a>
      </Header>,
    );

    expect(screen.getByRole('link', { name: 'Account' })).toBeDefined();
    expect(
      container
        .querySelector('.govbb-header__controls')
        ?.contains(screen.getByRole('link', { name: 'Account' })),
    ).toBe(true);
  });

  it('renders custom nav content in a labelled landmark', () => {
    render(
      <Header
        logoSrc="/logo.svg"
        nav={<a href="/services">Services</a>}
        navAriaLabel="Primary navigation"
      />,
    );
    const nav = screen.getByRole('navigation', {
      name: 'Primary navigation',
    });
    expect(nav.classList.contains('govbb-header__nav')).toBe(true);
    expect(nav.parentElement?.classList.contains('govbb-header__inner')).toBe(
      true,
    );
    const link = screen.getByRole('link', { name: 'Services' });
    expect(link.getAttribute('href')).toBe('/services');
  });

  it('supports custom collapsed and expanded menu labels', () => {
    render(
      <Header
        logoSrc="/logo.svg"
        nav={<a href="/services">Services</a>}
        menuLabel="Navigation"
        closeMenuLabel="Close navigation"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Navigation' }));
    expect(
      screen.getByRole('button', { name: 'Close navigation' }),
    ).toBeDefined();
  });

  it('omits the nav landmark and toggle when no nav is given', () => {
    render(<Header logoSrc="/logo.svg" />);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders the Menu toggle collapsed and wired to the nav', () => {
    const { container } = render(
      <Header logoSrc="/logo.svg" nav={<a href="/services">Services</a>} />,
    );
    const toggle = screen.getByRole('button', { name: 'Menu' });
    // The mount effect has run, so the toggle is revealed. CSS uses the
    // enhanced and expanded data attributes to collapse the nav only on mobile.
    expect(toggle.classList.contains('govbb-button')).toBe(true);
    expect(toggle.classList.contains('govbb-button--text')).toBe(true);
    expect(toggle.hasAttribute('hidden')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    const nav = container.querySelector('.govbb-header__nav')!;
    expect(
      container
        .querySelector('.govbb-header')
        ?.hasAttribute('data-govbb-header-enhanced'),
    ).toBe(true);
    expect(nav.hasAttribute('hidden')).toBe(false);
    expect(nav.getAttribute('data-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-controls')).toBe(nav.id);
  });

  it('shows and hides the nav on each toggle click', () => {
    const { container } = render(
      <Header logoSrc="/logo.svg" nav={<a href="/services">Services</a>} />,
    );
    const toggle = screen.getByRole('button', { name: 'Menu' });
    const nav = container.querySelector('.govbb-header__nav')!;
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(nav.getAttribute('data-expanded')).toBe('true');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(nav.getAttribute('data-expanded')).toBe('false');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Header logoSrc="/logo.svg" nav={<a href="/services">Services</a>} />,
  );
  await expectNoAxeViolations(container);
});
