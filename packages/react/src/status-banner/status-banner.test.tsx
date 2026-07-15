import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBanner } from './status-banner';

describe('StatusBanner', () => {
  it('requires a variant and applies rounded', () => {
    const { container } = render(
      <StatusBanner variant="migrated" rounded>
        <p>This page has moved.</p>
      </StatusBanner>,
    );
    expect(container.firstElementChild!.className).toBe(
      'govbb-status-banner govbb-status-banner--migrated govbb-status-banner--rounded',
    );
    expect(screen.getByText('This page has moved.').tagName).toBe('P');
  });

  it('renders content as-is, allowing multiple paragraphs', () => {
    const { container } = render(
      <StatusBanner variant="migrated">
        <p>First.</p>
        <p>Second.</p>
      </StatusBanner>,
    );
    // The consumer owns the markup; no <p> is injected around it.
    expect(container.querySelectorAll('.govbb-status-banner > p')).toHaveLength(
      2,
    );
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <StatusBanner variant="beta">
      <p>
        This page is in <a href="/beta">Beta</a>.
      </p>
    </StatusBanner>,
  );
  await expectNoAxeViolations(container);
});
