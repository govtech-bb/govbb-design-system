import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Heading, Text } from './typography';

describe('Heading', () => {
  it('sizes to its level by default', () => {
    render(<Heading as="h3">Sub-section</Heading>);
    expect(screen.getByRole('heading', { level: 3 }).className).toBe(
      'govbb-text-h3',
    );
  });

  it('decouples visual size from heading level', () => {
    render(
      <Heading as="h1" size="h2">
        Register a birth
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 1 }).className).toBe(
      'govbb-text-h2',
    );
  });

  it('defaults to h2', () => {
    render(<Heading>Section</Heading>);
    expect(screen.getByRole('heading', { level: 2 }).className).toBe(
      'govbb-text-h2',
    );
  });
});

describe('Text', () => {
  it('renders a body paragraph by default', () => {
    render(<Text>Body copy</Text>);
    const el = screen.getByText('Body copy');
    expect(el.tagName).toBe('P');
    expect(el.className).toBe('govbb-text-body');
  });

  it('maps element, size and weight', () => {
    render(
      <Text as="span" size="caption" weight="bold">
        Hint
      </Text>,
    );
    const el = screen.getByText('Hint');
    expect(el.tagName).toBe('SPAN');
    expect(el.className).toBe('govbb-text-caption govbb-text-bold');
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <>
      <Heading as="h1">Register a birth</Heading>
      <Text>Use this service to register a birth in Barbados.</Text>
    </>,
  );
  await expectNoAxeViolations(container);
});
