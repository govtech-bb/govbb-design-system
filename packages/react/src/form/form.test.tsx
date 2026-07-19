import { Input } from '../input/input';
import { expectNoAxeViolations } from '../testing/axe';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorMessage, Fieldset, FormGroup, Hint, Label } from './form';

describe('form scaffolding', () => {
  it('renders group, label, hint and error message with their classes', () => {
    render(
      <FormGroup data-testid="group">
        <Label htmlFor="f">Full name</Label>
        <Hint>As it appears on your ID</Hint>
        <ErrorMessage>Enter your name</ErrorMessage>
      </FormGroup>,
    );
    expect(screen.getByTestId('group').className).toBe('govbb-form-group');
    expect(screen.getByText('Full name').className).toBe('govbb-label');
    expect(screen.getByText('As it appears on your ID').className).toBe(
      'govbb-hint',
    );
    expect(screen.getByText('Enter your name').className).toBe(
      'govbb-error-message',
    );
  });

  it('Fieldset renders an optional legend', () => {
    const { container } = render(<Fieldset legend="Where do you live?" />);
    const fieldset = screen.getByRole('group', { name: 'Where do you live?' });
    expect(fieldset.className).toBe('govbb-fieldset');
    expect(fieldset.parentElement).toBe(
      container.querySelector('.govbb-form-group'),
    );
    expect(fieldset.querySelector('.govbb-fieldset__legend')).not.toBeNull();
  });
});

it('prefixes error messages with a hidden "Error:" for screen readers', () => {
  render(<ErrorMessage>Enter your full name</ErrorMessage>);
  const error = screen.getByText('Enter your full name');
  const prefix = error.closest('.govbb-error-message')!.firstElementChild!;
  expect(prefix.className).toBe('govbb-visually-hidden');
  expect(prefix.textContent).toBe('Error: ');
});

it('has no axe violations', async () => {
  const { container } = render(
    <FormGroup>
      <Label htmlFor="fg-input">Full name</Label>
      <Hint id="fg-hint">As it appears on your ID</Hint>
      <ErrorMessage id="fg-err">Enter your full name</ErrorMessage>
      <Input id="fg-input" aria-describedby="fg-hint fg-err" aria-invalid />
    </FormGroup>,
  );
  await expectNoAxeViolations(container);
});
