import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pill } from './pill';

describe('Pill', () => {
  it('renders a span with the pill class', () => {
    render(<Pill>Digital service</Pill>);
    const pill = screen.getByText('Digital service');
    expect(pill.tagName).toBe('SPAN');
    expect(pill.className).toBe('govbb-pill');
  });
});

it('has no axe violations', async () => {
  const { container } = render(<Pill>Information service</Pill>);
  await expectNoAxeViolations(container);
});
