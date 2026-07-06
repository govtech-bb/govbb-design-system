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
});

describe('Textarea', () => {
  it('renders a govbb-textarea and forwards the ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Message" />);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Message' }));
    expect(ref.current!.className).toBe('govbb-textarea');
  });
});
