import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fieldset, Hint } from '../../packages/react/src/form/form';
import { Input } from '../../packages/react/src/input/input';

const meta = {
  title: 'Components/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  args: { legend: 'Your address' },
  render: (args) => (
    <Fieldset {...args}>
      <Hint>Enter the address where you usually live.</Hint>
      <Input label="Address line 1" name="address-line-1" />
      <Input label="Town or city" name="town" />
    </Fieldset>
  ),
} satisfies Meta<typeof Fieldset>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
