import { expectNoAxeViolations } from '../testing/axe';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Freshness } from './freshness';

describe('Freshness', () => {
  it('renders a paragraph with the block class and its children', () => {
    const { container } = render(
      <Freshness>
        Last updated on <time dateTime="2026-03-12">12 March 2026</time>
      </Freshness>,
    );
    const p = container.firstElementChild!;
    expect(p.tagName).toBe('P');
    expect(p.className).toBe('govbb-freshness');
    expect(p.textContent).toBe('Last updated on 12 March 2026');
    expect(p.querySelector('time')!.getAttribute('datetime')).toBe(
      '2026-03-12',
    );
  });

  it('merges extra classes', () => {
    const { container } = render(
      <Freshness className="extra">Last updated on 12 March 2026</Freshness>,
    );
    expect(container.firstElementChild!.className).toBe(
      'govbb-freshness extra',
    );
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Freshness>
      Last updated on <time dateTime="2026-03-12">12 March 2026</time>
    </Freshness>,
  );
  await expectNoAxeViolations(container);
});
