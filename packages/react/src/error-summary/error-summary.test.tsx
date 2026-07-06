import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { ErrorSummary } from './error-summary';

describe('ErrorSummary', () => {
  it('is an alert whose links target fields, focusable via ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ErrorSummary
        ref={ref}
        errors={[{ href: '#email', label: 'Enter a valid email address' }]}
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('There is a problem');
    const link = screen.getByRole('link', {
      name: 'Enter a valid email address',
    });
    expect(link.getAttribute('href')).toBe('#email');
    ref.current!.focus();
    expect(document.activeElement).toBe(alert);
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <ErrorSummary errors={[{ href: '#email', label: 'Enter your email' }]} />,
  );
  await expectNoAxeViolations(container);
});
