import { Label } from '../form/form';
import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Input, Textarea } from './input';

describe('Input', () => {
  it('renders a govbb-input and forwards the ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Name" className="extra" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(ref.current).toBe(input);
    expect(input.className).toBe('govbb-input extra');
  });

  it('stays bare (no form-group) without label/hint/error', () => {
    const { container } = render(<Input aria-label="Name" />);
    expect(container.querySelector('.govbb-form-group')).toBeNull();
  });

  it('self-composes label and hint when given them', () => {
    const { container } = render(
      <Input label="Average weekly pay" hint="Include overtime" />,
    );
    const input = screen.getByRole('textbox', { name: 'Average weekly pay' });
    const hint = screen.getByText('Include overtime');
    expect(container.querySelector('.govbb-form-group')).not.toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('derives the id from name, with an explicit id winning', () => {
    render(<Input label="Email" name="email" error="Enter your email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input.id).toBe('email');
    expect(screen.getByText('Enter your email').id).toBe('email-error');

    render(<Input label="Phone" name="phone" id="mobile" />);
    expect(screen.getByRole('textbox', { name: 'Phone' }).id).toBe('mobile');
  });

  it('self-composes label and error when given them', () => {
    render(<Input label="Average weekly pay" error="Enter your pay" />);
    const input = screen.getByRole('textbox', { name: 'Average weekly pay' });
    const error = screen.getByText('Enter your pay');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('shows the error and drops the hint if both are passed', () => {
    render(
      // @ts-expect-error hint/error are mutually exclusive
      <Input label="Pay" hint="Include overtime" error="Enter your pay" />,
    );
    const input = screen.getByRole('textbox', { name: 'Pay' });
    expect(screen.queryByText('Include overtime')).toBeNull();
    const error = screen.getByText('Enter your pay');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
  });
});

describe('Textarea', () => {
  it('renders a govbb-textarea and forwards the ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Message" />);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Message' }));
    expect(ref.current!.className).toBe('govbb-textarea');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <>
      <Label htmlFor="in">Email</Label>
      <Input id="in" type="email" />
      <Label htmlFor="ta">Message</Label>
      <Textarea id="ta" rows={5} />
    </>,
  );
  await expectNoAxeViolations(container);
});
