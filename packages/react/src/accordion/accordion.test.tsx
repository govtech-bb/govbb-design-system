import { expectNoAxeViolations } from '../testing/axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionSection } from './accordion';

function example(props: { name?: string } = {}) {
  return (
    <Accordion>
      <AccordionSection heading="Writing well" {...props}>
        <p>Keep sentences short.</p>
      </AccordionSection>
      <AccordionSection
        heading="Writing for specialists"
        hint="Acronyms, jargon and terms of art"
        {...props}
      >
        <p>Explain the acronym the first time.</p>
      </AccordionSection>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders each section as a details that toggles open', () => {
    const { container } = render(example());
    const [first] = container.querySelectorAll('details');
    expect(first.open).toBe(false);
    fireEvent.click(screen.getByText('Writing well'));
    expect(first.open).toBe(true);
  });

  it('renders the heading at the requested level', () => {
    render(
      <Accordion>
        <AccordionSection heading="Fees" headingLevel={2}>
          <p>Fees apply.</p>
        </AccordionSection>
      </Accordion>,
    );
    expect(
      screen.getByRole('heading', { name: 'Fees', level: 2 }),
    ).toBeTruthy();
  });

  it('passes name through so the group can be exclusive', () => {
    const { container } = render(example({ name: 'guidance' }));
    for (const details of container.querySelectorAll('details')) {
      expect(details.getAttribute('name')).toBe('guidance');
    }
  });

  it('shares one generated name when multiple expanded is off', () => {
    const { container } = render(
      <Accordion allowsMultipleExpanded={false}>
        <AccordionSection heading="One">a</AccordionSection>
        <AccordionSection heading="Two">b</AccordionSection>
      </Accordion>,
    );
    const [first, second] = container.querySelectorAll('details');
    expect(first.getAttribute('name')).toBeTruthy();
    expect(first.getAttribute('name')).toBe(second.getAttribute('name'));
  });

  it('leaves sections unnamed when multiple expanded is on', () => {
    const { container } = render(example());
    for (const details of container.querySelectorAll('details')) {
      expect(details.getAttribute('name')).toBeNull();
    }
  });

  it('applies the framing variant', () => {
    const { container } = render(
      <Accordion variant="divided">
        <AccordionSection heading="One">a</AccordionSection>
      </Accordion>,
    );
    const root = container.querySelector('.govbb-accordion')!;
    expect(root.className).toContain('govbb-accordion--divided');
  });

  it.each(['boxed', 'cards'] as const)('applies the %s frame', (variant) => {
    const { container } = render(
      <Accordion variant={variant}>
        <AccordionSection heading="One">a</AccordionSection>
      </Accordion>,
    );
    expect(container.querySelector('.govbb-accordion')!.className).toContain(
      `govbb-accordion--${variant}`,
    );
  });

  it('renders the icon as decoration and the hint as part of the row', () => {
    const { container } = render(
      <Accordion>
        <AccordionSection
          heading="Fees"
          hint="What you pay and when"
          icon={<svg viewBox="0 0 16 16" />}
        >
          <p>Fees apply.</p>
        </AccordionSection>
      </Accordion>,
    );
    const icon = container.querySelector('.govbb-accordion__icon')!;
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.querySelector('svg')).toBeTruthy();
    // The hint belongs to the summary, so it reads as part of the control.
    expect(
      screen.getByText('What you pay and when').closest('summary'),
    ).toBeTruthy();
  });

  it('keeps a nested accordion out of the outer exclusive group', () => {
    const { container } = render(
      <Accordion allowsMultipleExpanded={false}>
        <AccordionSection heading="Outer">
          <Accordion>
            <AccordionSection heading="Inner">x</AccordionSection>
          </Accordion>
        </AccordionSection>
      </Accordion>,
    );
    const [outer, inner] = container.querySelectorAll('details');
    expect(outer.getAttribute('name')).toBeTruthy();
    expect(inner.getAttribute('name')).toBeNull();
  });

  it('stops a disabled section opening and takes it out of the tab order', () => {
    const { container } = render(
      <Accordion disabled>
        <AccordionSection heading="One">a</AccordionSection>
      </Accordion>,
    );
    const summary = container.querySelector('summary')!;
    const details = container.querySelector('details')!;

    expect(summary.getAttribute('aria-disabled')).toBe('true');
    expect(summary.getAttribute('tabindex')).toBe('-1');
    fireEvent.click(summary);
    expect(details.open).toBe(false);
  });

  it('has no axe violations', async () => {
    const { container } = render(example());
    await expectNoAxeViolations(container);
  });
});
