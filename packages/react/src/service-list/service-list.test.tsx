import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ServiceList, ServiceListItem } from './service-list';

describe('ServiceList', () => {
  it('renders a plain list with the block class', () => {
    const { container } = render(
      <ServiceList>
        <ServiceListItem href="/family">
          Family, birth and relationships
        </ServiceListItem>
      </ServiceList>,
    );
    const list = container.firstElementChild!;
    expect(list.tagName).toBe('UL');
    expect(list.className).toBe('govbb-service-list');
    expect(container.querySelector('.govbb-service-list__item')!.tagName).toBe(
      'LI',
    );
  });

  it('wraps the link in an h3 heading by default', () => {
    render(
      <ServiceList>
        <ServiceListItem href="/family">
          Family, birth and relationships
        </ServiceListItem>
      </ServiceList>,
    );
    const heading = screen.getByRole('heading', {
      level: 3,
      name: 'Family, birth and relationships',
    });
    expect(heading.className).toBe('govbb-service-list__heading');
    expect(heading.firstElementChild!.tagName).toBe('A');
  });

  it('accepts a heading level for document structure', () => {
    render(
      <ServiceList>
        <ServiceListItem href="/family" headingLevel="h2">
          Family, birth and relationships
        </ServiceListItem>
      </ServiceList>,
    );
    expect(screen.getByRole('heading', { level: 2 }).className).toBe(
      'govbb-service-list__heading',
    );
  });

  it('puts anchor attributes and className on the link', () => {
    render(
      <ServiceList>
        <ServiceListItem
          href="/family"
          className="extra"
          data-umami-event="service-family"
        >
          Family, birth and relationships
        </ServiceListItem>
      </ServiceList>,
    );
    const link = screen.getByRole('link', {
      name: 'Family, birth and relationships',
    });
    expect(link.className).toBe('govbb-link govbb-service-list__link extra');
    expect(link.getAttribute('href')).toBe('/family');
    expect(link.getAttribute('data-umami-event')).toBe('service-family');
  });

  it('is a single link per item: the description stays plain text', () => {
    const { container } = render(
      <ServiceList>
        <ServiceListItem
          href="/family"
          description="Managing key life events and family responsibilities"
          tag="Information service"
        >
          Family, birth and relationships
        </ServiceListItem>
      </ServiceList>,
    );
    const item = container.querySelector('.govbb-service-list__item')!;
    // Exactly one anchor — the heading link. The stretched ::after makes the
    // whole card clickable without adding a second accessible link.
    expect(item.querySelectorAll('a')).toHaveLength(1);
    const link = screen.getByRole('link');
    expect(link.textContent).toBe('Family, birth and relationships');
    // Description and tag sit outside the anchor, as plain paragraphs.
    const description = screen.getByText(
      'Managing key life events and family responsibilities',
    );
    expect(description.tagName).toBe('P');
    expect(description.className).toBe('govbb-service-list__description');
    expect(description.closest('a')).toBeNull();
    const tag = screen.getByText('Information service');
    expect(tag.className).toBe('govbb-service-list__tag');
    expect(tag.closest('a')).toBeNull();
  });

  it('renders link-only entries without description or tag paragraphs', () => {
    const { container } = render(
      <ServiceList>
        <ServiceListItem href="/travel">Travel and transport</ServiceListItem>
      </ServiceList>,
    );
    expect(container.querySelector('p')).toBeNull();
  });

  it('adds the signpost modifier for in-category service links', () => {
    const { container } = render(
      <ServiceList variant="signpost">
        <ServiceListItem href="/register-birth">
          Register a birth
        </ServiceListItem>
      </ServiceList>,
    );
    expect(container.firstElementChild!.className).toBe(
      'govbb-service-list govbb-service-list--signpost',
    );
    // Same markup as the card look — one link inside a heading per item.
    expect(
      screen.getByRole('heading', { level: 3, name: 'Register a birth' }),
    ).toBeTruthy();
  });

  it('renders items with a custom link component', () => {
    const Fancy = ({
      href,
      ...props
    }: {
      href: string;
      className?: string;
      children?: React.ReactNode;
    }) => <a href={href} data-fancy {...props} />;
    render(
      <ServiceList>
        <ServiceListItem href="/travel" linkComponent={Fancy}>
          Travel and transport
        </ServiceListItem>
      </ServiceList>,
    );
    expect(
      screen
        .getByRole('link', { name: 'Travel and transport' })
        .hasAttribute('data-fancy'),
    ).toBe(true);
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <main>
      <h1>Services</h1>
      <ServiceList>
        <ServiceListItem
          href="/family"
          headingLevel="h2"
          description="Managing key life events and family responsibilities"
          tag="Information service"
        >
          Family, birth and relationships
        </ServiceListItem>
        <ServiceListItem href="/travel" headingLevel="h2">
          Travel and transport
        </ServiceListItem>
      </ServiceList>
      <ServiceList variant="signpost">
        <ServiceListItem
          href="/register-birth"
          headingLevel="h2"
          description="What you need to register a birth in Barbados"
        >
          Register a birth
        </ServiceListItem>
      </ServiceList>
    </main>,
  );
  await expectNoAxeViolations(container);
});
