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

  it('keeps its native input type fixed', () => {
    // @ts-expect-error Checkbox intentionally does not expose the native type prop.
    render(<Checkbox label="Terms" type="text" />);
    expect(screen.getByRole('checkbox', { name: 'Terms' })).toBeDefined();
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

  it('wires a per-option description via aria-describedby', () => {
    render(
      <Checkbox
        label="British"
        description="Including English, Scottish, Welsh and Northern Irish"
      />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'British' });
    const description = screen.getByText(
      'Including English, Scottish, Welsh and Northern Irish',
    );
    expect(description.className).toBe('govbb-hint');
    expect(checkbox.getAttribute('aria-describedby')).toBe(description.id);
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

  it('keeps the group description when an error is shown and announces both', () => {
    render(
      <CheckboxGroup
        legend="Select all that apply"
        description="Leave blank any that do not"
        error="Choose at least one"
      >
        <Checkbox label="Email" value="email" />
      </CheckboxGroup>,
    );
    const group = screen.getByRole('group', { name: /select all that apply/i });
    const description = screen.getByText('Leave blank any that do not');
    const error = screen.getByText('Choose at least one');
    expect(group.getAttribute('aria-describedby')).toBe(
      `${description.id} ${error.id}`,
    );
  });

  it('marks its checkboxes invalid when the group is in error', () => {
    render(
      <CheckboxGroup legend="Pick some" error="Select at least one">
        <Checkbox name="a" label="One" />
        <Checkbox name="b" label="Two" />
      </CheckboxGroup>,
    );
    for (const box of screen.getAllByRole('checkbox')) {
      expect(box.getAttribute('aria-invalid')).toBe('true');
    }
  });

  it('leaves its checkboxes valid when there is no error', () => {
    render(
      <CheckboxGroup legend="Pick some">
        <Checkbox name="a" label="One" />
      </CheckboxGroup>,
    );
    expect(
      screen.getByRole('checkbox').getAttribute('aria-invalid'),
    ).toBeNull();
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
