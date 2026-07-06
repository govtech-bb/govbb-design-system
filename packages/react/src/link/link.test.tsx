import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link } from './link';

describe('Link', () => {
  it('maps modifiers', () => {
    render(
      <Link href="/x" noUnderline>
        Quiet
      </Link>,
    );
    expect(screen.getByRole('link', { name: 'Quiet' }).className).toBe(
      'govbb-link govbb-link--no-underline',
    );
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Link href="/passports">Renew your passport</Link>,
  );
  await expectNoAxeViolations(container);
});
