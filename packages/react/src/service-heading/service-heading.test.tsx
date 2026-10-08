import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ServiceHeading } from './service-heading';

describe('ServiceHeading', () => {
  it('renders the question as the h1 with the service and description around it', () => {
    const { container } = render(
      <ServiceHeading
        description="We ask so we can check you are allowed to make this request."
        service="Redirect my business"
      >
        Tell us what position you hold in the business
      </ServiceHeading>,
    );

    expect(container.firstElementChild!.className).toBe(
      'govbb-service-heading',
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Tell us what position you hold in the business',
      }).className,
    ).toBe('govbb-text-h1');
    expect(screen.getByText('Redirect my business').tagName).toBe('P');
    expect(
      screen.getByText(
        'We ask so we can check you are allowed to make this request.',
      ).className,
    ).toBe('govbb-service-heading__description');
  });

  it('keeps the service name out of the document outline', () => {
    render(
      <ServiceHeading service="Redirect my business">Question</ServiceHeading>,
    );

    expect(screen.getAllByRole('heading')).toHaveLength(1);
  });

  it('omits the optional parts', () => {
    const { container } = render(<ServiceHeading>Question</ServiceHeading>);

    expect(
      container.querySelector('.govbb-service-heading__service'),
    ).toBeNull();
    expect(
      container.querySelector('.govbb-service-heading__description'),
    ).toBeNull();
  });

  it('takes a lower level and an independent size', () => {
    render(
      <ServiceHeading as="h2" size="h1">
        Section question
      </ServiceHeading>,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Section question' })
        .className,
    ).toBe('govbb-text-h1');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ServiceHeading description="Description" service="Redirect my business">
        Tell us what position you hold in the business
      </ServiceHeading>,
    );
    await expectNoAxeViolations(container);
  });
});
