import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BackButton } from './back-button';

describe('BackButton', () => {
  it('renders a link composed with the link classes', () => {
    render(<BackButton href="/previous" />);
    const link = screen.getByRole('link', { name: 'Back' });
    expect(link.className).toBe('govbb-link govbb-back-button');
    expect(link.getAttribute('href')).toBe('/previous');
  });

  it('accepts a custom label', () => {
    render(<BackButton href="/step-2">Back to your answers</BackButton>);
    expect(
      screen.getByRole('link', { name: 'Back to your answers' }),
    ).toBeDefined();
  });

  it('renders with a custom link component', () => {
    render(
      <BackButton
        href="/previous/"
        linkComponent={(props) => <a data-router {...props} />}
      />,
    );
    expect(
      screen.getByRole('link', { name: 'Back' }).getAttribute('data-router'),
    ).not.toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(<BackButton href="/previous" />);
    await expectNoAxeViolations(container);
  });
});
