import { expectNoAxeViolations } from '../testing/axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
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

  it('focuses the targeted field on link click and fires onErrorClick', () => {
    const onErrorClick = vi.fn();
    render(
      <>
        <ErrorSummary
          errors={[{ href: '#email', label: 'Enter a valid email address' }]}
          onErrorClick={onErrorClick}
        />
        <input id="email" aria-label="Email" />
      </>,
    );
    fireEvent.click(
      screen.getByRole('link', { name: 'Enter a valid email address' }),
    );
    expect(onErrorClick).toHaveBeenCalledWith(
      { href: '#email', label: 'Enter a valid email address' },
      expect.anything(),
    );
    expect(document.activeElement).toBe(screen.getByLabelText('Email'));
  });

  it('skips the default focus when the handler prevents default', () => {
    render(
      <>
        <ErrorSummary
          errors={[{ href: '#name', label: 'Enter your name' }]}
          onErrorClick={(_item, event) => event.preventDefault()}
        />
        <input id="name" aria-label="Name" />
      </>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Enter your name' }));
    expect(document.activeElement).not.toBe(screen.getByLabelText('Name'));
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <ErrorSummary errors={[{ href: '#email', label: 'Enter your email' }]} />,
  );
  await expectNoAxeViolations(container);
});
