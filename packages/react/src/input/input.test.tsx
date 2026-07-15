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

  it('self-composes label, hint and error when given them', () => {
    const { container } = render(
      <Input
        label="Average weekly pay"
        hint="Include overtime"
        error="Enter your pay"
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Average weekly pay' });
    const hint = screen.getByText('Include overtime');
    const error = screen.getByText('Enter your pay');
    expect(container.querySelector('.govbb-form-group')).not.toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe(
      `${hint.id} ${error.id}`,
    );
    expect(input.getAttribute('aria-invalid')).toBe('true');
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
