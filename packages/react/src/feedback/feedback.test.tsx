import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link } from '../link/link';
import { Feedback } from './feedback';

describe('Feedback', () => {
  it('renders an aside with the block class and the default heading', () => {
    const { container } = render(
      <Feedback>
        <p>Give us your feedback about this page.</p>
      </Feedback>,
    );
    const aside = container.firstElementChild!;
    expect(aside.tagName).toBe('ASIDE');
    expect(aside.className).toBe('govbb-feedback');
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading.className).toBe('govbb-feedback__heading');
    expect(heading.textContent).toBe('Was this helpful?');
  });

  it('accepts a custom heading and extra classes', () => {
    const { container } = render(
      <Feedback heading="Rate this service" className="extra" />,
    );
    expect(container.firstElementChild!.className).toBe('govbb-feedback extra');
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe(
      'Rate this service',
    );
  });

  it('renders children as-is after the heading', () => {
    const { container } = render(
      <Feedback>
        <p>Give us your feedback about this page.</p>
        <Link href="/feedback">Help us improve alpha.gov.bb</Link>
      </Feedback>,
    );
    // The consumer owns the markup; no wrapper is injected around it.
    expect(container.querySelector('.govbb-feedback > p')).not.toBeNull();
    const link = screen.getByRole('link', {
      name: 'Help us improve alpha.gov.bb',
    });
    expect(link.className).toBe('govbb-link');
    expect(link.getAttribute('href')).toBe('/feedback');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Feedback>
      <p>Give us your feedback about this page.</p>
      <Link href="/feedback">Help us improve alpha.gov.bb</Link>
    </Feedback>,
  );
  await expectNoAxeViolations(container);
});
