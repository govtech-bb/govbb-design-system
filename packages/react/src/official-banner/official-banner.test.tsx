import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OfficialBanner } from './official-banner';

describe('OfficialBanner', () => {
  it('renders the configured image and hides the link when requested', () => {
    const { container, rerender } = render(
      <OfficialBanner
        imageSrc="/images/coat-of-arms.png"
        imageAlt=""
        showLearnMore={false}
      />,
    );
    expect(container.querySelector('img')!.getAttribute('src')).toBe(
      '/images/coat-of-arms.png',
    );
    expect(container.querySelector('img')!.getAttribute('alt')).toBe('');
    expect(screen.queryByRole('link')).toBeNull();
    rerender(<OfficialBanner imageSrc="/crest.svg" learnMoreHref="/about" />);
    expect(
      screen
        .getByRole('link', {
          name: 'Learn how to identify an official government website',
        })
        .getAttribute('href'),
    ).toBe('/about');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <OfficialBanner imageSrc="/crest.svg" learnMoreHref="/about" />,
  );
  await expectNoAxeViolations(container);
});
