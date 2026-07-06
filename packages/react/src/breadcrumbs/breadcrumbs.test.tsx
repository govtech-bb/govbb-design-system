import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './breadcrumbs';

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
    expect(
      screen.getByRole('link', { name: 'Home' }).getAttribute('href'),
    ).toBe('/');
  });
});
