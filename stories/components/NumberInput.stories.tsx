import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { FormGroup, Hint, Label } from '../../packages/react/src/form/form';
import { NumberInput } from '../../packages/react/src/number-input/number-input';

const meta = {
  title: 'Components/Number input',
  component: NumberInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    id: 'quantity',
    name: 'quantity',
    labelId: 'quantity-label',
    min: 1,
    max: 10,
    step: 1,
    defaultValue: 1,
    'aria-describedby': 'quantity-hint',
  },
  render: (args) => (
    <FormGroup>
      <Label id="quantity-label" htmlFor="quantity">
        Quantity
      </Label>
      <Hint id="quantity-hint">Between 1 and 10</Hint>
      <NumberInput {...args} />
    </FormGroup>
  ),
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AtMinimum: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Decrement' }),
    ).toBeDisabled();
    await expect(
      canvas.getByRole('button', { name: 'Increment' }),
    ).toBeEnabled();
  },
};

export const AtMaximum: Story = {
  args: {
    defaultValue: 10,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Increment' }),
    ).toBeDisabled();
    await expect(
      canvas.getByRole('button', { name: 'Decrement' }),
    ).toBeEnabled();
  },
};

export const ReachesMaximum: Story = {
  args: {
    defaultValue: 9,
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('spinbutton', { name: 'Quantity' });
    const increment = canvas.getByRole('button', { name: 'Increment' });
    const decrement = canvas.getByRole('button', { name: 'Decrement' });

    await userEvent.click(increment);

    await expect(input).toHaveValue(10);
    await expect(increment).toBeDisabled();
    await expect(decrement).toBeEnabled();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
