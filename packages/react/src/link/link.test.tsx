import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ComponentPropsWithoutRef } from 'react';
import { Link } from './link';

function RouterLink(props: ComponentPropsWithoutRef<'a'>) {
  return <a data-router="true" {...props} />;
}

describe('Link', () => {
  it('maps modifiers', () => {
    render(
      <Link href="/x" noUnderline>
        Quiet
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Quiet' });
    expect(link.className).toBe('govbb-link govbb-link--no-underline');
    expect(link.hasAttribute('data-router')).toBe(false);
  });

  it('renders with a custom link component', () => {
    render(
      <Link linkComponent={RouterLink} href="/x" noVisited>
        Routed
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Routed' });
    expect(link.getAttribute('data-router')).toBe('true');
    expect(link.className).toBe('govbb-link govbb-link--no-visited');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Link href="/passports">Renew your passport</Link>,
  );
  await expectNoAxeViolations(container);
});
