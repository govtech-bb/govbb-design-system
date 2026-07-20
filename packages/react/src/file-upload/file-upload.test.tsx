import { expectNoAxeViolations } from '../testing/axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload } from './file-upload';

describe('FileUpload', () => {
  it('lists files and calls onRemove', () => {
    const onRemove = vi.fn();
    render(
      <FileUpload
        aria-label="Proof of address"
        files={[{ name: 'proof.pdf', onRemove }]}
      />,
    );
    expect(screen.getByText('proof.pdf')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Remove proof.pdf' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('announces removal and parks focus on the input', () => {
    const { container } = render(
      <FileUpload
        aria-label="Proof of address"
        files={[{ name: 'proof.pdf', onRemove: () => {} }]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Remove proof.pdf' }));
    expect(screen.getByRole('status').textContent).toBe('proof.pdf removed');
    expect(document.activeElement).toBe(
      container.querySelector('input[type="file"]'),
    );
  });

  it('hides the decorative picker button from the accessible name', () => {
    render(<FileUpload aria-label="Upload" maxSize="Maximum size: 25MB" />);
    const fake = document.querySelector('.govbb-button--tertiary')!;
    expect(fake.getAttribute('aria-hidden')).toBe('true');
  });

  it('forwards the ref to the file input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileUpload ref={ref} aria-label="Upload" />);
    expect(ref.current?.type).toBe('file');
  });

  it('keeps its native input type fixed', () => {
    // @ts-expect-error FileUpload intentionally does not expose the native type prop.
    render(<FileUpload aria-label="Upload" type="text" />);
    expect(screen.getByLabelText('Upload').getAttribute('type')).toBe('file');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <FileUpload
      subtitle="Attach a .pdf file"
      maxSize="Maximum size: 25MB"
      files={[{ name: 'proof.pdf', onRemove: () => {} }]}
    />,
  );
  await expectNoAxeViolations(container);
});
