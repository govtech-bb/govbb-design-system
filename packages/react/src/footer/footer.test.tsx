import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ComponentPropsWithoutRef } from 'react';
import { Footer, FooterLink } from './footer';

function RouterLink(props: ComponentPropsWithoutRef<'a'>) {
  return <a data-router="true" {...props} />;
}

describe('Footer', () => {
  it('renders typed links in a semantic navigation list', () => {
    render(
      <Footer
        coatSrc="/coat.svg"
        copy="© 2026 Government of Barbados"
        links={[
          {
            href: 'https://example.org/cookies',
            label: 'Cookie policy',
            className: 'tracked',
            'aria-current': 'page',
            external: true,
          },
        ]}
      />,
    );
    expect(
      screen.getByRole('navigation', { name: 'Footer navigation' }),
    ).toBeDefined();
    expect(screen.getByRole('list').className).toBe('govbb-footer__list');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Cookie policy' }).className).toBe(
      'govbb-link govbb-footer__link tracked',
    );
    expect(
      screen
        .getByRole('link', { name: 'Cookie policy' })
        .getAttribute('aria-current'),
    ).toBe('page');
    expect(
      screen
        .getByRole('link', { name: 'Cookie policy' })
        .getAttribute('target'),
    ).toBe('_blank');
    expect(
      screen.getByRole('link', { name: 'Cookie policy' }).getAttribute('rel'),
    ).toBe('noopener noreferrer');
    expect(screen.getByText('© 2026 Government of Barbados').className).toBe(
      'govbb-footer__copy',
    );
  });

  it('renders typed links with a custom link component', () => {
    render(
      <Footer
        links={[{ href: '/cookies', label: 'Cookie policy' }]}
        linkComponent={RouterLink}
      />,
    );
    const link = screen.getByRole('link', { name: 'Cookie policy' });
    expect(link.getAttribute('data-router')).toBe('true');
    expect(link.className).toBe('govbb-link govbb-footer__link');
  });

  it('passes fully styled props to a custom link renderer', () => {
    const renderLink = vi.fn(
      ({ href, ...props }: ComponentPropsWithoutRef<'a'>) => (
        <a {...props} data-router="true" href={`/app${href}`} />
      ),
    );
    render(
      <Footer
        links={[{ href: '/privacy', label: 'Privacy' }]}
        navAriaLabel="Site information"
        renderLink={renderLink}
      />,
    );

    const link = screen.getByRole('link', { name: 'Privacy' });
    expect(renderLink).toHaveBeenCalledOnce();
    expect(link.getAttribute('href')).toBe('/app/privacy');
    expect(link.getAttribute('data-router')).toBe('true');
    expect(link.className).toBe('govbb-link govbb-footer__link');
    expect(
      screen.getByRole('navigation', { name: 'Site information' }),
    ).toBeDefined();
  });

  it('keeps FooterLink children as a custom-link escape hatch', () => {
    render(
      <Footer links={[{ href: '/privacy', label: 'Privacy' }]}>
        <FooterLink linkComponent={RouterLink} href="/cookies">
          Cookie policy
        </FooterLink>
      </Footer>,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(
      screen
        .getByRole('link', { name: 'Cookie policy' })
        .getAttribute('data-router'),
    ).toBe('true');
  });

  it('omits the navigation landmark and divider without links', () => {
    const { container } = render(
      <Footer coatSrc="/coat.svg" copy="© 2026 Government of Barbados" />,
    );

    expect(screen.queryByRole('navigation')).toBeNull();
    expect(container.querySelector('.govbb-footer__divider')).toBeNull();
    expect(
      container.querySelector('.govbb-footer__inner')?.children,
    ).toHaveLength(1);
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Footer
      coatSrc="/coat.svg"
      copy="© 2026 Government of Barbados"
      links={[{ href: '/cookies', label: 'Cookie policy' }]}
    />,
  );
  await expectNoAxeViolations(container);
});
