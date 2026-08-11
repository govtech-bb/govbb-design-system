import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, TextArea } from '../../packages/react/src/input/input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'National registration number',
    description: 'For example, 123456-7890',
    name: 'national-id',
  },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = {
  args: { error: 'Enter a registration number' },
};
export const Multiline: Story = {
  render: () => (
    <TextArea
      label="Additional information"
      description="Do not include sensitive information."
      rows={5}
    />
  ),
};
