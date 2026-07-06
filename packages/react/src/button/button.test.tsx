import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('maps variants to BEM classes and defaults type to button', () => {
    render(
      <Button variant="text" negative>
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.className).toBe(
      'govbb-button govbb-button--text govbb-button--negative',
    );
    expect(button.getAttribute('type')).toBe('button');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Go</Button>);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Go' }));
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Button variant="secondary">Save and continue</Button>,
  );
  await expectNoAxeViolations(container);
});
