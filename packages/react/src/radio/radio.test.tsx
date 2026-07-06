import { Fieldset } from '../form/form';
import { expectNoAxeViolations } from '../testing/axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Radio } from './radio';

describe('Radio', () => {
  it('groups by name', () => {
    render(
      <>
        <Radio name="parish" label="Saint Michael" />
        <Radio name="parish" label="Christ Church" />
      </>,
    );
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios).toHaveLength(2);
    fireEvent.click(radios[0]);
    expect(radios[0].checked).toBe(true);
    fireEvent.click(radios[1]);
    expect(radios[0].checked).toBe(false);
  });

  it('renders the conditional as a sibling of the item', () => {
    const { container } = render(
      <Radio name="p" label="Other" conditional={<p>Which one?</p>} />,
    );
    const item = container.querySelector('.govbb-radio-item');
    expect(item?.nextElementSibling?.className).toBe(
      'govbb-radio-item__conditional',
    );
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <Fieldset legend="Where do you live?">
      <Radio name="parish" label="Saint Michael" />
      <Radio name="parish" label="Other" conditional={<p>Which parish?</p>} />
    </Fieldset>,
  );
  await expectNoAxeViolations(container);
});

it('wires a per-option hint via aria-describedby', () => {
  render(
    <Radio
      name="contact"
      label="Email"
      hint="We'll only use this for updates."
    />,
  );
  const radio = screen.getByRole('radio', { name: 'Email' });
  const hint = screen.getByText("We'll only use this for updates.");
  expect(hint.className).toBe('govbb-hint');
  expect(radio.getAttribute('aria-describedby')).toBe(hint.id);
});
