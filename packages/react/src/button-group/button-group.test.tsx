import { expectNoAxeViolations } from '../testing/axe';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../button/button';
import { ButtonGroup } from './button-group';

describe('ButtonGroup', () => {
  it('maps the vertical modifier', () => {
    const { container, rerender } = render(<ButtonGroup />);
    expect(container.firstElementChild!.className).toBe('govbb-button-group');
    rerender(<ButtonGroup vertical />);
    expect(container.firstElementChild!.className).toBe(
      'govbb-button-group govbb-button-group--vertical',
    );
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <ButtonGroup>
      <Button>Save and continue</Button>
      <Button variant="secondary">Save as draft</Button>
    </ButtonGroup>,
  );
  await expectNoAxeViolations(container);
});
