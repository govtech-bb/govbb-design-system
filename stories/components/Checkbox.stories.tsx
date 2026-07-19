import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Checkbox,
  CheckboxGroup,
} from '../../packages/react/src/checkbox/checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: CheckboxGroup,
  tags: ['autodocs'],
  args: {
    legend: 'How would you like to be contacted?',
    hint: 'Select all that apply',
    children: null,
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Checkbox name="contact" value="email" label="Email" />
      <Checkbox name="contact" value="phone" label="Phone" />
      <Checkbox
        name="contact"
        value="other"
        label="Another way"
        conditional={<p>Tell us how you would like to be contacted.</p>}
      />
    </CheckboxGroup>
  ),
} satisfies Meta<typeof CheckboxGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Group: Story = { args: {} };
export const Error: Story = {
  args: {
    legend: 'How would you like to be contacted?',
    children: null,
    hint: undefined,
    error: 'Select at least one option',
  },
};
