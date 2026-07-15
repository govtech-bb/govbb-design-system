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

  it('does not wrap content when not full width', () => {
    const { container } = render(
      <StatusBanner variant="alpha">
        <p>Inline notice.</p>
      </StatusBanner>,
    );
    expect(container.querySelector('.govbb-status-banner__inner')).toBeNull();
    expect(container.querySelector('.govbb-status-banner > p')).not.toBeNull();
  });

  it('fullWidth adds the modifier and a width-container inner', () => {
    const { container } = render(
      <StatusBanner variant="alpha" fullWidth>
        <p>This page is in Alpha.</p>
      </StatusBanner>,
    );
    expect(container.firstElementChild!.className).toBe(
      'govbb-status-banner govbb-status-banner--alpha govbb-status-banner--full-width',
    );
    // Content sits inside the page width container so it lines up with the
    // header/footer content column.
    expect(
      container.querySelector(
        '.govbb-status-banner--full-width > .govbb-width-container.govbb-status-banner__inner > p',
      ),
    ).not.toBeNull();
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
    <>
      <StatusBanner variant="beta">
        <p>
          This page is in <a href="/beta">Beta</a>.
        </p>
      </StatusBanner>
      <StatusBanner variant="alpha" fullWidth>
        <p>
          This page is in <a href="/alpha">Alpha</a>.
        </p>
      </StatusBanner>
    </>,
  );
  await expectNoAxeViolations(container);
});
