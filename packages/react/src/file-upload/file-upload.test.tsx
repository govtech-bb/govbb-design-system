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

  it('forwards the ref to the file input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileUpload ref={ref} aria-label="Upload" />);
    expect(ref.current?.type).toBe('file');
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
