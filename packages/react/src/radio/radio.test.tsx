import { Fieldset } from '../form/form';
import { expectNoAxeViolations } from '../testing/axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './radio';

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

  it('keeps its native input type fixed', () => {
    // @ts-expect-error Radio intentionally does not expose the native type prop.
    render(<Radio name="answer" label="Yes" type="text" />);
    expect(screen.getByRole('radio', { name: 'Yes' })).toBeDefined();
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

describe('RadioGroup', () => {
  it('controls its children: name, checked from value, onValueChange', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <RadioGroup
        legend="Are you self-employed?"
        name="employment"
        value="no"
        onValueChange={onValueChange}
      >
        <Radio label="Yes" value="yes" />
        <Radio label="No" value="no" />
      </RadioGroup>,
    );
    const [yes, no] = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(yes.closest('.govbb-fieldset')?.parentElement).toBe(
      container.querySelector('.govbb-form-group'),
    );
    expect(yes.name).toBe('employment');
    expect(no.checked).toBe(true);
    expect(yes.checked).toBe(false);
    fireEvent.click(yes);
    expect(onValueChange).toHaveBeenCalledWith('yes');
  });

  it('announces a group-level error via the fieldset', () => {
    render(
      <RadioGroup legend="Choose one" name="c" error="Select yes or no">
        <Radio label="Yes" value="yes" />
      </RadioGroup>,
    );
    const group = screen.getByRole('group');
    const error = screen.getByText('Select yes or no');
    expect(error.className).toBe('govbb-error-message');
    expect(error.getAttribute('role')).toBe('alert');
    expect(group.getAttribute('aria-describedby')).toBe(error.id);
  });

  it('forwards a ref and extra attributes to the fieldset', () => {
    const ref = { current: null as HTMLFieldSetElement | null };
    render(
      <RadioGroup
        ref={(el) => {
          ref.current = el;
        }}
        legend="Choose one"
        name="c"
        id="choose-one"
      >
        <Radio label="Yes" value="yes" />
      </RadioGroup>,
    );
    expect(ref.current?.tagName).toBe('FIELDSET');
    expect(ref.current?.id).toBe('choose-one');
  });

  it('marks its radios invalid when the group is in error', () => {
    render(
      <RadioGroup legend="Choose one" name="c" error="Select yes or no">
        <Radio label="Yes" value="yes" />
        <Radio label="No" value="no" />
      </RadioGroup>,
    );
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio.getAttribute('aria-invalid')).toBe('true');
    }
  });

  it('leaves its radios valid when there is no error', () => {
    render(
      <RadioGroup legend="Choose one" name="c">
        <Radio label="Yes" value="yes" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio').getAttribute('aria-invalid')).toBeNull();
  });

  it('lets a radio override the group error marking', () => {
    render(
      <RadioGroup legend="Choose one" name="c" error="Select yes or no">
        <Radio label="Yes" value="yes" aria-invalid={false} />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio').getAttribute('aria-invalid')).toBe(
      'false',
    );
  });

  it('keeps the group description when an error is shown and announces both', () => {
    render(
      <RadioGroup
        legend="Choose one"
        name="c"
        description="Pick one"
        error="Required"
      >
        <Radio label="Yes" value="yes" />
      </RadioGroup>,
    );
    const group = screen.getByRole('group');
    const description = screen.getByText('Pick one');
    const error = screen.getByText('Required');
    expect(group.getAttribute('aria-describedby')).toBe(
      `${description.id} ${error.id}`,
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <RadioGroup
        legend="Are you self-employed?"
        name="employment"
        description="Choose one"
        value="no"
      >
        <Radio label="Yes" value="yes" />
        <Radio label="No" value="no" />
      </RadioGroup>,
    );
    await expectNoAxeViolations(container);
  });
});

it('renders no aria-expanded on controlled conditional radios (invalid on the radio role)', async () => {
  const { container } = render(
    <Fieldset legend="Where do you live?">
      <Radio
        name="parish"
        label="Saint Michael"
        checked={false}
        onChange={() => {}}
      />
      <Radio
        name="parish"
        label="Other"
        checked
        onChange={() => {}}
        conditional={<p>Which parish?</p>}
      />
    </Fieldset>,
  );
  for (const radio of screen.getAllByRole('radio')) {
    expect(radio.hasAttribute('aria-expanded')).toBe(false);
  }
  await expectNoAxeViolations(container);
});

it('wires a per-option description via aria-describedby', () => {
  render(
    <Radio
      name="contact"
      label="Email"
      description="We'll only use this for updates."
    />,
  );
  const radio = screen.getByRole('radio', { name: 'Email' });
  const description = screen.getByText("We'll only use this for updates.");
  expect(description.className).toBe('govbb-hint');
  expect(radio.getAttribute('aria-describedby')).toBe(description.id);
});
