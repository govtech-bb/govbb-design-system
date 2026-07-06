import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShowHide } from './show-hide';

describe('ShowHide', () => {
  it('renders a details/summary that toggles open', () => {
    const { container } = render(
      <ShowHide summary="Help with this form">
        <p>Check the back of your card.</p>
      </ShowHide>,
    );
    const details = container.querySelector('details')!;
    expect(details.open).toBe(false);
    fireEvent.click(screen.getByText('Help with this form'));
    expect(details.open).toBe(true);
  });
});
