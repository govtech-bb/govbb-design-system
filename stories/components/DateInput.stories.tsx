import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateInput } from '../../packages/react/src/date-input/date-input';

const meta = {
  title: 'Components/Date input',
  component: DateInput,
  tags: ['autodocs'],
  args: {
    legend: 'Date of birth',
    description: 'For example, 27 3 1990',
    name: 'dob',
  },
} satisfies Meta<typeof DateInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = {
  args: { error: 'Enter a valid date' },
};
