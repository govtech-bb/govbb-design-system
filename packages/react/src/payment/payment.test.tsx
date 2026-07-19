import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Payment } from './payment';

const rows = [
  { key: 'Service:', value: 'Application fee' },
  { key: 'Amount:', value: '$20' },
];

describe('Payment', () => {
  it('renders the heading, rows, actions and note with the BEM classes', () => {
    const { container } = render(
      <Payment
        title="Complete your payment"
        description="Check the details below"
        rows={rows}
        note="You will be redirected to EZ Pay."
      >
        <button type="button">Continue to payment</button>
      </Payment>,
    );
    expect(container.firstElementChild?.className).toBe('govbb-payment');
    expect(
      screen.getByRole('heading', { name: 'Complete your payment' }).className,
    ).toBe('govbb-payment__title');
    expect(container.querySelectorAll('.govbb-payment__row')).toHaveLength(2);
    expect(screen.getByText('Service:').className).toBe('govbb-payment__key');
    expect(
      screen.getByText('You will be redirected to EZ Pay.').className,
    ).toBe('govbb-payment__note');
  });

  it('applies the outcome modifier', () => {
    const { container } = render(
      <Payment outcome="success" title="Your payment was successful" />,
    );
    expect(container.firstElementChild?.className).toBe(
      'govbb-payment govbb-payment--success',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Payment title="Complete your payment" rows={rows} note="Note.">
        <button type="button">Continue to payment</button>
      </Payment>,
    );
    await expectNoAxeViolations(container);
  });
});
