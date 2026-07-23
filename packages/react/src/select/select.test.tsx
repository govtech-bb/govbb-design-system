import { Label } from '../form/form';
import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Select } from './select';

describe('Select', () => {
  it('renders a govbb-select and forwards the ref', () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Select ref={ref} aria-label="Parish">
        <option value="a">A</option>
      </Select>,
    );
    expect(ref.current).toBe(screen.getByRole('combobox', { name: 'Parish' }));
    expect(ref.current!.className).toBe('govbb-select');
  });

  it('renders options from the options prop', () => {
    render(
      <Select
        label="Parish"
        options={[
          { value: '', label: 'Select a parish', disabled: true },
          { value: 'st-michael', label: 'Saint Michael' },
        ]}
      />,
    );
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect((options[0] as HTMLOptionElement).disabled).toBe(true);
    expect((options[1] as HTMLOptionElement).value).toBe('st-michael');
    expect(options[1].textContent).toBe('Saint Michael');
  });

  it('prefers options over children when both are given', () => {
    render(
      <Select aria-label="Parish" options={[{ value: 'a', label: 'A' }]}>
        <option value="b">B</option>
      </Select>,
    );
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'A' })).toBeDefined();
  });

  it('does not allow multiple selection', () => {
    render(
      // @ts-expect-error multiple-choice answers use CheckboxGroup.
      <Select aria-label="Roles" multiple>
        <option value="admin">Admin</option>
      </Select>,
    );
    expect((screen.getByRole('combobox') as HTMLSelectElement).multiple).toBe(
      false,
    );
  });
});

it('has no axe violations', async () => {
  const { container } = render(
    <>
      <Label htmlFor="sel">Parish</Label>
      <Select id="sel">
        <option value="">Select a parish</option>
        <option value="st-michael">Saint Michael</option>
      </Select>
    </>,
  );
  await expectNoAxeViolations(container);
});
