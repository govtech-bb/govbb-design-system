import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SummaryList } from './summary-list';

const rows = [
  { key: 'Name', value: 'Alex Nurse' },
  { key: 'Date of birth', value: '14 March 1990' },
];

describe('SummaryList', () => {
  it('renders one row per pair with the BEM classes', () => {
    const { container } = render(<SummaryList rows={rows} />);
    expect(container.querySelector('dl')?.className).toBe('govbb-summary-list');
    expect(container.querySelectorAll('.govbb-summary-list__row')).toHaveLength(
      2,
    );
    expect(screen.getByText('Name').className).toBe('govbb-summary-list__key');
    expect(screen.getByText('Alex Nurse').className).toBe(
      'govbb-summary-list__value',
    );
  });

  it('renders row actions with visually hidden context', () => {
    const { container } = render(
      <SummaryList
        rows={[
          {
            key: 'Name',
            value: 'Alex Nurse',
            actions: {
              href: '/name/',
              label: 'Change',
              visuallyHiddenText: 'name',
            },
          },
          { key: 'Date of birth', value: '14 March 1990' },
        ]}
      />,
    );
    const link = screen.getByRole('link', { name: 'Change name' });
    expect(link.getAttribute('href')).toBe('/name/');
    expect(link.parentElement?.className).toBe('govbb-summary-list__actions');
    expect(
      container.querySelectorAll('.govbb-summary-list__actions'),
    ).toHaveLength(1);
  });

  it('renders multiple actions and a custom link component', () => {
    render(
      <SummaryList
        linkComponent={(props) => <a data-router {...props} />}
        rows={[
          {
            key: 'File',
            value: 'passport.pdf',
            actions: [
              { href: '/view/', label: 'View' },
              { href: '/remove/', label: 'Remove' },
            ],
          },
        ]}
      />,
    );
    const view = screen.getByRole('link', { name: 'View' });
    expect(view.getAttribute('data-router')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Remove' })).toBeDefined();
  });

  it('wraps itself in a headed section when given one', () => {
    const { container } = render(
      <SummaryList
        rows={rows}
        section={{
          title: 'Tell us about yourself',
          action: {
            href: '/form/about-you/',
            label: 'Change',
            visuallyHiddenText: 'tell us about yourself',
          },
        }}
      />,
    );
    expect(container.firstElementChild?.className).toBe(
      'govbb-summary-section',
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Tell us about yourself',
      }).className,
    ).toBe('govbb-summary-section__title');
    const link = screen.getByRole('link', {
      name: 'Change tell us about yourself',
    });
    expect(link.getAttribute('href')).toBe('/form/about-you/');
    expect(container.querySelector('dl')?.className).toBe('govbb-summary-list');
  });

  it('supports a section heading level and forwards the ref to the dl', () => {
    const ref = { current: null as HTMLDListElement | null };
    render(
      <SummaryList
        ref={(el) => {
          ref.current = el;
        }}
        rows={rows}
        section={{ title: 'Contact details', headingLevel: 'h3' }}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 3, name: 'Contact details' }),
    ).toBeDefined();
    expect(ref.current?.tagName).toBe('DL');
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <SummaryList
        rows={[
          {
            ...rows[0],
            actions: {
              href: '/name/',
              label: 'Change',
              visuallyHiddenText: 'name',
            },
          },
          rows[1],
        ]}
        section={{
          title: 'Tell us about yourself',
          action: { href: '/about-you/', label: 'Change' },
        }}
      />,
    );
    await expectNoAxeViolations(container);
  });

  it('renders actions with renderLink when given one', () => {
    render(
      <SummaryList
        renderLink={({ href, className, children }) => (
          <a className={className} data-router="true" href={href}>
            {children}
          </a>
        )}
        rows={[
          {
            key: 'Name',
            value: 'Alex Nurse',
            actions: { href: '/name', label: 'Change' },
          },
        ]}
        section={{
          title: 'About you',
          action: { href: '/about', label: 'Change' },
        }}
      />,
    );

    const links = screen.getAllByRole('link', { name: /Change/ });
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link.dataset.router).toBe('true');
      expect(link.className).toBe('govbb-link');
    }
  });
});
