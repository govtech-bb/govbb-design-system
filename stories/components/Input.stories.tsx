import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Textarea } from '../../packages/react/src/input/input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'National registration number',
    hint: 'For example, 123456-7890',
    name: 'national-id',
  },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = {
  args: { hint: undefined, error: 'Enter a registration number' },
};
export const Multiline: Story = {
  render: () => (
    <Textarea
      label="Additional information"
      hint="Do not include sensitive information."
      rows={5}
    />
  ),
};
