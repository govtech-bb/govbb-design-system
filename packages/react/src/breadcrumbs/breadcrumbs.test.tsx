import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ComponentPropsWithoutRef } from 'react';
import { Breadcrumbs } from './breadcrumbs';

function RouterLink(props: ComponentPropsWithoutRef<'a'>) {
  return <a data-router="true" {...props} />;
}

describe('Breadcrumbs', () => {
  it('renders a labelled nav with linked crumbs', () => {
    render(
      <Breadcrumbs
        collapseOnMobile
        items={[
          { href: '/', label: 'Home' },
          { href: '/services', label: 'Services' },
        ]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav.className).toContain('govbb-breadcrumbs--collapse-on-mobile');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    const home = screen.getByRole('link', { name: 'Home' });
    expect(home.getAttribute('href')).toBe('/');
    expect(home.hasAttribute('data-router')).toBe(false);
  });

  it('renders each crumb with a custom link component', () => {
    render(
      <Breadcrumbs
        linkComponent={RouterLink}
        items={[
          { href: '/', label: 'Home' },
          { href: '/services', label: 'Services' },
        ]}
      />,
    );
    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('data-router')).toBe('true');
      expect(link.className).toBe('govbb-breadcrumbs__link');
    }
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Breadcrumbs
      items={[
        { href: '/', label: 'Home' },
        { href: '/services', label: 'Services' },
      ]}
    />,
  );
  await expectNoAxeViolations(container);
});
