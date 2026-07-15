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

  it('omits the nav landmark and toggle when no nav is given', () => {
    render(<Header logoSrc="/logo.svg" />);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders the Menu toggle collapsed and wired to the nav', () => {
    render(
      <Header logoSrc="/logo.svg" nav={<a href="/services">Services</a>} />,
    );
    const toggle = screen.getByRole('button', { name: 'Menu' });
    // the mount effect has run, so the toggle is revealed (JS enhancement)
    expect(toggle.hasAttribute('hidden')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    const nav = screen.getByRole('navigation', { name: 'Menu' });
    expect(toggle.getAttribute('aria-controls')).toBe(nav.id);
  });

  it('flips aria-expanded on each toggle click', () => {
    render(
      <Header logoSrc="/logo.svg" nav={<a href="/services">Services</a>} />,
    );
    const toggle = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Header logoSrc="/logo.svg" nav={<a href="/services">Services</a>} />,
  );
  await expectNoAxeViolations(container);
});
