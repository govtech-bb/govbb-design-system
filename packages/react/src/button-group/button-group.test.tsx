import { expectNoAxeViolations } from '../testing/axe';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../button/button';
import { ButtonGroup } from './button-group';

describe('ButtonGroup', () => {
  it('renders the group with its BEM classes', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>Save and continue</Button>
        <Button variant="secondary">Save as draft</Button>
      </ButtonGroup>,
    );
    expect(container.firstElementChild?.className).toBe('govbb-button-group');
  });

  it('applies the vertical modifier', () => {
    const { container } = render(
      <ButtonGroup vertical>
        <Button>Continue</Button>
      </ButtonGroup>,
    );
    expect(container.firstElementChild?.className).toBe(
      'govbb-button-group govbb-button-group--vertical',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ButtonGroup>
        <Button>Save and continue</Button>
        <a href="/cancel">Cancel</a>
      </ButtonGroup>,
    );
    await expectNoAxeViolations(container);
  });
});
