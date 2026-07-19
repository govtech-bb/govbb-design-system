import { expectNoAxeViolations } from '../testing/axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Checkbox, CheckboxGroup } from './checkbox';

describe('Checkbox', () => {
  it('wires the label to the input and toggles on label click', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="I agree" />);
    const input = screen.getByRole('checkbox', { name: 'I agree' });
    expect(ref.current).toBe(input);
    fireEvent.click(screen.getByText('I agree'));
    expect(ref.current!.checked).toBe(true);
  });

  it('respects an explicit id', () => {
    render(<Checkbox id="terms" label="Terms" />);
    expect(screen.getByRole('checkbox', { name: 'Terms' }).id).toBe('terms');
  });

  it('renders the conditional as a sibling of the item', () => {
    const { container } = render(
      <Checkbox name="contact" label="Email" conditional={<p>Address?</p>} />,
    );
    const item = container.querySelector('.govbb-checkbox-item');
    expect(item?.nextElementSibling?.className).toBe(
      'govbb-checkbox-item__conditional',
    );
    expect(
      screen
        .getByRole('checkbox', { name: 'Email' })
        .getAttribute('aria-controls'),
    ).toBe(item?.nextElementSibling?.id);
  });

  it('wires a per-option hint via aria-describedby', () => {
    render(
      <Checkbox
        label="British"
        hint="Including English, Scottish, Welsh and Northern Irish"
      />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'British' });
    const hint = screen.getByText(
      'Including English, Scottish, Welsh and Northern Irish',
    );
    expect(hint.className).toBe('govbb-hint');
    expect(checkbox.getAttribute('aria-describedby')).toBe(hint.id);
  });
});

describe('CheckboxGroup', () => {
  it('wraps children in a fieldset with legend and error', () => {
    const { container } = render(
      <CheckboxGroup legend="Select all that apply" error="Choose at least one">
        <Checkbox label="Email" value="email" />
        <Checkbox label="Phone" value="phone" />
      </CheckboxGroup>,
    );
    const group = screen.getByRole('group', { name: /select all that apply/i });
    expect(group.parentElement).toBe(
      container.querySelector('.govbb-form-group'),
    );
    const error = screen.getByText('Choose at least one');
    expect(error.className).toBe('govbb-error-message');
    expect(error.getAttribute('role')).toBe('alert');
    expect(group.getAttribute('aria-describedby')).toBe(error.id);
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('forwards a ref and extra attributes to the fieldset', () => {
    const ref = { current: null as HTMLFieldSetElement | null };
    render(
      <CheckboxGroup
        ref={(el) => {
          ref.current = el;
        }}
        legend="Contact"
        id="contact-group"
        data-testid="group"
      >
        <Checkbox label="Email" value="email" />
      </CheckboxGroup>,
    );
    expect(ref.current?.tagName).toBe('FIELDSET');
    expect(ref.current?.id).toBe('contact-group');
  });

  it('shows the error and drops the group hint if both are passed', () => {
    render(
      // @ts-expect-error hint/error are mutually exclusive
      <CheckboxGroup
        legend="Select all that apply"
        hint="Leave blank any that do not"
        error="Choose at least one"
      >
        <Checkbox label="Email" value="email" />
      </CheckboxGroup>,
    );
    const group = screen.getByRole('group', { name: /select all that apply/i });
    const error = screen.getByText('Choose at least one');
    expect(screen.queryByText('Leave blank any that do not')).toBeNull();
    expect(group.getAttribute('aria-describedby')).toBe(error.id);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <CheckboxGroup legend="Select all that apply">
        <Checkbox label="Email" value="email" conditional={<p>Address?</p>} />
        <Checkbox label="Phone" value="phone" />
      </CheckboxGroup>,
    );
    await expectNoAxeViolations(container);
  });
});

it('has no axe violations', async () => {
  const { container } = render(<Checkbox label="I agree to the terms" />);
  await expectNoAxeViolations(container);
});
