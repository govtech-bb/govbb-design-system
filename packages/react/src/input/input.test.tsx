import { Label } from '../form/form';
import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Input, TextArea } from './input';

describe('Input', () => {
  it('renders a govbb-input and forwards the ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Name" className="extra" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(ref.current).toBe(input);
    expect(input.className).toBe('govbb-input extra');
  });

  it('stays bare (no form-group) without label/description/error', () => {
    const { container } = render(<Input aria-label="Name" />);
    expect(container.querySelector('.govbb-form-group')).toBeNull();
  });

  it('self-composes label and description when given them', () => {
    const { container } = render(
      <Input label="Average weekly pay" description="Include overtime" />,
    );
    const input = screen.getByRole('textbox', { name: 'Average weekly pay' });
    const description = screen.getByText('Include overtime');
    expect(container.querySelector('.govbb-form-group')).not.toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe(description.id);
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

  it('wraps the field with aria-hidden prefix/suffix cells when given them', () => {
    const { container } = render(
      <Input label="Cost, in dollars" prefix="$" suffix="per day" />,
    );
    const wrapper = container.querySelector('.govbb-input-wrapper')!;
    const prefix = wrapper.querySelector('.govbb-input__prefix')!;
    const suffix = wrapper.querySelector('.govbb-input__suffix')!;
    expect(prefix.textContent).toBe('$');
    expect(prefix.getAttribute('aria-hidden')).toBe('true');
    expect(suffix.textContent).toBe('per day');
    expect(suffix.getAttribute('aria-hidden')).toBe('true');
    expect(wrapper.contains(screen.getByRole('textbox'))).toBe(true);
  });

  it('renders no wrapper without prefix/suffix', () => {
    const { container } = render(<Input aria-label="Name" />);
    expect(container.querySelector('.govbb-input-wrapper')).toBeNull();
  });

  it('keeps the description when an error is shown and announces both', () => {
    render(
      <Input
        label="Pay"
        description="Include overtime"
        error="Enter your pay"
        aria-invalid={false}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Pay' });
    const description = screen.getByText('Include overtime');
    const error = screen.getByText('Enter your pay');
    expect(input.getAttribute('aria-describedby')).toBe(
      `${description.id} ${error.id}`,
    );
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('TextArea', () => {
  it('renders a govbb-textarea and forwards the ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} aria-label="Message" />);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Message' }));
    expect(ref.current!.className).toBe('govbb-textarea');
  });

  it('keeps its description alongside an error', () => {
    render(
      <TextArea
        label="Details"
        description="Do not include account numbers"
        error="Enter more detail"
      />,
    );
    const textarea = screen.getByRole('textbox', { name: 'Details' });
    const description = screen.getByText('Do not include account numbers');
    const error = screen.getByText('Enter more detail');
    expect(textarea.getAttribute('aria-describedby')).toBe(
      `${description.id} ${error.id}`,
    );
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <>
      <Label htmlFor="in">Email</Label>
      <Input id="in" type="email" />
      <Input label="Cost, in dollars" prefix="$" suffix="per day" />
      <Label htmlFor="ta">Message</Label>
      <TextArea id="ta" rows={5} />
    </>,
  );
  await expectNoAxeViolations(container);
});
