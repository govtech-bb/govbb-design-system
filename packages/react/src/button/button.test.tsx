import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Button, LinkButton } from './button';

describe('Button', () => {
  it('maps the ghost variant to its BEM class', () => {
    render(<Button variant="ghost">Cancel</Button>);
    expect(screen.getByRole('button', { name: 'Cancel' }).className).toBe(
      'govbb-button govbb-button--ghost',
    );
  });

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

describe('LinkButton', () => {
  it('is an anchor with button classes and no button role', () => {
    render(
      <LinkButton href="/start" variant="secondary">
        Start now
      </LinkButton>,
    );
    const link = screen.getByRole('link', { name: 'Start now' });
    expect(link.getAttribute('href')).toBe('/start');
    expect(link.className).toBe('govbb-button govbb-button--secondary');
  });

  it('renders with a custom link component', () => {
    render(
      <LinkButton
        href="/start"
        linkComponent={(props) => <a data-router {...props} />}
      >
        Start now
      </LinkButton>,
    );
    expect(
      screen
        .getByRole('link', { name: 'Start now' })
        .getAttribute('data-router'),
    ).not.toBeNull();
  });

  it('adds safe defaults for an external destination', () => {
    render(
      <LinkButton href="https://example.org/start" external>
        Start externally
      </LinkButton>,
    );
    const link = screen.getByRole('link', { name: 'Start externally' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <>
      <Button variant="secondary">Save and continue</Button>
      <LinkButton href="/start">Start now</LinkButton>
    </>,
  );
  await expectNoAxeViolations(container);
});
