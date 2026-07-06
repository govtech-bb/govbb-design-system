import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OfficialBanner } from './official-banner';

describe('OfficialBanner', () => {
  it('renders the crest and an optional link', () => {
    const { container, rerender } = render(
      <OfficialBanner crestSrc="/crest.svg" />,
    );
    expect(container.querySelector('img')!.getAttribute('src')).toBe(
      '/crest.svg',
    );
    expect(screen.queryByRole('link')).toBeNull();
    rerender(<OfficialBanner crestSrc="/crest.svg" linkHref="/about" />);
    expect(
      screen.getByRole('link', { name: 'Learn more' }).getAttribute('href'),
    ).toBe('/about');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <OfficialBanner crestSrc="/crest.svg" linkHref="/about" />,
  );
  await expectNoAxeViolations(container);
});
