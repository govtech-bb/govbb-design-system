import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBanner } from './status-banner';

describe('StatusBanner', () => {
  it('requires a variant and applies rounded', () => {
    const { container } = render(
      <StatusBanner variant="migrated" rounded>
        This page has moved.
      </StatusBanner>,
    );
    expect(container.firstElementChild!.className).toBe(
      'govbb-status-banner govbb-status-banner--migrated govbb-status-banner--rounded',
    );
    expect(screen.getByText('This page has moved.').tagName).toBe('P');
  });
});
